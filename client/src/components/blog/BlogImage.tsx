import type { ImageSrcset } from "@/generated/blog";

interface BlogImageProps {
  src: string;
  srcset?: ImageSrcset;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: "lazy" | "eager";
  sizes?: string;
}

/**
 * Renders a <picture> with AVIF and WebP <source> entries (each with a
 * srcset across 640/960/1600px, when available) and a guaranteed JPEG
 * <img> fallback. Every srcset entry comes from scripts/blog/build.mjs,
 * which only ever lists a width+format it confirmed exists on disk at
 * build time - a 404'ing <source> does not gracefully fall back to <img>
 * in browsers, so nothing here is guessed at render time.
 */
export default function BlogImage({
  src,
  srcset,
  alt,
  width,
  height,
  className,
  loading = "lazy",
  sizes = "100vw",
}: BlogImageProps) {
  const fallbackSrc = srcset?.fallback ?? src;

  const img = (
    <img
      src={fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      className={className}
    />
  );

  if (!srcset) return img;

  return (
    <picture>
      {srcset.avif && <source srcSet={srcset.avif} type="image/avif" sizes={sizes} />}
      {srcset.webp && <source srcSet={srcset.webp} type="image/webp" sizes={sizes} />}
      {srcset.jpeg && <source srcSet={srcset.jpeg} type="image/jpeg" sizes={sizes} />}
      {img}
    </picture>
  );
}
