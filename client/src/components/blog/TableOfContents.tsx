import type { TocItem } from "@/generated/blog";

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="תוכן העניינים" className="rounded-xl border border-[#E2E4F3] bg-card p-5 sticky top-24">
      <h2 className="text-sm font-bold text-[#1B1E33] uppercase tracking-wider mb-3">תוכן העניינים</h2>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pr-4" : ""}>
            <a
              href={`#${item.id}`}
              className="text-[#4B5170] hover:text-[#3D4A8A] transition-colors duration-200 block leading-snug"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
