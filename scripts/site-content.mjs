#!/usr/bin/env node
/**
 * Build-time compiler for the bilingual redesign (client/src/redesign/Site.tsx).
 *
 * Reads content/blog/*.md (he) and content/blog-en/*.md (en) - same
 * frontmatter schema as scripts/blog/build.mjs, translated text only -
 * compiles markdown to HTML, extracts a TOC and reading time per post,
 * and emits a single bilingual JSON module at
 * client/src/generated/site-data.json shaped as:
 *   { he: { posts, categories, authors }, en: { posts, categories, authors } }
 * which Site.tsx imports directly (`import database from '../generated/site-data.json'`).
 *
 * Run via `node scripts/site-content.mjs`. Exits with code 1 and a full
 * error report if anything fails validation - wired into predev/prebuild/precheck
 * alongside scripts/blog/build.mjs (which still produces generated/blog.ts
 * for the legacy pages).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { frontmatterSchema } from "./blog/schema.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const AUTHORS_DIR = path.join(ROOT, "content", "authors");
const CATEGORIES_FILE = path.join(ROOT, "content", "categories.json");
const PUBLIC_DIR = path.join(ROOT, "client", "public");
const OUT_FILE = path.join(ROOT, "client", "src", "generated", "site-data.json");

const LANGS = [
  { lang: "he", dir: path.join(ROOT, "content", "blog") },
  { lang: "en", dir: path.join(ROOT, "content", "blog-en") },
];

const errors = [];
const warnings = [];
function fail(file, message) {
  errors.push(`✖ ${file}: ${message}`);
}
function warn(file, message) {
  warnings.push(`⚠ ${file}: ${message}`);
}

// ── Authors & categories (shared source, per-language fields) ─────────
if (!existsSync(AUTHORS_DIR)) {
  console.error(`Missing content/authors directory at ${AUTHORS_DIR}`);
  process.exit(1);
}
const rawAuthors = {};
for (const f of readdirSync(AUTHORS_DIR).filter((f) => f.endsWith(".json"))) {
  const data = JSON.parse(readFileSync(path.join(AUTHORS_DIR, f), "utf-8"));
  rawAuthors[data.id] = data;
}
const rawCategories = existsSync(CATEGORIES_FILE) ? JSON.parse(readFileSync(CATEGORIES_FILE, "utf-8")) : [];

function authorsFor(lang) {
  const out = {};
  for (const [id, a] of Object.entries(rawAuthors)) {
    out[id] = {
      id: a.id,
      name: lang === "en" ? a.nameEn || a.name : a.name,
      title: lang === "en" ? a.titleEn || a.title : a.title,
      bio: lang === "en" ? a.bioEn || a.bio : a.bio,
      image: a.image,
      linkedinUrl: a.linkedinUrl,
    };
  }
  return out;
}

function categoriesFor(lang) {
  return rawCategories.map((c) => ({
    id: c.id,
    label: lang === "en" ? c.labelEn || c.label : c.label,
  }));
}

// ── Markdown -> HTML pipeline (mirrors scripts/blog/build.mjs) ────────
function rehypeExternalLinks() {
  return (tree) => {
    function walk(node) {
      if (node.tagName === "a" && typeof node.properties?.href === "string") {
        if (/^https?:\/\//i.test(node.properties.href)) {
          node.properties.target = "_blank";
          node.properties.rel = ["noopener", "noreferrer"];
        }
      }
      for (const child of node.children ?? []) walk(child);
    }
    walk(tree);
  };
}

async function compile(markdown) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeExternalLinks)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}

function extractToc(html) {
  const toc = [];
  const re = /<h([23]) id="([^"]+)">.*?<a[^>]*>(.*?)<\/a><\/h\1>/g;
  let m;
  while ((m = re.exec(html))) {
    toc.push({ level: Number(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, "") });
  }
  return toc;
}

function readingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

async function buildLang(lang, dir) {
  const authors = authorsFor(lang);
  const categories = categoriesFor(lang);
  if (!existsSync(dir)) {
    warnings.push(`No content directory for "${lang}" at ${path.relative(ROOT, dir)} - 0 posts.`);
    return { posts: [], categories, authors };
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  const parsed = [];
  const slugsSeen = new Map();

  for (const file of files) {
    const label = `[${lang}] ${file}`;
    const raw = readFileSync(path.join(dir, file), "utf-8");
    const { data: frontmatter, content: rawBody } = matter(raw);
    let body = rawBody;

    const result = frontmatterSchema.safeParse(frontmatter);
    if (!result.success) {
      for (const issue of result.error.issues) fail(label, `${issue.path.join(".")}: ${issue.message}`);
      continue;
    }
    const fm = result.data;

    if (slugsSeen.has(fm.slug)) {
      fail(label, `duplicate slug "${fm.slug}" also used by ${slugsSeen.get(fm.slug)}`);
    } else {
      slugsSeen.set(fm.slug, file);
    }
    if (!authors[fm.author]) fail(label, `unknown author "${fm.author}"`);

    const h1Matches = [...body.matchAll(/^# .+$/gm)];
    const leadingH1 = /^\s*# .+\n/;
    if (h1Matches.length === 1 && leadingH1.test(body)) {
      body = body.replace(leadingH1, "");
    } else if (h1Matches.length > 0) {
      fail(label, `body must not contain a top-level "# " heading outside a single leading duplicate of the title (found ${h1Matches.length})`);
    }

    const authorSectionMatch = body.match(/\n## (?:אודות המחב[רת]{1,2}|About the author)[\s\S]*$/i);
    if (authorSectionMatch) body = body.slice(0, authorSectionMatch.index);

    const imgPath = path.join(PUBLIC_DIR, fm.featuredImage.replace(/^\//, ""));
    if (!existsSync(imgPath) && fm.status === "published") {
      fail(label, `featuredImage "${fm.featuredImage}" not found at client/public${fm.featuredImage}`);
    }

    parsed.push({ file, frontmatter: fm, body });
  }

  const publishedSlugs = new Set(parsed.filter((p) => p.frontmatter.status === "published").map((p) => p.frontmatter.slug));
  for (const p of parsed) {
    if (p.frontmatter.status !== "published") continue;
    for (const m of p.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\/?\)/g)) {
      if (m[1] !== p.frontmatter.slug && !publishedSlugs.has(m[1])) {
        fail(`[${lang}] ${p.file}`, `broken internal link to /blog/${m[1]}/ - no published post with that slug`);
      }
    }
  }

  if (errors.length > 0) return { posts: [], categories, authors };

  const posts = [];
  for (const p of parsed) {
    if (p.frontmatter.status !== "published") continue;
    const html = await compile(p.body);
    const { tags, status, featured, pillar, lastVerifiedAt, ...rest } = p.frontmatter;
    posts.push({
      ...rest,
      html,
      toc: extractToc(html),
      readingTimeMinutes: readingTime(p.body),
    });
  }
  posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return { posts, categories, authors };
}

const database = {};
for (const { lang, dir } of LANGS) {
  database[lang] = await buildLang(lang, dir);
}

if (errors.length > 0) {
  console.error(`\nsite-content build failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(e);
  if (warnings.length > 0) {
    console.error(`\n${warnings.length} warning(s):\n`);
    for (const w of warnings) console.error(w);
  }
  console.error("\nFix the errors above and re-run the build.\n");
  process.exit(1);
}

if (database.he.posts.length !== database.en.posts.length) {
  warnings.push(
    `Post count mismatch between languages: he=${database.he.posts.length}, en=${database.en.posts.length}. The language switcher on an article page assumes matching slugs exist in both languages.`
  );
}

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} site-content warning(s):\n`);
  for (const w of warnings) console.warn(w);
  console.warn("");
}

mkdirSync(path.dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(database, null, 2), "utf-8");

console.log(
  `✓ site-content OK: he=${database.he.posts.length} post(s), en=${database.en.posts.length} post(s).`
);
console.log(`  → ${path.relative(ROOT, OUT_FILE)}`);
