import { useParams } from "wouter";
import { getPostBySlug, getRelatedPosts, authors, categories } from "@/generated/blog";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import AuthorBox from "@/components/blog/AuthorBox";
import TableOfContents from "@/components/blog/TableOfContents";
import RelatedPosts from "@/components/blog/RelatedPosts";
import BlogImage from "@/components/blog/BlogImage";
import NotFound from "@/pages/NotFound";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

const dateFormatter = new Intl.DateTimeFormat("he-IL", { year: "numeric", month: "long", day: "numeric" });

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  // Hooks must run unconditionally - compute SEO props from a possibly-undefined post.
  const author = post ? authors[post.author] : undefined;
  const category = post ? categories.find((c) => c.id === post.category) : undefined;
  const related = post ? getRelatedPosts(post) : [];

  useSeo({
    title: post ? `${post.title} | AI Finance` : "מאמר לא נמצא | AI Finance",
    description: post?.description ?? "המאמר המבוקש לא נמצא.",
    canonicalPath: post ? `/blog/${post.slug}/` : "/blog/",
    image: post?.featuredImage,
    type: "article",
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          image: `${SITE_URL}${post.featuredImage}`,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          author: {
            "@type": "Person",
            name: author?.name ?? post.author,
            url: author?.linkedinUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "AI Finance Community",
            logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}/` },
        }
      : undefined,
  });

  if (!post) {
    return <NotFound />;
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "בלוג", item: `${SITE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}/` },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="pt-32 pb-20">
        <div className="container">
          <nav aria-label="breadcrumb" className="text-sm text-[#646B89] mb-6">
            <a href="/" className="hover:text-[#3D4A8A]">עמוד הבית</a>
            <span className="mx-2" aria-hidden="true">/</span>
            <a href="/blog/" className="hover:text-[#3D4A8A]">בלוג</a>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#646B89]">{post.title}</span>
          </nav>

          {category && <span className="section-label mb-4 inline-flex">{category.label}</span>}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B1E33] leading-tight mb-6 max-w-4xl">
            {post.title}
          </h1>

          <p className="text-sm text-[#646B89] mb-8 max-w-4xl">
            {author?.name ?? post.author} · פורסם ב־{dateFormatter.format(new Date(post.publishedAt))}
            {post.updatedAt !== post.publishedAt && (
              <> · עודכן ב־{dateFormatter.format(new Date(post.updatedAt))}</>
            )}
            {" · "}נבדק לאחרונה ב־{dateFormatter.format(new Date(post.lastVerifiedAt))}
            {" · "}
            {post.readingTimeMinutes} דק׳ קריאה
          </p>

          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-10 max-w-4xl bg-secondary">
            <BlogImage
              src={post.featuredImage}
              srcset={post.featuredImageSrcset}
              alt={post.featuredImageAlt}
              width={1200}
              height={675}
              loading="eager"
              sizes="(min-width: 1024px) 900px, 100vw"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-10 max-w-6xl">
            <article
              className="prose prose-blog max-w-none"
              // Content is compiled at build time from our own Markdown source (content/blog/*.md),
              // not from user input - safe to render as trusted static HTML.
              dangerouslySetInnerHTML={{ __html: post.html }}
              onClick={(e) => {
                const a = (e.target as HTMLElement).closest('a');
                if (a?.href?.includes('/services/')) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (window as any).gtag?.('event', 'blog_to_service_click', { destination: a.pathname });
                }
              }}
            />
            <aside className="hidden lg:block">
              <TableOfContents items={post.toc} />
            </aside>
          </div>

          <div className="max-w-4xl mt-10 pt-8 border-t border-[#E2E4F3] flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-[#EEF0FA] border border-[#E2E4F3] text-[#3D4A8A]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {author && (
            <div className="max-w-4xl mt-10">
              <AuthorBox
                author={author}
                publishedAt={post.publishedAt}
                updatedAt={post.updatedAt}
                lastVerifiedAt={post.lastVerifiedAt}
              />
            </div>
          )}

          <RelatedPosts posts={related} authors={authors} categories={categories} />
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
