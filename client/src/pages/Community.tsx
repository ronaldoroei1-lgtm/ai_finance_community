import { Link } from "wouter";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => { if (typeof window !== 'undefined') (window as any).gtag?.(...args); };
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { useContent } from "@/hooks/useContent";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

const PAGE_META = {
  title: "קהילת AI Finance לאנשי כספים",
  description:
    "קהילת WhatsApp מקצועית לאנשי כספים שרוצים ללמוד כיצד להשתמש ב-AI בעבודה, עם תוכן שבועי, מדריכים ודוגמאות מעשיות.",
  canonicalPath: "/community/",
};

const AUDIENCE_ITEMS = [
  "רואי ורואות חשבון",
  "חשבים וחשבות",
  "אנשי FP&A ואנליסטים פיננסיים",
  "מנהלי ומנהלות כספים",
  "אנשי ביקורת, תקציב ובקרה",
  "בעלי תפקידים שרוצים להבין כיצד לשלב AI בעבודה הפיננסית",
];

const FEATURES = [
  {
    title: "תוכן מקצועי בכל שבוע",
    body: "פוסטים קצרים שמסבירים כלי, יכולת או שינוי רלוונטי — ומה המשמעות שלהם עבור אנשי כספים.",
  },
  {
    title: "מדריכים שאפשר לקחת לעבודה",
    body: "מדריכים, תבניות ודוגמאות שנועדו לעזור לעבור מהיכרות כללית לניסוי מעשי.",
  },
  {
    title: "דוגמאות מעולם הכספים",
    body: "שימושים הקשורים לדוחות, Excel, תחזיות, מסמכים, בקרות, תקציב מול ביצוע ותהליכים חוזרים.",
  },
  {
    title: "הסתכלות מפוכחת על כלים חדשים",
    body: "לא כל כלי מתאים לכל משימה. התוכן מתייחס גם למגבלות, לצורך בבקרה אנושית ולשאלות של פרטיות ואבטחת מידע.",
  },
  {
    title: "גישה לתוכן החדש של AI Finance",
    body: "עדכונים על מאמרים, מדריכים, מפגשים וקורסים שעשויים להיות רלוונטיים לחברי הקהילה.",
  },
];

export default function Community() {
  const { content } = useContent();

  useSeo({
    title: PAGE_META.title,
    description: PAGE_META.description,
    canonicalPath: PAGE_META.canonicalPath,
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: PAGE_META.title,
      description: PAGE_META.description,
      url: `${SITE_URL}${PAGE_META.canonicalPath}`,
      isPartOf: {
        "@type": "WebSite",
        name: "AI Finance Community",
        url: `${SITE_URL}/`,
      },
    },
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "קהילה", item: `${SITE_URL}${PAGE_META.canonicalPath}` },
    ],
  };

  if (!content) return null;

  const whatsappUrl = content.hero.whatsappUrl;

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

          {/* ─── Breadcrumb ───────────────────────────────────────── */}
          <nav aria-label="breadcrumb" className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-300">עמוד הבית</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-slate-400">קהילה</span>
          </nav>

          {/* ─── Hero ─────────────────────────────────────────────── */}
          <div className="max-w-3xl mb-12 fade-in">
            <span className="section-label mb-5 inline-flex">
              <Users className="w-3 h-3" aria-hidden="true" />
              קהילת אנשי הכספים
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
              קהילת AI Finance לאנשי כספים
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-5">
              תוכן מקצועי, מדריכים ודוגמאות מעשיות לשימוש ב־AI בעולם הכספים — ישירות בקהילת ה־WhatsApp.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              קהילת AI Finance מונה יותר מ־1,800 אנשי ונשות כספים שרוצים להבין כיצד כלי AI מתחברים לעבודה המקצועית שלהם. הקהילה מיועדת ללמידה שוטפת ולהיכרות עם שימושים חדשים, בלי צורך לעקוב בכל יום אחרי עשרות כלים ועדכונים.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gtag('event', 'community_join_click')}
            >
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8"
              >
                הצטרפו לקהילת AI Finance ב־WhatsApp
              </Button>
            </a>
            <p className="text-xs text-slate-500 mt-3">ההצטרפות מתבצעת ישירות ב־WhatsApp, ללא טופס.</p>
          </div>

          {/* ─── Divider ──────────────────────────────────────────── */}
          <div className="relative mb-16">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* ─── למי הקהילה מתאימה ────────────────────────────────── */}
          <section className="mb-20" aria-labelledby="audience-heading">
            <h2 id="audience-heading" className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
              למי הקהילה מתאימה?
            </h2>
            <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8 max-w-3xl">
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {AUDIENCE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-300 text-sm leading-relaxed">
                    <span className="text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-slate-500 mt-6 leading-relaxed border-t border-white/[0.06] pt-5">
                לא נדרש רקע טכנולוגי. כן נדרשת סקרנות מקצועית ונכונות לבחון כלים חדשים באופן ביקורתי.
              </p>
            </div>
          </section>

          {/* ─── מה מקבלים בקהילה ─────────────────────────────────── */}
          <section className="mb-20" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-8 gradient-heading">
              מה מקבלים בקהילה?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8"
                >
                  <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Divider ──────────────────────────────────────────── */}
          <div className="relative mb-16">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* ─── איך זה עובד ──────────────────────────────────────── */}
          <section className="max-w-3xl mb-20" aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-2xl font-bold text-white mb-4">
              איך זה עובד?
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              מצטרפים דרך הקישור לקבוצת ה־WhatsApp ומקבלים את התוכן במסגרת הפעילות השוטפת של הקהילה. ההצטרפות אינה מחייבת הרשמה בטופס באתר.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              השימוש ב־WhatsApp כפוף לתנאים ולמדיניות הפרטיות של WhatsApp. מומלץ להימנע מפרסום בקהילה של מידע פיננסי, עסקי או אישי שאינו מיועד לחשיפה בפני יתר חברי הקבוצה.
            </p>
          </section>

          {/* ─── Bottom CTA ───────────────────────────────────────── */}
          <div className="max-w-3xl bg-gradient-to-br from-blue-950/60 to-[#0a1220] border border-blue-500/20 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">רוצים להצטרף?</h2>
            <p className="text-slate-400 mb-6">
              אם אתם עובדים בעולם הכספים ורוצים לקבל תוכן מקצועי על AI בשפה שמחוברת לעבודה שלכם, אתם מוזמנים להצטרף.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gtag('event', 'community_join_click')}
            >
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8"
              >
                הצטרפו לקהילת AI Finance ב־WhatsApp
              </Button>
            </a>
          </div>

        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
