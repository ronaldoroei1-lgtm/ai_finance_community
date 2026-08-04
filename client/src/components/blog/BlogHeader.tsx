import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { useContent } from "@/hooks/useContent";

/**
 * Header for /blog and /blog/:slug pages.
 * Visually matches the homepage nav (same tokens/classes) but is a
 * self-contained component so it doesn't depend on Home.tsx's local state.
 */
export default function BlogHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useContent();

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
      aria-label="ניווט ראשי"
    >
      <div className="container flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-bold text-white hover:text-blue-200 transition-colors duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          AI Finance
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium">
            עמוד הבית
          </Link>
          <Link href="/blog" className="text-sm text-white font-semibold">
            בלוג
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {content && (
            <a
              href={content.hero.businessWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              דברו איתנו בוואטסאפ
            </a>
          )}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-background/95 backdrop-blur-xl slide-in-from-top-2">
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/" className="text-sm text-slate-300" onClick={() => setMobileMenuOpen(false)}>
              עמוד הבית
            </Link>
            <Link href="/blog" className="text-sm text-white font-semibold" onClick={() => setMobileMenuOpen(false)}>
              בלוג
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
