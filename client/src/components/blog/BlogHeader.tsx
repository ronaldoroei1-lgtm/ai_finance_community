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
      className="fixed top-0 right-0 left-0 z-50 bg-white/[0.92] backdrop-blur-xl border-b border-[#E2E4F3]"
      aria-label="ניווט ראשי"
    >
      <div className="container flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-xl font-bold text-[#1B1E33] hover:text-[#3D4A8A] transition-colors duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          AI Finance
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-[#4B5170] hover:text-[#1B1E33] transition-colors duration-200 font-medium">
            עמוד הבית
          </Link>
          <Link href="/blog" className="text-sm text-[#1B1E33] font-semibold">
            בלוג
          </Link>
          <Link href="/#services" className="text-sm text-[#4B5170] hover:text-[#1B1E33] transition-colors duration-200 font-medium">
            שירותים
          </Link>
          <Link href="/community/" className="text-sm text-[#4B5170] hover:text-[#1B1E33] transition-colors duration-200 font-medium">
            קהילה
          </Link>
          <Link href="/services/ai-workshops-for-finance/" className="text-sm text-[#4B5170] hover:text-[#1B1E33] transition-colors duration-200 font-medium">
            קורסים
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {content && (
            <a
              href={content.hero.businessWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1FBE5B] text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/25"
            >
              דברו איתנו בוואטסאפ
            </a>
          )}
          <button
            className="md:hidden p-2 text-[#4B5170] hover:text-[#1B1E33] transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E4F3] bg-white/[0.98] backdrop-blur-xl shadow-[0_16px_40px_rgba(27,30,51,0.10)] slide-in-from-top-2">
          <div className="container py-4 flex flex-col gap-4">
            <Link href="/" className="text-sm text-[#4B5170]" onClick={() => setMobileMenuOpen(false)}>
              עמוד הבית
            </Link>
            <Link href="/blog" className="text-sm text-[#1B1E33] font-semibold" onClick={() => setMobileMenuOpen(false)}>
              בלוג
            </Link>
            <Link href="/#services" className="text-sm text-[#4B5170]" onClick={() => setMobileMenuOpen(false)}>
              שירותים
            </Link>
            <Link href="/community/" className="text-sm text-[#4B5170]" onClick={() => setMobileMenuOpen(false)}>
              קהילה
            </Link>
            <Link href="/services/ai-workshops-for-finance/" className="text-sm text-[#4B5170]" onClick={() => setMobileMenuOpen(false)}>
              קורסים
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
