import { useState } from "react";
import { Link } from "wouter";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => { if (typeof window !== 'undefined') (window as any).gtag?.(...args); };
import { Users, TrendingUp, CheckCircle2, ChevronDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { useContent } from "@/hooks/useContent";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

export default function ServicesWorkshopsB2B() {
  const { content } = useContent();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useSeo({
    title: "סדנאות AI למחלקות כספים | AI Finance",
    description:
      "סדנאות AI מעשיות לצוותי FP&A, חשבות, ביקורת וכספים, עם תרגול על משימות פיננסיות והתאמה לצורכי הארגון.",
    canonicalPath: "/services/ai-workshops-finance-teams/",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "סדנאות AI לצוותי כספים",
      provider: {
        "@type": "Organization",
        name: "AI Finance Community",
        url: `${SITE_URL}/`,
      },
      areaServed: "IL",
    },
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "שירותים", item: `${SITE_URL}/#services` },
      {
        "@type": "ListItem",
        position: 3,
        name: "סדנאות AI למחלקות כספים",
        item: `${SITE_URL}/services/ai-workshops-finance-teams/`,
      },
    ],
  };

  if (!content) return null;

  const whatsappUrl = content.hero.businessWhatsappUrl;

  const handleCtaClick = () => {
    gtag("event", "whatsapp_click", { location: "services" });
  };

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
          {/* ─── Breadcrumb ──────────────────────────────────────── */}
          <nav aria-label="breadcrumb" className="text-sm text-[#646B89] mb-6">
            <Link href="/" className="hover:text-[#3D4A8A]">
              עמוד הבית
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-[#646B89]">שירותים</span>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-[#646B89]">סדנאות</span>
          </nav>

          {/* ─── Hero ─────────────────────────────────────────────── */}
          <div className="max-w-3xl mb-16 fade-in">
            <span className="section-label mb-5 inline-flex">
              <TrendingUp className="w-4 h-4 ml-2" aria-hidden="true" />
              סדנאות לצוותי כספים
            </span>
            <h1 className="text-4xl md:text-5xl font-bold gradient-heading mt-4 mb-6 leading-tight">
              סדנאות AI מעשיות למחלקות כספים
            </h1>
            <p className="text-lg text-[#4B5170] leading-relaxed mb-8">
              עוזרים לצוותי כספים לעבור מהיכרות כללית עם AI לתרגול על משימות שמגיעות מהעבודה שלהם — תוך התייחסות לבקרה, למגבלות הכלים ולכללי הארגון.
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                <Button className="bg-[#3D4A8A] hover:bg-[#303A72] text-white font-semibold px-8">
                  בדקו התאמה לסדנה
                </Button>
              </a>
            )}
          </div>

          {/* ─── למי הסדנה מתאימה ─────────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">למי הסדנה מתאימה?</h2>
              <div className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)]">
                <ul className="space-y-4">
                  {[
                    "צוותי FP&A, חשבות, ביקורת, תקציב ובקרה",
                    "מחלקות כספים שרוצות ליצור בסיס משותף לעבודה עם AI",
                    "צוותים שכבר התנסו בכלים, אך השימוש בהם עדיין נקודתי ולא עקבי",
                    "מנהלי כספים שרוצים לאפשר לצוות להתנסות במסגרת מקצועית ומונחית",
                    "ארגונים שמחפשים פעילות המחוברת למשימות פיננסיות ולא הדרכת AI כללית",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#4B5170]">
                      <Users className="w-4 h-4 text-[#3D4A8A] mt-1 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── הבעיה שהסדנה נועדה לפתור ──────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">הבעיה שהסדנה נועדה לפתור</h2>
              <div className="space-y-5 text-[#4B5170] leading-relaxed">
                <p>
                  אנשי כספים רבים כבר מכירים את שמות הכלים, אבל מתקשים לתרגם את היכולות שלהם לתהליך עבודה בטוח ושימושי. לעיתים כל עובד מתנסה לבד, בלי שפה משותפת, בלי דוגמאות רלוונטיות ובלי הבחנה ברורה בין משימה שמתאימה ל־AI לבין משימה שמחייבת טיפול אחר.
                </p>
                <p>
                  הסדנה נועדה ליצור מסגרת משותפת: להבין מה הכלים יודעים לעשות, לתרגל שימושים פיננסיים, לזהות מגבלות ולבחון כיצד ניתן לשלב את העבודה עם AI בלי לוותר על בקרה ושיקול דעת מקצועי.
                </p>
              </div>
            </div>
          </section>

          {/* ─── תוצאות ותוצרים צפויים ──────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">תוצאות ותוצרים צפויים</h2>
              <div className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)]">
                <ul className="space-y-4">
                  {[
                    "לזהות משימות שבהן AI עשוי לסייע",
                    "לנסח הנחיות ברורות יותר לכלים",
                    "לבחון את איכות הפלט ולא לקבל אותו כתשובה סופית",
                    "להבין היכן נדרשת בקרה אנושית",
                    "לצאת עם כיווני ניסוי הרלוונטיים לעבודה של הצוות",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#4B5170]">
                      <CheckCircle2 className="w-4 h-4 text-[#3D4A8A] mt-1 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── דוגמאות למשימות פיננסיות ──────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">דוגמאות למשימות פיננסיות</h2>
              <div className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)]">
                <ul className="space-y-3 mb-6">
                  {[
                    "ניתוח דוחות כספיים",
                    "תקציב מול ביצוע והסבר סטיות",
                    "בניית טיוטה לתחזית או לתרחישים",
                    "סיכום מסמכים ארוכים וחילוץ נקודות לבדיקה",
                    "הכנת בסיס למצגת הנהלה",
                    "ארגון מידע לקראת דוח או דיון",
                    "ניסוח שאילתות, בדיקות ובקרות לעבודה עם נתונים",
                  ].map((item, i) => (
                    <li key={i} className="text-[#4B5170] pr-4 border-r-2 border-[#C9CDE4]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[#646B89] leading-relaxed">
                  הדוגמאות הסופיות ייקבעו לאחר הבנת הקהל, הכלים הזמינים והמידע שמותר לשלב בתרגול.
                </p>
              </div>
            </div>
          </section>

          {/* ─── מבנה הפעילות ────────────────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-8">מבנה הפעילות</h2>
              <div className="space-y-5">
                {[
                  {
                    step: "1",
                    title: "שיחת התאמה",
                    desc: "הבנת הרכב הצוות, רמת הניסיון, המשימות המרכזיות והמגבלות שחשוב להביא בחשבון.",
                  },
                  {
                    step: "2",
                    title: "בחירת תרחישים",
                    desc: "בחירת דוגמאות ותרגילים שמתחברים לעבודה הפיננסית של המשתתפים.",
                  },
                  {
                    step: "3",
                    title: "למידה ותרגול",
                    desc: "הסבר קצר, הדגמה ועבודה מעשית שמאפשרת למשתתפים להתנסות ולשאול שאלות.",
                  },
                  {
                    step: "4",
                    title: "סיכום וכיווני המשך",
                    desc: "ריכוז השימושים שנבחנו והנקודות שדורשות בדיקה נוספת בארגון.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)] flex gap-5 items-start"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#EEF0FA] border border-[#C9CDE4] flex items-center justify-center text-[#3D4A8A] font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1B1E33] mb-1">{item.title}</h3>
                      <p className="text-[#4B5170] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── מה נדרש מהארגון ─────────────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">מה נדרש מהארגון?</h2>
              <div className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)]">
                <ul className="space-y-4">
                  {[
                    "איש או אשת קשר לתיאום הפעילות",
                    "מידע על תפקידי המשתתפים ורמת הניסיון שלהם",
                    "דוגמאות כלליות למשימות שהצוות מבצע",
                    "הבהרה אילו כלים מאושרים לשימוש בארגון",
                    "הנחיות אבטחת מידע ופרטיות הרלוונטיות לתרגול",
                    "שימוש בדוגמאות מדומות או במידע שעבר הסרה של פרטים רגישים",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#4B5170]">
                      <CheckCircle2 className="w-4 h-4 text-[#3D4A8A] mt-1 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── Bottom CTA ───────────────────────────────────────────── */}
          <div className="max-w-3xl bg-[#EEF0FA] border border-[#C9CDE4] rounded-2xl p-10 text-center">
            <MessageCircle className="w-8 h-8 text-[#3D4A8A] mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-[#1B1E33] mb-3">
              רוצים לבדוק אם הסדנה מתאימה לצוות שלכם?
            </h2>
            <p className="text-[#4B5170] mb-8 leading-relaxed max-w-xl mx-auto">
              ספרו לנו מי המשתתפים, אילו משימות מעסיקות את הצוות ומה רמת הניסיון הקיימת. נבחן יחד אם סדנה היא הצעד המתאים ומה צריך להתאים לפני הפעילות.
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                <Button className="bg-[#3D4A8A] hover:bg-[#303A72] text-white font-semibold px-8">
                  בדקו התאמה לסדנה
                </Button>
              </a>
            )}
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
}
