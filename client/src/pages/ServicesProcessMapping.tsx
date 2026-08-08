import { Link } from "wouter";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => { if (typeof window !== 'undefined') (window as any).gtag?.(...args); };
import { GitBranch, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { useContent } from "@/hooks/useContent";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

export default function ServicesProcessMapping() {
  const { content } = useContent();

  useSeo({
    title: "מיפוי תהליכי AI למחלקות כספים | AI Finance",
    description:
      "מיפוי תהליכים פיננסיים, בחירת שימושי AI ריאליים והגדרת בסיס לפיילוט שניתן לבחון, לבקר ולמדוד.",
    canonicalPath: "/services/ai-process-mapping-finance/",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "מיפוי תהליכי AI למחלקות כספים",
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
        name: "מיפוי תהליכים",
        item: `${SITE_URL}/services/ai-process-mapping-finance/`,
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
            <span className="text-[#646B89]">מיפוי תהליכים</span>
          </nav>

          {/* ─── Hero ─────────────────────────────────────────────── */}
          <div className="max-w-3xl mb-16 fade-in">
            <span className="section-label mb-5 inline-flex">
              <GitBranch className="w-4 h-4 ml-2" aria-hidden="true" />
              ליווי ופיילוטים
            </span>
            <h1 className="text-4xl md:text-5xl font-bold gradient-heading mt-4 mb-6 leading-tight">
              מיפוי תהליכים וליווי פיילוטים במחלקות כספים
            </h1>
            <p className="text-lg text-[#4B5170] leading-relaxed mb-8">
              לפני שבוחרים כלי או מתחילים לפתח פתרון, צריך להבין איזה תהליך באמת כדאי לשפר. אנחנו מסייעים למפות את העבודה, לזהות שימושים ריאליים ולהגדיר בסיס לפיילוט שאפשר לבדוק באופן מסודר.
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                <Button className="bg-[#3D4A8A] hover:bg-[#303A72] text-white font-semibold px-8">
                  תאמו שיחת מיפוי
                </Button>
              </a>
            )}
          </div>

          {/* ─── למי השירות מתאים ────────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">למי השירות מתאים?</h2>
              <div className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)]">
                <ul className="space-y-4">
                  {[
                    "מחלקות כספים שכבר מכירות כלי AI ורוצות להתקדם מעבר להתנסות אישית",
                    "CFOs ומנהלים שרוצים לבחור תהליך ראשון באופן מבוסס",
                    "צוותים שיש להם כמה רעיונות, אך אין להם דרך ברורה לתעדף ביניהם",
                    "ארגונים שרוצים להגדיר תהליך, בקרות ומדדי בדיקה לפני פיילוט",
                    "מחלקות שרוצות לבחון היתכנות בלי להתחייב מראש לפרויקט רחב",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#4B5170]">
                      <span className="text-[#3D4A8A] mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── הבעיה שהשירות נועד לפתור ──────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">הבעיה שהשירות נועד לפתור</h2>
              <div className="space-y-5 text-[#4B5170] leading-relaxed">
                <p>
                  ארגונים רבים מתחילים מהכלי: רוכשים רישיון, בונים אוטומציה או מפעילים פיילוט לפני שהוגדרו הבעיה, בעל התהליך, איכות הקלט ואופן הבקרה. כך קשה לדעת אם הפתרון באמת מתאים או כיצד למדוד אותו.
                </p>
                <p>
                  המיפוי מתחיל מהעבודה עצמה. בוחנים את השלבים, הקלטים, ההחלטות, נקודות הכשל והבקרות — ורק לאחר מכן בודקים היכן AI עשוי להשתלב.
                </p>
              </div>
            </div>
          </section>

          {/* ─── תוצאות ותוצרים צפויים ─────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">תוצאות ותוצרים צפויים</h2>
              <div className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)]">
                <ul className="space-y-4 mb-6">
                  {[
                    "רשימת תהליכים או משימות שנבחנו",
                    "תיעדוף ראשוני לפי ערך, מורכבות, סיכון וזמינות מידע",
                    "הגדרה ברורה של תרחיש שימוש אחד או יותר",
                    "תיאור תהליך העבודה הנוכחי והתהליך המוצע",
                    "נקודות בקרה ואישור אנושי",
                    "שאלות שצריך לפתור לפני יציאה לפיילוט",
                    "הגדרה ראשונית של מה ייבדק בפיילוט וכיצד תתקבל החלטת המשך",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#4B5170]">
                      <CheckCircle2 className="w-4 h-4 text-[#3D4A8A] mt-1 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[#646B89] leading-relaxed">
                  ההיקף הסופי ייקבע בהתאם לתהליך שיוגדר ולצורכי הארגון.
                </p>
              </div>
            </div>
          </section>

          {/* ─── דוגמאות לתהליכים פיננסיים ─────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">דוגמאות לתהליכים פיננסיים</h2>
              <div className="bg-white border border-[#E2E4F3] rounded-2xl p-8 shadow-[0_1px_3px_rgba(27,30,51,0.06)]">
                <ul className="space-y-3 mb-6">
                  {[
                    "תקציב מול ביצוע והסבר סטיות",
                    "הכנת דיווחים ומצגות הנהלה",
                    "איסוף וסיכום מידע לקראת סגירת חודש",
                    "תחזיות וניתוח תרחישים",
                    "עבודה חוזרת עם מסמכים, חוזים או נהלים",
                    "תהליכי גבייה ומעקב",
                    "התאמות ובקרות",
                    "מיון, סיכום והעברת מידע בין בעלי תפקידים",
                  ].map((item, i) => (
                    <li key={i} className="text-[#4B5170] pr-4 border-r-2 border-[#C9CDE4]">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-[#646B89] leading-relaxed">
                  אלו דוגמאות בלבד. תהליך מתאים לפיילוט ייבחר לפי צרכי הארגון, איכות המידע, רמת הסיכון והיכולת לבצע בקרה.
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
                    title: "הגדרת מטרה והיקף",
                    desc: "הבנת האתגר העסקי, המשתתפים בתהליך והסיבה שבגללה בוחנים שינוי.",
                  },
                  {
                    step: "2",
                    title: "מיפוי המצב הקיים",
                    desc: "תיעוד השלבים, הקלטים, המערכות, בעלי התפקידים, ההחלטות ונקודות הבקרה.",
                  },
                  {
                    step: "3",
                    title: "איתור ותיעדוף שימושים",
                    desc: "בחינת המקומות שבהם AI עשוי לסייע, לצד מגבלות, סיכונים ותלויות.",
                  },
                  {
                    step: "4",
                    title: "הגדרת פיילוט",
                    desc: "בחירת תרחיש מצומצם, הגדרת גבולות, אחריות, בקרה ושאלות לבדיקה.",
                  },
                  {
                    step: "5",
                    title: "ליווי ובחינת המשך",
                    desc: "היקף הליווי לאחר המיפוי ייקבע בנפרד בהתאם לצורך.",
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
                    "בעל או בעלת תהליך שמכירים את העבודה בפועל",
                    "נציגות של המשתמשים בתהליך ושל הגורמים המאשרים אותו",
                    "תיאור של המערכות, הקבצים והמידע שבהם משתמשים",
                    "מגבלות אבטחת מידע, פרטיות, הרשאות ורגולציה",
                    "נכונות להתחיל מתהליך מצומצם שניתן לבחון",
                    "גישה לדוגמאות שעברו הסרה של פרטים רגישים",
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
            <h2 className="text-2xl font-bold text-[#1B1E33] mb-3">
              רוצים לבחור תהליך ראשון בצורה מסודרת?
            </h2>
            <p className="text-[#4B5170] mb-8 leading-relaxed max-w-xl mx-auto">
              ספרו לנו איזה תהליך מעסיק אתכם, מי משתמש בו כיום ומה הייתם רוצים לבדוק. בשיחת המיפוי נבחן אם קיימת נקודת פתיחה מתאימה ומה צריך לברר לפני שמתקדמים.
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                <Button className="bg-[#3D4A8A] hover:bg-[#303A72] text-white font-semibold px-8">
                  תאמו שיחת מיפוי
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
