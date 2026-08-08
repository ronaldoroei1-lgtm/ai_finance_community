import { posts, authors, categories } from "@/generated/blog";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import ArticleCard from "@/components/blog/ArticleCard";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

export default function BlogIndex() {
  useSeo({
    title: "בלוג AI Finance - מדריכים מעשיים ל-AI במחלקת כספים",
    description:
      "מדריכים מעשיים ומעודכנים לשילוב בינה מלאכותית בעבודת מחלקות כספים בישראל: כלי AI, אוטומציה, אבטחת מידע וממשל AI.",
    canonicalPath: "/blog/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "בלוג AI Finance",
      url: `${SITE_URL}/blog/`,
      description: "מדריכים מעשיים לשילוב בינה מלאכותית בעבודת מחלקות כספים בישראל.",
    },
  });

  const pillarPosts = posts.filter((p) => p.pillar);
  const otherPosts = posts.filter((p) => !p.pillar);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BlogHeader />

      <main className="pt-32 pb-20">
        <div className="container">
          <div className="max-w-3xl mb-14">
            <span className="section-label mb-4 inline-flex">מדריכים מעשיים</span>
            <h1 className="text-4xl sm:text-5xl font-bold gradient-heading mb-4 leading-tight">
              בלוג AI Finance
            </h1>
            <p className="text-lg text-[#4B5170] leading-relaxed">
              מדריכים מעשיים ומעודכנים לשילוב בינה מלאכותית בעבודת מחלקות כספים בישראל — כלי AI, אוטומציה
              פיננסית, ואבטחת מידע וממשל AI.
            </p>
          </div>

          {posts.length === 0 && (
            <p className="text-[#646B89] border border-[#E2E4F3] rounded-xl p-8 text-center">
              המאמרים הראשונים בדרך. חוזרים בקרוב.
            </p>
          )}

          {pillarPosts.length > 0 && (
            <section className="mb-16" aria-labelledby="pillar-heading">
              <h2 id="pillar-heading" className="text-xl font-bold text-[#1B1E33] mb-6">
                מדריכי הפתיחה
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pillarPosts.map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    author={authors[post.author]}
                    category={categories.find((c) => c.id === post.category)}
                  />
                ))}
              </div>
            </section>
          )}

          {categories.map((category) => {
            const categoryPosts = otherPosts.filter((p) => p.category === category.id);
            if (categoryPosts.length === 0) return null;
            return (
              <section key={category.id} className="mb-16" aria-labelledby={`cat-${category.id}`}>
                <h2 id={`cat-${category.id}`} className="text-xl font-bold text-[#1B1E33] mb-2">
                  {category.label}
                </h2>
                <p className="text-sm text-[#646B89] mb-6">{category.description}</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPosts.map((post) => (
                    <ArticleCard
                      key={post.slug}
                      post={post}
                      author={authors[post.author]}
                      category={category}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
