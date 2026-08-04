#!/usr/bin/env node
/**
 * Build-time prerender step for /blog and /blog/:slug.
 *
 * This project is a Vite + Express SPA (no Next/Astro migration - see the
 * content strategy notes for why). Instead we do a pragmatic "SSG-lite"
 * pass after `vite build`: for every blog route we clone the built
 * dist/public/index.html, swap in the correct <title>/meta/canonical/
 * JSON-LD for that specific post, and inject real static HTML (not just
 * chrome) into #root so crawlers and no-JS clients get actual readable
 * content and real <a href> links on first response. React then hydrates
 * over that markup client-side (see main.tsx).
 *
 * Run after `vite build`, before the server bundle step. Requires
 * scripts/blog/build.mjs to have already produced scripts/blog/.data/blog-data.json.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, SITE_NAME } from "./site-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const DIST_PUBLIC = path.join(ROOT, "dist", "public");
const TEMPLATE_PATH = path.join(DIST_PUBLIC, "index.html");
const DATA_PATH = path.join(__dirname, ".data", "blog-data.json");

if (!existsSync(TEMPLATE_PATH)) {
  console.error(`Cannot prerender: ${path.relative(ROOT, TEMPLATE_PATH)} not found. Run "vite build" first.`);
  process.exit(1);
}
if (!existsSync(DATA_PATH)) {
  console.error(`Cannot prerender: ${path.relative(ROOT, DATA_PATH)} not found. Run "node scripts/blog/build.mjs" first.`);
  process.exit(1);
}

const template = readFileSync(TEMPLATE_PATH, "utf-8");
const { posts, authors, categories } = JSON.parse(readFileSync(DATA_PATH, "utf-8"));

const dateFormatter = new Intl.DateTimeFormat("he-IL", { year: "numeric", month: "long", day: "numeric" });

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

/**
 * Injects/replaces the per-page <head> tags in the base template.
 * Uses simple, targeted string replacement rather than an HTML parser -
 * the template shape is small and controlled (our own build output).
 */
function renderHead({ title, description, canonicalUrl, image, type, jsonLdBlocks }) {
  let html = template;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeAttr(description)}" />`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`
  );
  html = html.replace(/<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${type}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttr(title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttr(description)}" />`);
  html = html.replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeAttr(image)}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeAttr(title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttr(description)}" />`);
  html = html.replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${escapeAttr(image)}" />`);

  // Append page-specific structured data after the existing Organization
  // JSON-LD block, rather than replacing it - both are valid on the page.
  const extraLd = jsonLdBlocks
    .map((block) => `\n    <script type="application/ld+json">\n${JSON.stringify(block, null, 2)}\n    </script>`)
    .join("");
  html = html.replace("</head>", `${extraLd}\n  </head>`);

  return html;
}

function categoryLabel(id) {
  return categories.find((c) => c.id === id)?.label ?? id;
}

function articleCardHtml(post) {
  const author = authors[post.author];
  return `
    <a href="/blog/${post.slug}/" style="display:block;border:1px solid #1a2d4a;border-radius:12px;padding:20px;margin-bottom:16px;text-decoration:none;">
      <span style="color:#93c5fd;font-size:12px;text-transform:uppercase;">${escapeHtml(categoryLabel(post.category))}</span>
      <h3 style="color:#fff;font-size:18px;margin:8px 0;">${escapeHtml(post.title)}</h3>
      <p style="color:#94a3b8;font-size:14px;">${escapeHtml(post.description)}</p>
      <p style="color:#64748b;font-size:12px;">${escapeHtml(author?.name ?? post.author)} · ${dateFormatter.format(new Date(post.publishedAt))} · ${post.readingTimeMinutes} דק׳ קריאה</p>
    </a>`;
}

function renderIndexBody() {
  const pillar = posts.filter((p) => p.pillar);
  const rest = posts.filter((p) => !p.pillar);
  const cards = [...pillar, ...rest].map(articleCardHtml).join("\n");
  return `
    <nav aria-label="ניווט ראשי"><a href="/">עמוד הבית</a> · <a href="/blog/">בלוג</a></nav>
    <main>
      <h1>בלוג AI Finance</h1>
      <p>מדריכים מעשיים ומעודכנים לשילוב בינה מלאכותית בעבודת מחלקות כספים בישראל.</p>
      ${cards || "<p>המאמרים הראשונים בדרך.</p>"}
    </main>`;
}

