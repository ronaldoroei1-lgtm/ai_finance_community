import type { BlogPost, Author, Category } from "@/generated/blog";
import ArticleCard from "./ArticleCard";

interface RelatedPostsProps {
  posts: BlogPost[];
  authors: Record<string, Author>;
  categories: Category[];
}

export default function RelatedPosts({ posts, authors, categories }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="mt-16">
      <h2 id="related-posts-heading" className="text-2xl font-bold text-[#1B1E33] mb-6">
        מאמרים נוספים שיכולים לעניין אתכם
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard
            key={post.slug}
            post={post}
            author={authors[post.author]}
            category={categories.find((c) => c.id === post.category)}
          />
        ))}
      </div>
    </section>
  );
}
