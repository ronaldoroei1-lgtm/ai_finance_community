import { useState } from "react";
import { Link } from "wouter";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => { if (typeof window !== 'undefined') (window as any).gtag?.(...args); };
import { ChevronDown, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { useContent } from "@/hooks/useContent";
import { useSeo, SITE_URL } from "@/hooks/useSeo";

/**
 * ────────────────────────────────────────────────────────────────
 * Content source: blog-source/ai-courses-service-page.md (delivered by
 * Codex). Course images live at client/public/images/services/*.jpg
 * (resized/compressed copies of blog-source/course-images/*.jpeg).
 * This is the initial pass: short card copy only, no expanded syllabus
 * yet - see the source md for what's still pending verification.
 * ────────────────────────────────────────────────────────────────
 */
const PAGE_META = {
  title: "קורסי AI לאנשי כספים ומנהלים | AI Finance",
  description: "שלושה קורסי AI מעשיים: יסודות, AI מתקדם וניתוח דוחות כספיים, בשיתוף המרכז הארצי להכשרת דירקטורים.",
};

const HERO = {
  h1: "קורסי AI מעשיים לאנשי כספים ומנהלים",
  subtext: "שלושה מסלולי לימוד, מרמת היסודות ועד עבודה מתקדמת וניתוח פיננסי בעזרת AI.",
};

const INTRO =
  "AI Finance והמרכז הארצי להכשרת דירקטורים מציעים שלושה קורסים שמחברים בין כלי AI לבין עבודה מקצועית. המסלולים מיועדים לאנשי כספים, מנהלים ובעלי תפקידים שרוצים להכיר את הכלים, להשתמש בהם בצורה מעשית או להעמיק ביישומים מתקדמים. אפשר להתחיל בקורס היסודות, להמשיך למסלול המתקדם או לבחור בקורס הממוקד בניתוח דוחות כספיים.";

const COURSES = [
  {
    name: "ניתוח דוחות כספיים בעזרת AI",
    image: "/images/services/financial-statements-ai-course.jpg",
    imageAlt: "קורס קריאה וניתוח דוחות כספיים באמצעות AI",
    description:
      "קורס מעשי לקריאה ולהבנה של דוחות כספיים ברמה ניהולית, תוך שימוש ב־AI לניתוח ביצועים, סיכונים והזדמנויות.",
    audience:
      "בוגרי קורס דירקטורים, מנכ\"לים, בכירים ואנשי מקצוע. רלוונטי גם לאנשי כספים ולמנהלים שנדרשים לקרוא דוחות ולקבל החלטות על בסיסם.",
    highlights: [
      "הבנת דוחות כספיים ברמה ניהולית גבוהה",
      "ניתוח ביצועים בעזרת AI",
      "זיהוי וניתוח של סיכונים והזדמנויות בעזרת AI",
    ],
    format: "5 מפגשים · 17 שעות אקדמיות · Zoom · ימי רביעי 17:30–20:00 · פתיחה: 6.10.2026",
    price: "1,200 ₪ כולל מע\"מ בהרשמה מוקדמת (במקום 1,600 ₪), עד 16.8.2026",
    sourceUrl: "https://director-center.co.il/financial-statement-analysis-using-ai/",
  },
  {
    name: "AI מתקדם",
    image: "/images/services/ai-advanced-course.jpg",
    imageAlt: "קורס AI מתקדם למנהלים ולאנשי מקצוע",
    description:
      "קורס המשך מעשי למנהלים ולאנשי מקצוע שכבר משתמשים בכלי AI ורוצים להעמיק בניתוח, אוטומציה, סוכנים וכלי מחקר והצגה.",
    audience:
      "בוגרי קורס AI בסיסי או הכשרה מקבילה; מנהלים ואנשי מקצוע עם היכרות בסיסית או שימוש שבועי בכלי AI.",
    highlights: [
      "ניתוחים עסקיים מתקדמים והשוואה בין חברות עם ChatGPT Plus",
      "עבודה עם מסמכים וחוזים מורכבים בעזרת Claude Pro",
      "בניית סוכני AI ואוטומציות, לרבות Custom GPTs ו־Manus AI",
    ],
    format: "5 מפגשים · 16 שעות אקדמיות · Zoom · ימי שלישי 17:30–19:30 · פתיחה: 17.11.2026",
    price: "1,200 ₪ כולל מע\"מ בהרשמה מוקדמת (במקום 1,600 ₪) — יש לבדוק תוקף ההטבה",
    sourceUrl: "https://director-center.co.il/ai-advanced/",
  },
  {
    name: "AI בסיסי",
    image: "/images/services/ai-basic-course.jpg",
    imageAlt: "קורס יסודות AI למנהלים ולאנשי מקצוע",
    description:
      "מסלול כניסה למי שרוצים להתחיל לעבוד נכון עם AI, להכיר את יסודות התחום ולבנות בסיס לפני מעבר ליישומים מתקדמים יותר.",
    audience:
      "מנהלים ובעלי עסקים, בוגרי קורס דירקטורים, נושאי משרה, יועצים ואנשי מקצוע שנמצאים בתחילת הדרך עם כלי AI.",
    highlights: ["יסודות העבודה עם AI", "בניית בסיס לעבודה נכונה עם כלי AI"],
    format: "4 מפגשים · 10 שעות אקדמיות · Zoom · ימי שני 17:30–20:00 · פתיחה: 5.10.2026",
    price: "550 ₪ כולל מע\"מ",
    sourceUrl: "https://director-center.co.il/ai-basic/",
  },
];

const COMPARISON = [
  {
    course: "AI בסיסי",
    fit: "מנהלים ואנשי מקצוע שעושים את הצעדים הראשונים עם כלי AI",
    level: "מתחילים",
  },
  {
    course: "AI מתקדם",
    fit: "מי שכבר מכירים כלי AI ורוצים להעמיק בניתוח, אוטומציה וסוכנים",
    level: "בוגרי קורס בסיסי או בעלי ניסיון מקביל ושימוש שבועי",
  },
  {
    course: "ניתוח דוחות כספיים בעזרת AI",
    fit: "אנשי כספים, מנהלים ובכירים שמחפשים יישום ממוקד בתחום הדוחות הכספיים",
    level: "מסלול מקצועי ממוקד; דרישות הקדם לא צוינו בפרסום",
  },
];

const FAQ = [
  {
    question: "האם נדרש ניסיון קודם?",
    answer:
      "לקורס AI מתקדם נדרשת היכרות בסיסית עם כלי AI — באמצעות קורס בסיסי, הכשרה מקבילה או שימוש שבועי. לגבי קורס AI בסיסי והקורס לניתוח דוחות כספיים, דרישות הקדם לא צוינו בפרסומים — יש לבדוק.",
  },
  {
    question: "האם מקבלים תעודה?",
    answer:
      "המרכז מציג באתרו תעודת דיפלומה לדוגמה, אך הזכאות לתעודה ותנאיה אינם מפורטים בעמודים של שלושת הקורסים — יש לבדוק לפני ההרשמה.",
  },
  {
    question: "האם הקורסים מתקיימים אונליין?",
    answer: "שלושת הקורסים מתקיימים ב־Zoom.",
  },
  {
    question: "איך נרשמים?",
    answer:
      "שלחו לנו הודעה בוואטסאפ עם שם הקורס שמעניין אתכם. נחזור אליכם עם המועד הקרוב, המחיר המעודכן ופרטי ההרשמה.",
  },
];

const CTA = {
  heading: "רוצים לבדוק איזה מסלול מתאים לכם?",
  subtext:
    "ספרו לנו בקצרה מה התפקיד שלכם, מה הניסיון הקודם שלכם עם AI ומה הייתם רוצים לדעת לעשות בסיום הקורס. נעזור לכם לבחור את המסלול המתאים ולקבל את פרטי ההרשמה המעודכנים.",
  buttonText: "לפרטים והרשמה בוואטסאפ",
};
/** ──────────────────────────────────────────────────────────────── */

export default function ServicesAIWorkshops() {
  const { content } = useContent();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const whatsappUrl = content?.hero.businessWhatsappUrl;

  useSeo({
    title: PAGE_META.title,
    description: PAGE_META.description,
    canonicalPath: "/services/ai-workshops-for-finance/",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "קורסי AI לאנשי כספים ומנהלים",
      provider: {
        "@type": "Organization",
        name: "AI Finance Community",
        url: `${SITE_URL}/`,
      },
      areaServed: "IL",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "קורסי AI לכספים",
        itemListElement: COURSES.map((course) => ({
          "@type": "Course",
          name: course.name,
          description: course.description,
          provider: { "@type": "Organization", name: "AI Finance Community" },
        })),
      },
    },
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "קורסי AI לאנשי כספים ומנהלים", item: `${SITE_URL}/services/ai-workshops-for-finance/` },
    ],
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
          <nav aria-label="breadcrumb" className="text-sm text-[#646B89] mb-6">
            <Link href="/" className="hover:text-[#3D4A8A]">עמוד הבית</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-[#646B89]">קורסי AI לאנשי כספים ומנהלים</span>
          </nav>

          {/* ─── Hero ─────────────────────────────────────────────── */}
          <div className="max-w-3xl mb-12 fade-in">
            <span className="section-label mb-5 inline-flex">בשיתוף המרכז הארצי להכשרת דירקטורים</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1B1E33] leading-tight mt-4 mb-4">
              {HERO.h1}
            </h1>
            <p className="text-lg text-[#4B5170] leading-relaxed">{HERO.subtext}</p>
          </div>

          <p className="max-w-3xl text-[#4B5170] leading-relaxed mb-16">{INTRO}</p>

          {/* ─── Course cards ─────────────────────────────────────── */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {COURSES.map((course, idx) => (
              <div
                key={course.name}
                className="relative bg-white border border-[#E2E4F3] rounded-2xl overflow-hidden hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] flex flex-col"
              >
                <div className="aspect-square bg-secondary">
                  <img
                    src={course.image}
                    alt={course.imageAlt}
                    loading={idx === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-3 text-[#1B1E33]">{course.name}</h2>
                  <p className="text-sm text-[#4B5170] leading-relaxed mb-4">{course.description}</p>
                  <p className="text-xs text-[#646B89] mb-4">{course.audience}</p>

                  <ul className="space-y-2 mb-6 flex-grow">
                    {course.highlights.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#4B5170]">
                        <CheckCircle2 className="w-4 h-4 text-[#3D4A8A] mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-xs text-[#646B89] mb-1">{course.format}</div>
                  <div className="text-xs text-[#646B89] mb-6">{course.price}</div>

                  <a
                    href={course.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => gtag('event', 'external_course_click', { course_name: course.name })}
                    className="inline-flex items-center gap-1.5 text-xs text-[#3D4A8A] hover:text-[#303A72] transition-colors duration-200"
                  >
                    לעמוד הקורס במרכז להכשרת דירקטורים
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Comparison ───────────────────────────────────────── */}
          <div className="max-w-4xl mb-20">
            <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">איזה קורס מתאים לכם?</h2>
            <div className="overflow-x-auto rounded-xl border border-[#E2E4F3]">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-[#F1F2FA] text-[#646B89]">
                    <th className="px-5 py-3 font-semibold">קורס</th>
                    <th className="px-5 py-3 font-semibold">מתאים בעיקר ל...</th>
                    <th className="px-5 py-3 font-semibold">רמת ניסיון</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.course} className={i % 2 === 0 ? "bg-transparent" : "bg-[#F7F7FD]"}>
                      <td className="px-5 py-4 font-semibold text-[#1B1E33] whitespace-nowrap">{row.course}</td>
                      <td className="px-5 py-4 text-[#4B5170]">{row.fit}</td>
                      <td className="px-5 py-4 text-[#646B89]">{row.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── FAQ ──────────────────────────────────────────────── */}
          <div className="max-w-3xl mb-20">
            <h2 className="text-2xl font-bold text-[#1B1E33] mb-6">שאלות נפוצות</h2>
            <div className="space-y-3">
              {FAQ.map((item, idx) => {
                const isExpanded = expandedFaq === idx;
                const panelId = `services-faq-panel-${idx}`;
                const buttonId = `services-faq-button-${idx}`;
                return (
                  <div
                    key={idx}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                      isExpanded ? "border-[#6674BC] shadow-lg shadow-[#3D4A8A]/[0.08]" : "border-[#E2E4F3] hover:border-[#C9CDE4]"
                    }`}
                  >
                    <button
                      id={buttonId}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-[#F0F1FA] transition-colors duration-200 text-right"
                    >
                      <span className="font-semibold text-right text-base leading-snug text-[#1B1E33]">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#3D4A8A] transition-transform duration-300 flex-shrink-0 ml-4 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!isExpanded}
                      className="px-6 py-5 bg-[#F7F7FD] border-t border-[#E2E4F3] text-[#4B5170] text-sm leading-relaxed"
                    >
                      {item.answer}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── CTA ──────────────────────────────────────────────── */}
          <div className="max-w-3xl bg-[#EEF0FA] border border-[#C9CDE4] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-[#1B1E33] mb-3">{CTA.heading}</h2>
            <p className="text-[#4B5170] mb-6">{CTA.subtext}</p>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#25D366] hover:bg-[#1FBE5B] text-white font-semibold px-8">
                  {CTA.buttonText}
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
