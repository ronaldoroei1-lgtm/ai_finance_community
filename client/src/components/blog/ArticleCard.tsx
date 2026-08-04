import { Link } from "wouter";
import type { BlogPost, Author, Category } from "@/generated/blog";
import BlogImage from "./BlogImage";

interface ArticleCardProps {
  post: BlogPost;
  author?: Author;
  category?: Category;
}

const dateFormatter = new Intl.DateTimeFormat("he-IL", { year: "numeric", month: "long", day: "numeric" });

export default function ArticleCard({ post, author, category }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.08] bg-card hover:border-blue-500/40 transition-all duration-200 hover:-translate-y-1"
    >
      <div className="aspect-[16/9] overflow-hidden bg-secondary">
        <BlogImage
          src={post.featuredImage}
          srcset={post.featuredImageSrcset}
          alt={post.featuredImageAlt}
          width={640}
          height={360}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        {category && (
          <span className="section-label w-fit">{category.label}</span>
        )}
        <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 flex-1">{post.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/[0.06]">
          <span>{author?.name ?? post.author}</span>
          <span className="flex items-center gap-2">
            <time dateTime={post.publishedAt}>{dateFormatter.format(new Date(post.publishedAt))}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTimeMinutes} דק׳ קריאה</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
