#!/usr/bin/env node
/**
 * Build-time prerender step for the redesigned bilingual site
 * (client/src/redesign/Site.tsx). Replaces scripts/blog/prerender.mjs +
 * scripts/blog/sitemap.mjs, which only covered /blog routes - this covers
 * every route Site.tsx renders, in both Hebrew (default) and English
 * (/en prefix).
 *
 * Same pragmatic "SSG-lite" approach as the file it replaces: clone the
 * Vite-built dist/public/index.html, swap in per-route <title>/meta/
 * canonical/JSON-LD via Site.tsx's own getMeta(), and inject real
 * server-rendered markup into #root so crawlers and no-JS clients get
 * actual content on first response. main.tsx mounts the interactive application client-side.
 *
 * Run after `vite build`, before the server esbuild step:
 *   vite build && tsx scripts/site-prerender.tsx && esbuild server/index.ts ...
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";
import React from "react";
import Site, { ROOT_URL, getMeta, routeInfo } from "../client/src/redesign/Site";
import database from "../client/src/generated/site-data.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_PUBLIC = path.join(ROOT, "dist", "public");
const TEMPLATE_PATH = path.join(DIST_PUBLIC, "index.html");

if (!existsSync(TEMPLATE_PATH)) {
  console.error(`Cannot prerender: ${path.relative(ROOT, TEMPLATE_PATH)} not found. Run "vite build" first.`);
  process.exit(1);
}
const template = readFileSync(TEMPLATE_PATH, "utf-8");

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function escapeAttr(str: string) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

function renderHead({
  lang,
  title,
  description,
  canonicalUrl,
  image,
  type,
  jsonLdBlocks,
}: {
  lang: "he" | "en";
  title: string;
  description: string;
  canonicalUrl: string;
  image: string;
  type: string;
  jsonLdBlocks: Record<string, unknown>[];
}) {
  let html = template;
  html = html.replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${lang}" dir="${lang === "en" ? "ltr" : "rtl"}">`);
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttr(description)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`);
  html = html.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttr(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttr(description)}" />`);
  html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeAttr(image)}" />`);
  html = html.replace(/<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${lang === "en" ? "en_US" : "he_IL"}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeAttr(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttr(description)}" />`);
  html = html.replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${escapeAttr(image)}" />`);
  const extraLd = jsonLdBlocks
    .map((block) => `\n    <script type="application/ld+json">\n${JSON.stringify(block, null, 2)}\n    </script>`)
    .join("");
  html = html.replace("</head>", `${extraLd}\n<link rel="alternate" hreflang="he" href="${canonicalUrl.replace(/\/en(?=\/)/, "")}"/><link rel="alternate" hreflang="en" href="${ROOT_URL}/en${canonicalUrl.replace(ROOT_URL, "").replace(/^\/en(?=\/)/, "")}"/>\n  </head>`);
  return html;
}

function writeRoute(routePath: string) {
  const bodyHtml = renderToString(React.createElement(Site, { path: routePath }));
  const meta = getMeta(routePath);
  const { lang, route, post } = meta;
  const canonicalUrl = `${ROOT_URL}${lang === "en" ? "/en" : ""}${route === "/" ? "/" : `${route}/`}`;
  const jsonLdBlocks: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: meta.title.split(" | ")[0], item: canonicalUrl }],
    },
  ];
  if (post) {
    const authors = database[lang].authors as Record<string, { name: string; linkedinUrl?: string }>;
    const author = authors[post.author];
    jsonLdBlocks.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: `${ROOT_URL}${post.featuredImage}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: author?.name ?? post.author, url: author?.linkedinUrl },
      publisher: { "@type": "Organization", name: "AI Finance Community", logo: { "@type": "ImageObject", url: `${ROOT_URL}/images/logo.png` } },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    });
  }

  const html = renderHead({
    lang,
    title: meta.title,
    description: meta.description,
    canonicalUrl,
    image: meta.image.startsWith("http") ? meta.image : `${ROOT_URL}${meta.image}`,
    type: post ? "article" : "website",
    jsonLdBlocks,
  }).replace(/<div id="root"><\/div>/, `<div id="root" data-prerendered="true">${bodyHtml}</div>`);

  const urlPath = `${lang === "en" ? "/en" : ""}${route === "/" ? "" : route}`;
  const outDir = path.join(DIST_PUBLIC, ...urlPath.split("/").filter(Boolean));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
  return canonicalUrl;
}

// ── Route enumeration ──────────────────────────────────────────────────
const SERVICE_SLUGS = ["ai-lectures-executives", "ai-workshops-finance-teams", "ai-process-mapping-finance"];
const STATIC_ROUTES = [
  "/",
  "/services",
  ...SERVICE_SLUGS.map((s) => `/services/${s}`),
  "/services/ai-workshops-for-finance",
  "/about",
  "/community",
  "/knowledge",
  "/blog",
  "/contact",
  "/accessibility",
];

const allUrls: string[] = [];
for (const lang of ["he", "en"] as const) {
  const prefix = lang === "en" ? "/en" : "";
  for (const route of STATIC_ROUTES) {
    allUrls.push(writeRoute(`${prefix}${route}`));
  }
  for (const post of database[lang].posts) {
    allUrls.push(writeRoute(`${prefix}/blog/${post.slug}`));
  }
}

writeRoute("/404");
writeRoute("/en/404");

// ── sitemap.xml ─────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const urlEntry = (loc: string, lastmod: string, priority: string) =>
  `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allUrls
  .map((u) => urlEntry(u, today, u === `${ROOT_URL}/` ? "1.0" : "0.7"))
  .join("\n")}\n</urlset>\n`;
writeFileSync(path.join(DIST_PUBLIC, "sitemap.xml"), sitemap, "utf-8");

console.log(`✓ Prerendered ${allUrls.length} route(s) (he + en) into dist/public/, and sitemap.xml.`);
