#!/usr/bin/env node
/**
 * Build-time blog compiler.
 *
 * Reads content/blog/*.md, validates frontmatter against a strict schema,
 * compiles markdown to HTML, extracts a table of contents, and emits a
 * typed data module at client/src/generated/blog.ts that the React app
 * imports directly (no runtime fetch, no CMS round-trip).
 *
 * Run via `node scripts/blog/build.mjs`. Exits with code 1 and a full
 * error report if anything fails validation - this is meant to be wired
 * into the npm "build" and "dev" scripts so bad content never ships.
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
import { frontmatterSchema, AUTHOR_IDS, CATEGORY_IDS } from "./schema.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const BLOG_DIR = path.join(ROOT, "content", "blog");
const AUTHORS_DIR = path.join(ROOT, "content", "authors");
const CATEGORIES_FILE = path.join(ROOT, "content", "categories.json");
const PUBLIC_DIR = path.join(ROOT, "client", "public");
const OUT_FILE = path.join(ROOT, "client", "src", "generated", "blog.ts");
// Plain-JSON mirror of the same data, for the Node-only build scripts
// (prerender.mjs, sitemap.mjs) that can't import a .ts module directly.
const JSON_OUT_FILE = path.join(ROOT, "scripts", "blog", ".data", "blog-data.json");

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];

function fail(file, message) {
  errors.push(`✖ ${file}: ${message}`);
}
function warn(file, message) {
  warnings.push(`⚠ ${file}: ${message}`);
}

// ── Load authors & categories ────────────────────────────────────────
if (!existsSync(AUTHORS_DIR)) {
  console.error(`Missing content/authors directory at ${AUTHORS_DIR}`);
  process.exit(1);
}
const authorFiles = readdirSync(AUTHORS_DIR).filter((f) => f.endsWith(".json"));
const authors = {};
for (const f of authorFiles) {
  const data = JSON.parse(readFileSync(path.join(AUTHORS_DIR, f), "utf-8"));
  authors[data.id] = data;
}
for (const id of AUTHOR_IDS) {
  if (!authors[id]) fail("content/authors", `missing author file for "${id}"`);
}

const categories = existsSync(CATEGORIES_FILE)
  ? JSON.parse(readFileSync(CATEGORIES_FILE, "utf-8"))
  : [];
const categoryIds = categories.map((c) => c.id);
for (const id of CATEGORY_IDS) {
  if (!categoryIds.includes(id)) fail("content/categories.json", `missing category "${id}"`);
}

// ── Load posts ────────────────────────────────────────────────────────
if (!existsSync(BLOG_DIR)) {
  mkdirSync(BLOG_DIR, { recursive: true });
}
const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

if (files.length === 0) {
  warnings.push("No markdown files found in content/blog/ yet - nothing to build.");
}

const parsed = [];
const slugsSeen = new Map();

for (const file of files) {
  const full = path.join(BLOG_DIR, file);
  const raw = readFileSync(full, "utf-8");
  const { data: frontmatter, content: rawBody } = matter(raw);
  let body = rawBody;

  const result = frontmatterSchema.safeParse(frontmatter);
  if (!result.success) {
    for (const issue of result.error.issues) {
      fail(file, `${issue.path.join(".")}: ${issue.message}`);
    }
    continue;
  }
  const fm = result.data;

  // slug must match filename convention (helps avoid drift) - warn only
  const expectedFile = `${fm.slug}.md`;
  if (file !== expectedFile) {
    warn(file, `filename doesn't match slug - expected "${expectedFile}"`);
  }

  // duplicate slug detection
  if (slugsSeen.has(fm.slug)) {
    fail(file, `duplicate slug "${fm.slug}" also used by ${slugsSeen.get(fm.slug)}`);
  } else {
    slugsSeen.set(fm.slug, file);
  }

  // author must exist
  if (!authors[fm.author]) {
    fail(file, `unknown author "${fm.author}"`);
  }

  // The page renders its own H1 from frontmatter.title. Authors commonly
  // write a matching "# Title" as the first line of the body anyway (that's
  // how these six articles were delivered) - auto-strip exactly that case
  // rather than failing the build. Any H1 that ISN'T the single leading
  // line is a real hierarchy problem and still fails the build.
  const h1Matches = [...body.matchAll(/^# .+$/gm)];
  const leadingH1 = /^\s*# .+\n/;
  if (h1Matches.length === 1 && leadingH1.test(body)) {
    body = body.replace(leadingH1, "");
  } else if (h1Matches.length > 0) {
    fail(
      file,
      `body must not contain a top-level "# " heading outside a single leading duplicate of the title (found ${h1Matches.length}) - use "## " and below`
    );
  }

  // Strip a trailing "## אודות המחבר" / "## אודות המחברת" section - the
  // site renders author info from content/authors/*.json via the AuthorBox
  // component instead, so we don't ship two different copies of the same
  // bio that can drift out of sync (see CONTENT-SPECS.md author boxes).
  const authorSectionMatch = body.match(/\n## אודות המחב[רת]{1,2}[\s\S]*$/);
  if (authorSectionMatch) {
    body = body.slice(0, authorSectionMatch.index);
  } else if (fm.status === "published") {
    warn(file, `no trailing "## אודות המחבר/מחברת" section found - AuthorBox will render from content/authors/${fm.author}.json only, nothing was stripped`);
  }

  // updatedAt / lastVerifiedAt should not precede publishedAt
  if (fm.updatedAt < fm.publishedAt) {
    fail(file, `updatedAt (${fm.updatedAt}) is before publishedAt (${fm.publishedAt})`);
  }
  if (fm.lastVerifiedAt < fm.publishedAt) {
    fail(file, `lastVerifiedAt (${fm.lastVerifiedAt}) is before publishedAt (${fm.publishedAt})`);
  }

  // featured image must exist on disk (published posts only - hard error;
  // draft posts get a warning so work-in-progress content doesn't block others)
  const imgPath = path.join(PUBLIC_DIR, fm.featuredImage.replace(/^\//, ""));
  if (!existsSync(imgPath)) {
    const msg = `featuredImage "${fm.featuredImage}" not found at client/public${fm.featuredImage}`;
    if (fm.status === "published") fail(file, msg);
    else warn(file, msg);
  }

  // Responsive image variants, generated by scripts/blog/generate-images.mjs
  // into client/public/images/blog/ as <basename>-<width>.<ext> (640/960/1600,
  // avif/webp/jpg) plus a full-size <basename>.jpg fallback. We only ever
  // wire up a <source>/srcset entry for a width+format we've confirmed
  // exists on disk at build time - a 404'ing <source> does NOT gracefully
  // fall back to <img> in browsers, so this check is not optional.
  const WIDTHS = [640, 960, 1600];
  const imgDir = path.dirname(imgPath);
  const imgBase = path.basename(fm.featuredImage).replace(/\.[a-zA-Z0-9]+$/, "");
  const urlDir = path.dirname(fm.featuredImage);

  function buildSrcset(ext) {
    const parts = WIDTHS.filter((w) => existsSync(path.join(imgDir, `${imgBase}-${w}.${ext}`))).map(
      (w) => `${urlDir}/${imgBase}-${w}.${ext} ${w}w`
    );
    return parts.length > 0 ? parts.join(", ") : undefined;
  }

  const avifSrcset = buildSrcset("avif");
  const webpSrcset = buildSrcset("webp");
  const jpegSrcset = buildSrcset("jpg");
  const fallbackJpeg = path.join(imgDir, `${imgBase}.jpg`);
  const fallbackSrc = existsSync(fallbackJpeg) ? `${urlDir}/${imgBase}.jpg` : fm.featuredImage;

  if (avifSrcset || webpSrcset || jpegSrcset) {
    fm.featuredImageSrcset = {
      avif: avifSrcset,
      webp: webpSrcset,
      jpeg: jpegSrcset,
      fallback: fallbackSrc,
    };
  } else if (fm.status === "published") {
    warn(file, `no responsive image variants found for ${fm.featuredImage} - run "node scripts/blog/generate-images.mjs". Falling back to the single featuredImage file.`);
  }

  parsed.push({ file, frontmatter: fm, body });
}

// ── Internal link check (published posts only, hard error) ────────────
const publishedSlugs = new Set(
  parsed.filter((p) => p.frontmatter.status === "published").map((p) => p.frontmatter.slug)
);
for (const p of parsed) {
  const linkMatches = [...p.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\/?\)/g)];
  for (const m of linkMatches) {
    const targetSlug = m[1];
    if (targetSlug === p.frontmatter.slug) continue;
    if (p.frontmatter.status !== "published") continue; // don't block drafts on forward references
    if (!publishedSlugs.has(targetSlug)) {
      fail(p.file, `broken internal link to /blog/${targetSlug}/ - no published post with that slug`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\nBlog content build failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(e);
  if (warnings.length > 0) {
    console.error(`\n${warnings.length} warning(s):\n`);
    for (const w of warnings) console.error(w);
  }
  console.error("\nFix the errors above and re-run the build.\n");
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`\n${warnings.length} blog content warning(s):\n`);
  for (const w of warnings) console.warn(w);
  console.warn("");
}

// ── Compile markdown -> HTML + extract TOC + reading time ─────────────
function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[֑-ׇ]/g, "") // strip Hebrew niqqud just in case
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

/**
 * Minimal rehype plugin: any absolute http(s) link (i.e. external to the
 * site) opens safely in a new tab. Internal links (/blog/..., /services/...,
 * #anchors) are left as normal same-tab navigation. Written by hand instead
 * of pulling in unist-util-visit for one small recursive walk.
 */
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
  return Math.max(1, Math.round(words / 180)); // ~180 wpm for Hebrew technical reading
}