function renderPostBody(post) {
  const author = authors[post.author];
  const related = (post.relatedSlugs.length > 0
    ? post.relatedSlugs.map((s) => posts.find((p) => p.slug === s)).filter(Boolean)
    : posts.filter((p) => p.slug !== post.slug && p.category === post.category)
  ).slice(0, 3);

  return `
    <nav aria-label="breadcrumb"><a href="/">עמוד הבית</a> / <a href="/blog/">בלוג</a> / <span>${escapeHtml(post.title)}</span></nav>
    <main>
      <span>${escapeHtml(categoryLabel(post.category))}</span>
      <h1>${escapeHtml(post.title)}</h1>
      <p>${escapeHtml(author?.name ?? post.author)} · פורסם ב־${dateFormatter.format(new Date(post.publishedAt))}${
        post.updatedAt !== post.publishedAt ? ` · עודכן ב־${dateFormatter.format(new Date(post.updatedAt))}` : ""
      } · נבדק לאחרונה ב־${dateFormatter.format(new Date(post.lastVerifiedAt))} · ${post.readingTimeMinutes} דק׳ קריאה</p>
      <picture>${
        post.featuredImageSrcset?.avif ? `<source srcset="${escapeAttr(post.featuredImageSrcset.avif)}" type="image/avif" />` : ""
      }${
        post.featuredImageSrcset?.webp ? `<source srcset="${escapeAttr(post.featuredImageSrcset.webp)}" type="image/webp" />` : ""
      }<img src="${escapeAttr(post.featuredImageSrcset?.fallback ?? post.featuredImage)}" alt="${escapeAttr(post.featuredImageAlt)}" width="1200" height="675" /></picture>
      <article>${post.html}</article>
      <p>תגיות: ${post.tags.map((t) => `#${escapeHtml(t)}`).join(" ")}</p>
      ${
        author
          ? `<section><h2>אודות המחבר</h2><p><strong>${escapeHtml(author.name)}</strong> — ${escapeHtml(author.title)}</p><p>${escapeHtml(author.bio)}</p><p><a href="${escapeAttr(author.linkedinUrl)}" target="_blank" rel="noopener noreferrer">פרופיל לינקדאין</a></p></section>`
          : ""
      }
      ${related.length > 0 ? `<section><h2>מאמרים נוספים</h2>${related.map(articleCardHtml).join("\n")}</section>` : ""}
    </main>`;
}

function writeRoute(outDir, { title, description, canonicalUrl, image, type, jsonLdBlocks, bodyHtml }) {
  let html = renderHead({ title, description, canonicalUrl, image, type, jsonLdBlocks });
  html = html.replace(/<div id="root"><\/div>/, `<div id="root" data-prerendered="true">${bodyHtml}</div>`);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
}

// ── /blog/ ────────────────────────────────────────────────────────────
writeRoute(path.join(DIST_PUBLIC, "blog"), {
  title: `בלוג AI Finance - מדריכים מעשיים ל-AI במחלקת כספים`,
  description:
    "מדריכים מעשיים ומעודכנים לשילוב בינה מלאכותית בעבודת מחלקות כספים בישראל: כלי AI, אוטומציה, אבטחת מידע וממשל AI.",
  canonicalUrl: `${SITE_URL}/blog/`,
  image: `${SITE_URL}/images/logo.png`,
  type: "website",
  jsonLdBlocks: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "בלוג AI Finance",
      url: `${SITE_URL}/blog/`,
      description: "מדריכים מעשיים לשילוב בינה מלאכותית בעבודת מחלקות כספים בישראל.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "בלוג", item: `${SITE_URL}/blog/` },
      ],
    },
  ],
  bodyHtml: renderIndexBody(),
});

// ── /blog/{slug}/ ────────────────────────────────────────────────────
for (const post of posts) {
  const author = authors[post.author];
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}/`;
  writeRoute(path.join(DIST_PUBLIC, "blog", post.slug), {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    canonicalUrl,
    image: `${SITE_URL}${post.featuredImage}`,
    type: "article",
    jsonLdBlocks: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: `${SITE_URL}${post.featuredImage}`,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { "@type": "Person", name: author?.name ?? post.author, url: author?.linkedinUrl },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "בלוג", item: `${SITE_URL}/blog/` },
          { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
        ],
      },
    ],
    bodyHtml: renderPostBody(post),
  });
}

console.log(`✓ Prerendered ${posts.length + 1} blog route(s) into dist/public/blog/`);
