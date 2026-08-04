#!/usr/bin/env node
/**
 * Generates sitemap.xml and a blog RSS feed from the compiled blog data.
 * Run after `vite build` (which copies client/public/sitemap.xml as a
 * static fallback) - this overwrites dist/public/sitemap.xml with the
 * real, dynamic list of URLs including every published post, and writes
 * dist/public/blog/rss.xml.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, SITE_NAME } from "./site-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DIST_PUBLIC = path.join(ROOT, "dist", "public");
const DATA_PATH = path.join(__dirname, ".data", "blog-data.json");

if (!existsSync(DATA_PATH)) {
  console.error(`Cannot build sitemap: ${path.relative(ROOT, DATA_PATH)} not found. Run "node scripts/blog/build.mjs" first.`);
  process.exit(1);
}
const { posts } = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

const today = new Date().toISOString().slice(0, 10);
const latestPostUpdate = posts.reduce((max, p) => (p.updatedAt > max ? p.updatedAt : max), today);

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const urls = [
  urlEntry(`${SITE_URL}/`, today, "weekly", "1.0"),
  urlEntry(`${SITE_URL}/blog/`, latestPostUpdate, "weekly", "0.8"),
  ...posts.map((p) => urlEntry(`${SITE_URL}/blog/${p.slug}/`, p.updatedAt, "monthly", "0.7")),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

writeFileSync(path.join(DIST_PUBLIC, "sitemap.xml"), sitemap, "utf-8");

// ── RSS feed ────────────────────────────────────────────────────────
function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const rssItems = posts
  .map(
    (p) => `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${SITE_URL}/blog/${p.slug}/</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}/</guid>
    <description>${escapeXml(p.description)}</description>
    <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
  </item>`
  )
  .join("\n");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_NAME)} - בלוג</title>
  <link>${SITE_URL}/blog/</link>
  <description>מדריכים מעשיים לשילוב בינה מלאכותית בעבודת מחלקות כספים בישראל.</description>
  <language>he-IL</language>
${rssItems}
</channel>
</rss>
`;

const blogDir = path.join(DIST_PUBLIC, "blog");
mkdirSync(blogDir, { recursive: true });
writeFileSync(path.join(blogDir, "rss.xml"), rss, "utf-8");

console.log(`✓ sitemap.xml (${posts.length + 2} urls) and blog/rss.xml (${posts.length} items) written to dist/public/`);
