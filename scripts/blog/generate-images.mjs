#!/usr/bin/env node
/**
 * One-time (idempotent) image pipeline: reads the hero PNGs delivered in
 * blog-source/articles/images/, and generates AVIF/WebP/JPEG at 640/960/1600px
 * widths into client/public/images/blog/. Run manually when new hero images
 * arrive - this is not part of the regular `pnpm build` (no image processing
 * on every build), see scripts/blog/build.mjs for how the generated files
 * are picked up.
 *
 * Usage: node scripts/blog/generate-images.mjs
 */
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const SRC_DIR = path.join(ROOT, "blog-source", "articles", "images");
const OUT_DIR = path.join(ROOT, "client", "public", "images", "blog");

const WIDTHS = [640, 960, 1600];

if (!existsSync(SRC_DIR)) {
  console.error(`No source images at ${path.relative(ROOT, SRC_DIR)}`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

const sourceFiles = readdirSync(SRC_DIR).filter((f) => /\.(png|jpe?g)$/i.test(f));

let generated = 0;
for (const file of sourceFiles) {
  const base = file.replace(/\.[^.]+$/, "");
  const srcPath = path.join(SRC_DIR, file);

  for (const width of WIDTHS) {
    const jpegOut = path.join(OUT_DIR, `${base}-${width}.jpg`);
    const webpOut = path.join(OUT_DIR, `${base}-${width}.webp`);
    const avifOut = path.join(OUT_DIR, `${base}-${width}.avif`);

    if (!existsSync(jpegOut)) {
      await sharp(srcPath).resize({ width, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(jpegOut);
      generated += 1;
    }
    if (!existsSync(webpOut)) {
      await sharp(srcPath).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(webpOut);
      generated += 1;
    }
    if (!existsSync(avifOut)) {
      await sharp(srcPath).resize({ width, withoutEnlargement: true }).avif({ quality: 60 }).toFile(avifOut);
      generated += 1;
    }
  }

  // Full-size JPEG too, used as the guaranteed <img> fallback src when no
  // generated width matches (e.g. very large viewports / print).
  const fullJpeg = path.join(OUT_DIR, `${base}.jpg`);
  if (!existsSync(fullJpeg)) {
    await sharp(srcPath).jpeg({ quality: 85 }).toFile(fullJpeg);
    generated += 1;
  }

  console.log(`✓ ${file} -> ${WIDTHS.length} widths x 3 formats + full-size fallback`);
}

console.log(`\nDone. ${generated} file(s) written to ${path.relative(ROOT, OUT_DIR)}/`);
