import { Link } from "wouter";
import { Linkedin } from "lucide-react";
import { useContent } from "@/hooks/useContent";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => { if (typeof window !== 'undefined') (window as any).gtag?.(...args); };

export default function BlogFooter() {
  const { content } = useContent();
  const contact = content?.contact;

  return (
    <footer className="border-t border-white/[0.06] bg-[#060c18] py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-bold mb-3 text-lg text-white">AI Finance Community</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              AI מעשי למחלקות כספים — סדנאות, הרצאות וליווי, מאחורינו קהילה של מעל 1,800 אנשי כספים ישראלים.
            </p>
            {contact && (
              <div className="flex gap-3">
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-blue-900/50 hover:border-blue-500/40 transition-all duration-200 hover:scale-105"
                  aria-label="LinkedIn - AI Finance"
                >
                  <Linkedin className="w-4 h-4 text-blue-300" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm text-white uppercase tracking-wider">ניווט</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-blue-300 transition-colors duration-200">עמוד הבית</Link></li>
              <li><Link href="/blog" className="hover:text-blue-300 transition-colors duration-200">בלוג</Link></li>
              <li><Link href="/#services" onClick={() => gtag('event', 'blog_to_service_click', { destination: 'services' })} className="hover:text-blue-300 transition-colors duration-200">שירותים</Link></li>
              <li><Link href="/services/ai-workshops-for-finance/" className="hover:text-blue-300 transition-colors duration-200">קורסים</Link></li>
              <li><Link href="/#faq" className="hover:text-blue-300 transition-colors duration-200">שאלות נפוצות</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm text-white uppercase tracking-wider">צור קשר</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {contact && (
                <>
                  <li>
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-300 transition-colors duration-200">
                      {contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-400 transition-colors duration-200"
                    >
                      WhatsApp
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">© 2026 AI Finance Community. כל הזכויות שמורות.</p>
        </div>
      </div>
    </footer>
  );
}