const posts = [];
for (const p of parsed) {
  if (p.frontmatter.status !== "published") continue;
  const html = await compile(p.body);
  posts.push({
    ...p.frontmatter,
    html,
    toc: extractToc(html),
    readingTimeMinutes: readingTime(p.body),
  });
}

posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

// ── Emit generated/blog.ts ─────────────────────────────────────────────
mkdirSync(path.dirname(OUT_FILE), { recursive: true });

const banner = `// AUTO-GENERATED by scripts/blog/build.mjs - do not edit by hand.\n// Source of truth: content/blog/*.md, content/authors/*.json, content/categories.json\n`;

const tsSource = `${banner}
export interface TocItem {
  level: 2 | 3;
  id: string;
  text: string;
}

export interface Author {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  linkedinUrl: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
}

export interface ImageSrcset {
  avif?: string;
  webp?: string;
  jpeg?: string;
  fallback: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  lastVerifiedAt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featuredImageSrcset?: ImageSrcset;
  featuredImageAlt: string;
  status: "draft" | "published";
  featured: boolean;
  pillar: boolean;
  relatedSlugs: string[];
  html: string;
  toc: TocItem[];
  readingTimeMinutes: number;
}

export const authors: Record<string, Author> = ${JSON.stringify(authors, null, 2)};

export const categories: Category[] = ${JSON.stringify(categories, null, 2)};

export const posts: BlogPost[] = ${JSON.stringify(posts, null, 2)};

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(categoryId: string): BlogPost[] {
  return posts.filter((p) => p.category === categoryId);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  if (post.relatedSlugs.length > 0) {
    const explicit = post.relatedSlugs
      .map((s) => posts.find((p) => p.slug === s))
      .filter((p): p is BlogPost => Boolean(p));
    if (explicit.length > 0) return explicit.slice(0, limit);
  }
  return posts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, limit);
}
`;

writeFileSync(OUT_FILE, tsSource, "utf-8");

mkdirSync(path.dirname(JSON_OUT_FILE), { recursive: true });
writeFileSync(JSON_OUT_FILE, JSON.stringify({ posts, authors, categories }, null, 2), "utf-8");

console.log(
  `✓ Blog build OK: ${posts.length} published post(s), ${parsed.length - posts.length} draft(s), ${warnings.length} warning(s).`
);
console.log(`  → ${path.relative(ROOT, OUT_FILE)}`);
