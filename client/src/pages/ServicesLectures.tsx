import { Link } from "wouter";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => { if (typeof window !== 'undefined') (window as any).gtag?.(...args); };
import { Mic, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { useContent } from "@/hooks/useContent";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

export default function ServicesLectures() {
  const { content } = useContent();

  useSeo({
    title: "הרצאות AI להנהלות ולמנהלי כספים | AI Finance",
    description:
      "הרצאות AI להנהלות, CFOs ומנהלים שרוצים להבין הזדמנויות, סיכונים ושימושים אפשריים בעולם הכספים.",
    canonicalPath: "/services/ai-lectures-executives/",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "הרצאות AI להנהלות ולמנהלי כספים",
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
        name: "הרצאות להנהלות",
        item: `${SITE_URL}/services/ai-lectures-executives/`,
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
          <nav aria-label="breadcrumb" className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-300">
              עמוד הבית
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-slate-400">שירותים</span>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-slate-400">הרצאות להנהלות</span>
          </nav>

          {/* ─── Hero ─────────────────────────────────────────────── */}
          <div className="max-w-3xl mb-16 fade-in">
            <span className="section-label mb-5 inline-flex">
              <Mic className="w-4 h-4 ml-2" aria-hidden="true" />
              הרצאות לארגונים
            </span>
            <h1 className="text-4xl md:text-5xl font-bold gradient-heading mt-4 mb-6 leading-tight">
              הרצאות AI להנהלות ולמנהלי כספים
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              הרצאה ממוקדת שמחברת בין ההתפתחויות בעולם ה־AI לבין ההחלטות שמנהלים צריכים לקבל: איפה קיימת הזדמנות, איפה נדרש זהירות ואיך מתחילים לבחון שימושים בארגון.
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8">
                  הזמינו הרצאה להנהלה
                </Button>
              </a>
            )}
          </div>

          {/* ─── למי ההרצאה מתאימה ───────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-white mb-6">למי ההרצאה מתאימה?</h2>
              <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8">
                <ul className="space-y-4">
                  {[
                    "הנהלות וחברי הנהלה",
                    'מנכ"לים, CFOs וסמנכ"לים',
                    "דירקטורים ונושאי משרה",
                    "מנהלי כספים, חשבות, FP&A וביקורת",
                    "מנהלים שרוצים לקבל תמונת מצב מקצועית לפני קבלת החלטה על הכשרה, פיילוט או אימוץ כלי",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="text-blue-400 mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── הבעיה שההרצאה נועדה לפתור ─────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-white mb-6">הבעיה שההרצאה נועדה לפתור</h2>
              <div className="space-y-5 text-slate-300 leading-relaxed">
                <p>
                  מנהלים נחשפים להרבה הבטחות, כלים ומונחים, אך לא תמיד ברור מה רלוונטי לארגון, מה כבר ניתן ליישום ומה עדיין דורש בדיקה. התוצאה עלולה להיות קפיצה לכלים ללא מטרה ברורה — או הימנעות מוחלטת בגלל חוסר ודאות.
                </p>
                <p>
                  ההרצאה נועדה ליצור שפה משותפת ולהציג את הנושא דרך שאלות ניהוליות: אילו שימושים קיימים, מהן המגבלות, אילו סיכונים צריך לנהל ואיך נראה צעד ראשון סביר.
                </p>
              </div>
            </div>
          </section>

          {/* ─── תוצאות ותוצרים צפויים ─────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-white mb-6">תוצאות ותוצרים צפויים</h2>
              <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8">
                <ul className="space-y-4">
                  {[
                    "להבין מושגים מרכזיים בלי להעמיק בפרטים טכניים שאינם נחוצים להחלטה",
                    "להכיר דוגמאות רלוונטיות לעולם הכספים",
                    "להבחין בין התנסות אישית לבין שימוש ארגוני",
                    "לזהות שאלות של פרטיות, אבטחת מידע, בקרה ואחריות",
                    "לנהל דיון המשך ממוקד יותר בתוך הארגון",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── דוגמאות לנושאים ולמשימות פיננסיות ─────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-white mb-6">דוגמאות לנושאים ולמשימות פיננסיות</h2>
              <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8">
                <ul className="space-y-3 mb-6">
                  {[
                    "שימושי AI בדיווח, ניתוח ותחזיות",
                    "עבודה עם מסמכים פיננסיים ועסקיים",
                    "סיכום והכנת מידע לדיוני הנהלה",
                    "אפשרויות לשילוב AI ב־Excel ובכלי עבודה קיימים",
                    "אוטומציה וסוכני AI בתהליכים חוזרים",
                    "מגבלות של מודלי שפה והצורך באימות",
                    "פרטיות, הרשאות ואבטחת מידע",
                    "בחירת תהליך מתאים לניסוי ראשון",
                  ].map((item, i) => (
                    <li key={i} className="text-slate-300 pr-4 border-r-2 border-blue-700/40">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-slate-500 leading-relaxed">
                  הנושאים הסופיים יותאמו להרכב המשתתפים ולמטרת המפגש.
                </p>
              </div>
            </div>
          </section>

          {/* ─── מבנה הפעילות ────────────────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-white mb-8">מבנה הפעילות</h2>
              <div className="space-y-5">
                {[
                  {
                    step: "1",
                    title: "תיאום מטרת ההרצאה",
                    desc: "הגדרת הקהל, רמת ההיכרות וההחלטות או השאלות שהארגון רוצה לקדם.",
                  },
                  {
                    step: "2",
                    title: "התאמת התוכן",
                    desc: "בחירת הדוגמאות, המונחים והדגשים הרלוונטיים לענף ולתפקידי המשתתפים.",
                  },
                  {
                    step: "3",
                    title: "הרצאה והדגמות",
                    desc: "הצגת התמונה הרחבה לצד דוגמאות שמחברות אותה לעבודה הפיננסית.",
                  },
                  {
                    step: "4",
                    title: "שאלות ודיון",
                    desc: "מענה לשאלות והצפת נושאים שהארגון עשוי לרצות לבחון בהמשך.",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8 flex gap-5 items-start"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-700/30 border border-blue-600/40 flex items-center justify-center text-blue-300 font-bold text-sm flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── מה נדרש מהארגון ─────────────────────────────────────── */}
          <section className="relative max-w-3xl mb-20">
            <div
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent"
              aria-hidden="true"
            />
            <div className="pt-14">
              <h2 className="text-2xl font-bold text-white mb-6">מה נדרש מהארגון?</h2>
              <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8">
                <ul className="space-y-4">
                  {[
                    "איש או אשת קשר לתיאום",
                    "מידע על הרכב הקהל ותפקידי המשתתפים",
                    "מטרת המפגש והנושאים החשובים להנהלה",
                    "מגבלות תוכן, כלים או אבטחת מידע שצריך להכיר",
                    "ציוד ותנאי הצגה בהתאם לפורמט שייקבע",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ─── Bottom CTA ───────────────────────────────────────────── */}
          <div className="max-w-3xl bg-gradient-to-br from-blue-950/60 to-[#0a1220] border border-blue-500/20 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              רוצים לבנות שיחה ניהולית ברורה סביב AI?
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto">
              ספרו לנו מי צפוי להשתתף, מה מטרת המפגש ומה רמת ההיכרות הקיימת. נתאים את השיחה לקהל ולשאלות שמעסיקות את הארגון.
            </p>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCtaClick}
              >
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8">
                  הזמינו הרצאה להנהלה
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
