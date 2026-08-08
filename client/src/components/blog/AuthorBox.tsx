import type { Author } from "@/generated/blog";
import { Linkedin } from "lucide-react";

interface AuthorBoxProps {
  author: Author;
  publishedAt: string;
  updatedAt: string;
  lastVerifiedAt: string;
}

const dateFormatter = new Intl.DateTimeFormat("he-IL", { year: "numeric", month: "long", day: "numeric" });

export default function AuthorBox({ author, publishedAt, updatedAt, lastVerifiedAt }: AuthorBoxProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-[#E2E4F3] bg-card">
      <img
        src={author.image}
        alt={author.name}
        width={56}
        height={56}
        className="w-14 h-14 rounded-full object-cover border border-[#E2E4F3] shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#1B1E33]">{author.name}</span>
          <a
            href={author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3D4A8A] hover:text-[#303A72] transition-colors duration-200"
            aria-label={`${author.name} בלינקדאין`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
        <p className="text-sm text-[#4B5170] mt-0.5">{author.title}</p>
        <p className="text-xs text-[#646B89] mt-2">
          פורסם ב־{dateFormatter.format(new Date(publishedAt))}
          {updatedAt !== publishedAt && <> · עודכן ב־{dateFormatter.format(new Date(updatedAt))}</>}
          {" · "}נבדק לאחרונה ב־{dateFormatter.format(new Date(lastVerifiedAt))}
        </p>
      </div>
    </div>
  );
}
