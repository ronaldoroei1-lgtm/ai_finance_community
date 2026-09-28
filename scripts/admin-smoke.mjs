/** Isolated HTTP checks; never touches production or the site's saved data. */
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = await mkdtemp(path.join(tmpdir(), 'ai-finance-admin-test-'));
const password = randomBytes(32).toString('hex');
async function freePort() {
  const socket = createServer();
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve); });
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  return port;
}
async function start(configured = true) {
  const port = await freePort();
  const env = { ...process.env, PORT: String(port), DATA_DIR: dataDir, NODE_ENV: 'test' };
  if (configured) env.ADMIN_PASSWORD = password;
  else delete env.ADMIN_PASSWORD;
  const child = spawn(process.execPath, [path.join(root, 'node_modules/tsx/dist/cli.mjs'), 'server/index.ts'], { cwd: root, env, stdio: 'pipe' });
  let output = '';
  child.stdout.on('data', data => { output += data; });
  child.stderr.on('data', data => { output += data; });
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error(`Server exited: ${output}`);
    try { if ((await fetch(`${url}/api/content`)).ok) return { child, url }; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  child.kill();
  throw new Error(`Server did not start: ${output}`);
}
async function stop(child) {
  if (child.exitCode !== null) return;
  const exited = new Promise(resolve => child.once('exit', resolve));
  child.kill('SIGTERM');
  await exited;
}
let current;
try {
  current = await start();
  const request = (route, options = {}) => fetch(`${current.url}${route}`, options);
  const json = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const original = await readFile(path.join(dataDir, 'content.json'), 'utf8');
  let response = await request('/api/upload', { method: 'POST', headers: { 'Content-Type': 'multipart/form-data; boundary=broken' }, body: 'invalid multipart' });
  assert.equal(response.status, 401, 'Authorization must run before multipart parsing');
  assert.deepEqual(await readdir(path.join(dataDir, 'uploads')), [], 'Unauthorized request must not write files');
  assert.equal((await request('/api/login', json({ password: 'incorrect' }))).status, 401);
  response = await request('/api/login', json({ password }));
  assert.equal(response.status, 200);
  const { token } = await response.json();
  assert.equal(typeof token, 'string');
  assert.equal(await readFile(path.join(dataDir, 'content.json'), 'utf8'), original, 'Login must not rewrite content');
  assert.ok(!(await readdir(dataDir)).includes('content.json.backup'), 'Login must not create backup');
  response = await request('/api/content');
  const revision = response.headers.get('x-content-revision');
  const content = await response.json();
  const save = (value, version = revision) => ({ ...json({ content: value }), headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'If-Match': version } });
  assert.equal((await request('/api/content', json({ content }))).status, 401);
  assert.equal((await request('/api/content', save({ hero: {} }))).status, 400);
  assert.equal((await request('/api/content', save({ ...content, hero: { ...content.hero, businessWhatsappUrl: 'javascript:alert(1)' } }))).status, 400);
  const updated = { ...content, about: { ...content.about, text: `${content.about.text}\nSmoke test` } };
  delete updated.contact.instagramUrl;
  response = await request('/api/content', save(updated));
  assert.equal(response.status, 200, 'Existing content without optional Instagram must save');
  const nextRevision = response.headers.get('x-content-revision');
  assert.notEqual(nextRevision, revision);
  assert.equal(await readFile(path.join(dataDir, 'content.json.backup'), 'utf8'), original);
  assert.equal((await request('/api/content', save(content))).status, 409, 'Stale saves must be rejected');
  const pair = await Promise.all([
    request('/api/content', save({ ...updated, about: { text: 'First concurrent update' } }, nextRevision)),
    request('/api/content', save({ ...updated, about: { text: 'Second concurrent update' } }, nextRevision)),
  ]);
  assert.deepEqual(pair.map(item => item.status).sort(), [200, 409], 'Concurrent writes cannot both pass same revision');
  const invalid = new FormData();
  invalid.append('image', new Blob(['<script>bad</script>'], { type: 'image/png' }), 'fake.png');
  assert.equal((await request('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: invalid })).status, 400);
  const real = new FormData();
  const pixel = await sharp({ create: { width: 2, height: 2, channels: 3, background: '#ffffff' } }).png().toBuffer();
  real.append('image', new Blob([pixel], { type: 'image/png' }), '../../unsafe.html');
  response = await request('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: real });
  assert.equal(response.status, 200, 'Actual image decodes and is re-encoded');
  const uploaded = await response.json();
  assert.match(uploaded.url, /^\/images\/uploads\/[a-f0-9-]+\.webp$/);
  response = await request(uploaded.url);
  assert.equal(response.headers.get('content-type'), 'image/webp');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal((await request('/api/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })).status, 200);
  assert.equal((await request('/api/content', save(content))).status, 401, 'Logout revokes token');
  await stop(current.child);
  current = await start(false);
  assert.equal((await request('/api/login', json({ password }))).status, 503, 'No configured password must disable login');
  assert.equal((await request('/api/content', save(content))).status, 401);
  console.log('PASS: authorization, read-only login, schema validation, atomic backup, conflict prevention, safe uploads, logout and disabled-admin mode.');
} finally {
  if (current) await stop(current.child);
  await rm(dataDir, { recursive: true, force: true });
}
