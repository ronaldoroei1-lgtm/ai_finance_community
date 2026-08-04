// Zod schema for blog post frontmatter.
// Shared between the build script (Node/ESM) and can be re-exported for type
// generation later if needed. Kept dependency-light (zod only).
import { z } from "zod";

export const AUTHOR_IDS = ["roei", "tal"];
export const CATEGORY_IDS = [
  "ai-tools-for-finance",
  "financial-automation",
  "ai-governance-security",
];

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date");

export const frontmatterSchema = z.object({
  title: z
    .string()
    .min(10, "title too short (min 10 chars)")
    .max(70, "title too long for SEO (max 70 chars)"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "slug must be lowercase kebab-case (a-z, 0-9, hyphens only)"
    ),
  description: z
    .string()
    .min(50, "meta description too short (min 50 chars)")
    .max(155, "meta description too long for SEO (max 155 chars)"),
  publishedAt: dateString,
  updatedAt: dateString,
  lastVerifiedAt: dateString,
  author: z.enum(AUTHOR_IDS, {
    errorMap: () => ({ message: `author must be one of: ${AUTHOR_IDS.join(", ")}` }),
  }),
  category: z.enum(CATEGORY_IDS, {
    errorMap: () => ({
      message: `category must be one of: ${CATEGORY_IDS.join(", ")}`,
    }),
  }),
  tags: z.array(z.string().min(1)).min(1, "at least one tag is required"),
  featuredImage: z.string().min(1, "featuredImage path is required"),
  featuredImageAlt: z
    .string()
    .min(10, "featuredImageAlt should meaningfully describe the image (min 10 chars)"),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  pillar: z.boolean().default(false),
  relatedSlugs: z.array(z.string()).optional().default([]),
});
