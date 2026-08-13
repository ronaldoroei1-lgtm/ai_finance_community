import { useEffect } from "react";

export interface SeoOptions {
  title: string;
  description: string;
  canonicalPath: string; // e.g. "/blog/my-post/"
  image?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  jsonLd?: object;
}

const SITE_URL = "https://ai-finance.co.il";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Client-side SEO tag sync, used as a fallback for CSR navigation
 * (e.g. clicking between blog posts without a full page reload).
 *
 * The authoritative SEO tags for first-load/crawlers come from the
 * build-time prerender step (scripts/blog/prerender.mjs), which bakes
 * the same tags directly into the static HTML before hydration.
 */
export function useSeo(options: SeoOptions) {
  useEffect(() => {
    const { title, description, canonicalPath, image, type = "website", jsonLd } = options;
    const url = `${SITE_URL}${canonicalPath}`;
    const fullImage = image?.startsWith("http") ? image : `${SITE_URL}${image ?? "/images/logo.png"}`;

    document.title = title;
    upsertMeta("name", "description", description);

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:image", fullImage);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", fullImage);

    let ld = document.getElementById("blog-jsonld") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!ld) {
        ld = document.createElement("script");
        ld.id = "blog-jsonld";
        ld.type = "application/ld+json";
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(jsonLd);
    } else if (ld) {
      ld.textContent = "";
    }
  }, [options.title, options.description, options.canonicalPath, options.image, options.type]);
}

export { SITE_URL };
