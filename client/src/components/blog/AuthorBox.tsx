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
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-white/[0.08] bg-card">
      <img
        src={author.image}
        alt={author.name}
        width={56}
        height={56}
        className="w-14 h-14 rounded-full object-cover border border-white/10 shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-white">{author.name}</span>
          <a
            href={author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 transition-colors duration-200"
            aria-label={`${author.name} בלינקדאין`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
        <p className="text-sm text-slate-400 mt-0.5">{author.title}</p>
        <p className="text-xs text-slate-500 mt-2">
          פורסם ב־{dateFormatter.format(new Date(publishedAt))}
          {updatedAt !== publishedAt && <> · עודכן ב־{dateFormatter.format(new Date(updatedAt))}</>}
          {" · "}נבדק לאחרונה ב־{dateFormatter.format(new Date(lastVerifiedAt))}
        </p>
      </div>
    </div>
  );
}
