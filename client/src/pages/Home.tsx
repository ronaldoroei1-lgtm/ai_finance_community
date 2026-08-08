import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ChevronDown,
  Users,
  TrendingUp,
  Camera,
  MessageCircle,
  Linkedin,
  Download,
  BookOpen,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Lightbox from "@/components/Lightbox";
import EntryAnimation from "@/components/EntryAnimation";
import { useContent } from "@/hooks/useContent";
import { posts as blogPosts, authors as blogAuthors, categories as blogCategories } from "@/generated/blog";
import ArticleCard from "@/components/blog/ArticleCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => { if (typeof window !== 'undefined') (window as any).gtag?.(...args); };

const iconMap: Record<string, React.ReactNode> = {
  trending: <TrendingUp className="w-10 h-10" />,
  users: <Users className="w-10 h-10" />,
  message: <MessageCircle className="w-10 h-10" />,
};

const navLinks = [
  { label: "על הקהילה", href: "#about" },
  { label: "הצוות", href: "#team" },
  { label: "שירותים", href: "#services" },
  { label: "קורסים", href: "/services/ai-workshops-for-finance/" },
  { label: "לקוחות", href: "#clients" },
  { label: "מדריכים", href: "#guides" },
  { label: "בלוג", href: "/blog/" },
  { label: "שאלות נפוצות", href: "#faq" },
];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.1 },
  }),
};

export default function Home() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content, loading } = useContent();

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrevious = () => {
    if (!content) return;
    setLightboxIndex((prev) => (prev === 0 ? content.gallery.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (!content) return;
    setLightboxIndex((prev) => (prev === content.gallery.length - 1 ? 0 : prev + 1));
  };

  if (loading || !content) {
    return (
      <>
        <EntryAnimation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#3D4A8A] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#4B5170] text-lg">טוען...</p>
          </div>
        </div>
      </>
    );
  }

  const { hero, about, team, services, clients, gallery, faq, contact, cta } = content;

  return (
    <>
      <EntryAnimation />
      <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ─── Navigation ───────────────────────────────────────────── */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 bg-white/[0.92] backdrop-blur-xl border-b border-[#E2E4F3]"
        aria-label="ניווט ראשי"
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-bold text-[#1B1E33] hover:text-[#3D4A8A] transition-colors duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            AI Finance
          </a>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#4B5170] hover:text-[#1B1E33] transition-colors duration-200 font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 right-0 w-0 h-px bg-[#3D4A8A] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
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

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/[0.98] border-b border-[#E2E4F3] shadow-[0_16px_40px_rgba(27,30,51,0.10)] py-4"
          >
            <div className="container flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#4B5170] hover:text-[#1B1E33] transition-colors duration-200 py-3 border-b border-[#E2E4F3] last:border-0 font-medium text-base"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      <main>
        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="relative pt-36 pb-32 overflow-hidden" aria-label="כותרת ראשית">
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg" aria-hidden="true" />

          {/* Ambient glow blobs */}
          <div
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#3D4A8A]/[0.06] rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#3D4A8A]/[0.05] rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3D4A8A]/[0.04] rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Floating particles */}
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-[#7784C8] rounded-full particle opacity-50" aria-hidden="true" />
          <div className="absolute top-40 right-40 w-1 h-1 bg-[#B7BDE5] rounded-full particle opacity-40" style={{ animationDelay: "1s" }} aria-hidden="true" />
          <div className="absolute top-60 right-60 w-1.5 h-1.5 bg-[#7784C8] rounded-full particle opacity-50" style={{ animationDelay: "2s" }} aria-hidden="true" />
          <div className="absolute bottom-40 right-32 w-1 h-1 bg-[#B7BDE5] rounded-full particle opacity-40" style={{ animationDelay: "3s" }} aria-hidden="true" />
          <div className="absolute top-32 left-20 w-1 h-1 bg-[#7784C8] rounded-full particle opacity-35" style={{ animationDelay: "1.5s" }} aria-hidden="true" />

          <div className="container relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Community size badge — visible & meaningful content */}
              <motion.div
                className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-10 bg-[#EEF0FA] border border-[#E2E4F3] rounded-full text-sm text-[#3D4A8A] font-medium"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="w-2 h-2 bg-[#3D4A8A] rounded-full animate-pulse" />
                סדנאות, הרצאות וליווי מעשי לצוותי כספים
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight gradient-heading">
                {hero.headline}
              </h1>
              <p className="text-lg md:text-xl text-[#4B5170] mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                {hero.subtext}
                <br />
                <span className="text-[#3D4A8A] font-medium mt-2 block">{hero.subtagline}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <a href={hero.businessWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => gtag('event', 'whatsapp_click', { location: 'hero' })}>
                  <Button
                    size="lg"
                    className="bg-[#3D4A8A] hover:bg-[#303A72] text-white px-10 py-6 text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-[#3D4A8A]/20 hover:-translate-y-0.5"
                  >
                    בדקו התאמה לסדנה
                  </Button>
                </a>
                <a href="#services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-[#C9CDE4] text-[#303A72] bg-[#EEF0FA] hover:bg-[#E2E5F4] hover:border-[#C9CDE4] px-10 py-6 text-base font-semibold rounded-xl transition-all duration-200"
                  >
                    לשירותים לארגונים
                  </Button>
                </a>
              </div>
              <div className="mb-12">
                <a href="/community/" onClick={() => gtag('event', 'community_join_click')} className="text-sm text-[#646B89] hover:text-[#3D4A8A] transition-colors duration-200">
                  מחפשים כלים ותוכן מקצועי? <span className="text-[#3D4A8A] underline underline-offset-2">הצטרפו לקהילה</span>
                </a>
              </div>

              <div className="flex justify-center gap-3">
                <a
                  href={hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#EEF0FA] border border-[#E2E4F3] rounded-xl hover:bg-[#E2E5F4] hover:border-[#C9CDE4] transition-all duration-200 hover:scale-110"
                  aria-label="LinkedIn - AI Finance"
                >
                  <Linkedin className="w-5 h-5 text-[#3D4A8A]" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── About Section ────────────────────────────────────────── */}
        <motion.section
          className="py-28 relative"
          id="about"
          aria-labelledby="about-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Subtle top divider gradient */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />

          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  הכירו אותנו
                </span>
              </div>
              <div className="flex justify-center mb-10">
                <img src="/images/logo.png" alt="לוגו קהילת AI Finance" className="h-28 w-auto drop-shadow-2xl" />
              </div>
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-center mb-8 gradient-heading">
                על הקהילה
              </h2>
              <p className="text-lg text-[#4B5170] leading-relaxed text-justify">
                {about.text}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ─── Why AI Finance Section ───────────────────────────────── */}
        <motion.section
          className="py-28 relative"
          aria-labelledby="why-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1F2FA] to-transparent pointer-events-none" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  עולם הכספים קודם לכלי
                </span>
              </div>
              <h2 id="why-heading" className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
                מחברים בין AI לעבודה הפיננסית בפועל
              </h2>
              <p className="text-lg text-[#4B5170] leading-relaxed">
                כלי AI משתנים במהירות, אבל האתגרים במחלקת הכספים נשארים מוכרים: דוחות, תחזיות, בקרות, מסמכים, תקציבים ועבודה מול הנהלה. לכן אנחנו לא מתחילים מרשימת כלים. אנחנו מתחילים מהמשימות שהצוות מבצע, מהמידע שהוא עובד איתו ומהמגבלות הארגוניות שצריך להביא בחשבון.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-14">
              {[
                {
                  title: "מיקוד במשימות פיננסיות",
                  body: "הדוגמאות והתרגול מחוברים לעבודה של אנשי כספים — ולא לתרחישים כלליים שאינם רלוונטיים לצוות.",
                },
                {
                  title: "מעבר מהיכרות ליישום",
                  body: "המטרה היא לעזור לצוות להבין איפה AI יכול לסייע, איפה נדרשת בקרה אנושית ואיך נראה תהליך עבודה שאפשר לבחון באופן מסודר.",
                },
                {
                  title: "שפה מקצועית ונגישה",
                  body: "אנחנו מסבירים את הכלים בשפה שמתאימה למנהלים ולאנשי כספים, גם ללא רקע טכנולוגי, תוך התייחסות לסיכונים, למגבלות ולאחריות המקצועית.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="bg-white border border-[#E2E4F3] rounded-2xl p-8 hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)]"
                >
                  <h3 className="text-lg font-bold mb-3 text-[#1B1E33]">{item.title}</h3>
                  <p className="text-[#4B5170] text-sm leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </div>

            <div className="max-w-2xl mx-auto text-center">
              <p className="text-[#646B89] text-sm leading-relaxed mb-8">
                הקהילה מאפשרת לנו להישאר קרובים לשאלות, לאתגרים ולשימושים שחוזרים בעבודת הכספים בשטח. התובנות האלה עוזרות לנו לשמור את התוכן והפעילויות מחוברים לעבודה היומיומית של הקהל.
              </p>
              <a href="#services">
                <Button variant="outline" className="border border-[#C9CDE4] text-[#303A72] bg-[#EEF0FA] hover:bg-[#E2E5F4] hover:border-[#C9CDE4] font-semibold transition-all duration-200">
                  הכירו את השירותים לארגונים
                </Button>
              </a>
            </div>
          </div>
        </motion.section>

        {/* ─── Team Section ─────────────────────────────────────────── */}
        <motion.section
          className="py-28 relative"
          id="team"
          aria-labelledby="team-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />

          {/* Section bg tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1F2FA] to-transparent pointer-events-none" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <Users className="w-3 h-3" aria-hidden="true" />
                  הצוות שלנו
                </span>
              </div>
              <h2 id="team-heading" className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
                מי אנחנו
              </h2>
              <p className="text-[#646B89] text-lg">הצוות שמאחורי הקהילה</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative bg-white border border-[#E2E4F3] rounded-2xl p-8 hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] group overflow-hidden"
                >
                  {/* Decorative top-right glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 bg-[#3D4A8A]/[0.05] rounded-bl-full pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="w-24 h-24 rounded-full mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 overflow-hidden border-2 border-[#E2E4F3] shadow-md shadow-[#3D4A8A]/10 ring-2 ring-[#C9CDE4]">
                    <img
                      src={member.image}
                      alt={`תמונת פרופיל של ${member.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-1.5">{member.name}</h3>
                  <p className="text-sm text-[#3D4A8A] text-center mb-2 font-semibold leading-snug">{member.title}</p>
                  {member.linkedinUrl && (
                    <div className="flex justify-center mb-4">
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#EEF0FA] border border-[#E2E4F3] rounded-lg hover:bg-[#E2E5F4] hover:border-[#C9CDE4] transition-all duration-200 hover:scale-105"
                        aria-label={`לינקדין של ${member.name}`}
                      >
                        <Linkedin className="w-4 h-4 text-[#3D4A8A]" aria-hidden="true" />
                      </a>
                    </div>
                  )}
                  <p className="text-[#4B5170] text-sm mb-6 text-justify leading-relaxed">{member.bio}</p>

                  <ul className="space-y-2.5" aria-label={`תחומי התמחות של ${member.name}`}>
                    {member.expertise.map((exp, i) => (
                      <li key={i} className="text-sm text-[#646B89] flex items-start gap-3">
                        <span className="text-[#3D4A8A] font-bold mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Services Section ─────────────────────────────────────── */}
        <motion.section
          className="py-28 relative"
          id="services"
          aria-labelledby="services-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  הצעת ערך
                </span>
              </div>
              <h2 id="services-heading" className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
                מה אנחנו עושים
              </h2>
              <p className="text-[#646B89] text-lg">סדנאות, הרצאות וליווי למחלקות כספים</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative bg-white border border-[#E2E4F3] rounded-2xl p-8 hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] group overflow-hidden flex flex-col"
                >
                  {/* Large background number */}
                  <div
                    className="absolute bottom-4 left-4 text-8xl font-black text-[#3D4A8A]/[0.10] select-none leading-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Stacked above the decorative background number, which is
                      position:absolute with z-index:auto and would otherwise
                      paint on top of this in-flow content per CSS painting
                      order (positioned descendants paint after static ones). */}
                  <div className="relative z-10 flex flex-col flex-grow">
                    <div
                      className="text-[#3D4A8A] mb-6 group-hover:scale-110 group-hover:text-[#303A72] transition-all duration-300 w-fit"
                      aria-hidden="true"
                    >
                      {iconMap[service.iconKey] ?? <TrendingUp className="w-10 h-10" />}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                    <p className="text-[#4B5170] text-sm mb-6 leading-relaxed flex-grow">{service.description}</p>
                    <a href={hero.businessWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => gtag('event', 'whatsapp_click', { location: 'services' })}>
                      <Button
                        variant="outline"
                        className="border border-[#C9CDE4] text-[#303A72] bg-[#EEF0FA] hover:bg-[#E2E5F4] hover:border-[#C9CDE4] w-full font-semibold transition-all duration-200"
                      >
                        דברו איתנו לפרטים
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Clients Section ──────────────────────────────────────── */}
        <motion.section
          className="py-28 relative"
          id="clients"
          aria-labelledby="clients-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1F2FA] to-transparent pointer-events-none" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  ניסיון מהשטח
                </span>
              </div>
              <h2 id="clients-heading" className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
                ארגונים שעבדנו איתם
              </h2>
              <p className="text-[#646B89] text-lg">הרצאות, סדנאות ופעילויות מקצועיות לאנשי כספים, מנהלים ובעלי תפקידים</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {clients.map((client, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative bg-white border border-[#E2E4F3] rounded-2xl p-7 hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] overflow-hidden"
                >
                  {client.logoUrl && (
                    <div className="h-10 mb-4 flex items-center">
                      <img
                        src={client.logoUrl}
                        alt={`לוגו ${client.name}`}
                        className="h-full max-w-[140px] object-contain object-right"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-[#1B1E33]">{client.name}</h3>
                  <p className="text-[#4B5170] text-sm leading-relaxed">{client.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Gallery Section ──────────────────────────────────────── */}
        <motion.section
          className="py-28 relative"
          id="gallery"
          aria-labelledby="gallery-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <Camera className="w-3 h-3" aria-hidden="true" />
                  גלריה
                </span>
              </div>
              <h2 id="gallery-heading" className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
                גלריית תמונות מההרצאות
              </h2>
              <p className="text-[#646B89] text-lg">רגעים מיוחדים מהרצאות שלנו</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list" aria-label="גלריית תמונות הרצאות">
              {gallery.map((image, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  role="listitem"
                  className="aspect-square bg-[#F1F2FA] rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-300 cursor-pointer group border border-[#E2E4F3] hover:border-[#C9CDE4] shadow-sm hover:shadow-lg hover:shadow-[#1B1E33]/10"
                  onClick={() => openLightbox(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLightbox(i);
                    }
                  }}
                  tabIndex={0}
                  aria-label={`פתח תמונה: ${image.alt}`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:brightness-75 group-hover:scale-105 transition-all duration-500"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Professional Guides Section ──────────────────────────── */}
        <motion.section
          className="py-28 relative"
          id="guides"
          aria-labelledby="guides-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1F2FA] to-transparent pointer-events-none" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <BookOpen className="w-3 h-3" aria-hidden="true" />
                  ידע מקצועי
                </span>
              </div>
              <h2 id="guides-heading" className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
                מדריכים מקצועיים
              </h2>
              <p className="text-[#646B89] text-lg">משאבים לשילוב בינה מלאכותית בעבודה היומיומית</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Excel Guide */}
              <motion.a
                href="/guides/excel-agent-guide.pdf"
                download
                onClick={() => gtag('event', 'guide_download', { guide_name: 'excel-copilot-agent-mode' })}
                className="group"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-white border border-[#E2E4F3] rounded-2xl overflow-hidden hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-[#F1F2FA]">
                    <img
                      src="/images/excel-agent-guide.png"
                      alt="מדריך Excel Copilot Agent Mode לאוטומציה פיננסית"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">Excel Copilot Agent Mode</h3>
                    <p className="text-[#4B5170] text-sm mb-6 leading-relaxed flex-grow">
                      מדריך מעשי לשימוש ב-Agent Mode של Copilot ב-Excel לאוטומציה של משימות פיננסיות וניתוח נתונים
                    </p>
                    <div className="flex items-center gap-2 text-[#3D4A8A] group-hover:text-[#303A72] transition-colors duration-200 font-semibold">
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>הורד PDF</span>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* ChatGPT Guide */}
              <motion.a
                href="/guides/chatgpt-prompts.xlsx"
                download
                onClick={() => gtag('event', 'guide_download', { guide_name: 'chatgpt-prompts' })}
                className="group"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-white border border-[#E2E4F3] rounded-2xl overflow-hidden hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-[#F1F2FA]">
                    <img
                      src="/images/chatgpt-prompts-guide.png"
                      alt="ספריית ChatGPT Prompts לאנשי פיננסים"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">ChatGPT Prompts Library</h3>
                    <p className="text-[#4B5170] text-sm mb-6 leading-relaxed flex-grow">
                      ספריית 20 prompts מעודכנים לתפקידים שונים בפיננסים - CFO, אודיטור, אנליסט ועוד
                    </p>
                    <div className="flex items-center gap-2 text-[#3D4A8A] group-hover:text-[#303A72] transition-colors duration-200 font-semibold">
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>הורד Excel</span>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Gemini Guide */}
              <motion.a
                href="/guides/gemini-prompts.html"
                download
                onClick={() => gtag('event', 'guide_download', { guide_name: 'gemini-prompts' })}
                className="group"
                custom={2}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-white border border-[#E2E4F3] rounded-2xl overflow-hidden hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-[#F1F2FA]">
                    <img
                      src="/images/gemini-prompts-guide.png"
                      alt="ספריית Gemini Prompts לניתוח פיננסי"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">Gemini Prompts Library</h3>
                    <p className="text-[#4B5170] text-sm mb-6 leading-relaxed flex-grow">
                      ספריית prompts מקצועיים עבור Google Gemini לניתוח פיננסי, דוחות ותכנון אסטרטגי
                    </p>
                    <div className="flex items-center gap-2 text-[#3D4A8A] group-hover:text-[#303A72] transition-colors duration-200 font-semibold">
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>הורד HTML</span>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Claude Skill Guide */}
              <motion.a
                href="/guides/claude-skill-guide.pdf"
                download
                onClick={() => gtag('event', 'guide_download', { guide_name: 'claude-skill-guide' })}
                className="group"
                custom={3}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-white border border-[#E2E4F3] rounded-2xl overflow-hidden hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-[#F1F2FA]">
                    <img
                      src="/images/guides/guide-claude-skill.png"
                      alt="מדריך בניית Skill מותאם ל-Claude"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">Claude Skill — מדריך בנייה</h3>
                    <p className="text-[#4B5170] text-sm mb-6 leading-relaxed flex-grow">
                      מדריך צעד־אחר־צעד לבניית Skill מותאם ל-Claude: כתיבת ההוראות ב-Notepad וב-YAML, שמירה, אריזה כ-ZIP והעלאה
                    </p>
                    <div className="flex items-center gap-2 text-[#3D4A8A] group-hover:text-[#303A72] transition-colors duration-200 font-semibold">
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>הורד PDF</span>
                    </div>
                  </div>
                </div>
              </motion.a>

              {/* Copilot Excel Prompts Guide */}
              <motion.a
                href="/guides/copilot-excel-prompts.pdf"
                download
                onClick={() => gtag('event', 'guide_download', { guide_name: 'copilot-excel-prompts' })}
                className="group"
                custom={4}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-white border border-[#E2E4F3] rounded-2xl overflow-hidden hover:border-[#C9CDE4] transition-all duration-300 shadow-[0_1px_3px_rgba(27,30,51,0.06)] hover:shadow-[0_4px_12px_rgba(27,30,51,0.11)] h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-[#F1F2FA]">
                    <img
                      src="/images/guides/guide-copilot-excel.png"
                      alt="ספריית 15 פרומפטים ל-Copilot ב-Excel"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">Copilot ל-Excel — 15 פרומפטים</h3>
                    <p className="text-[#4B5170] text-sm mb-6 leading-relaxed flex-grow">
                      ספרייה של 15 פרומפטים מוכנים להעתקה, מאורגנים בחמישה שלבי עבודה: ביקורת נתונים, ניקוי, מבנה, נוסחאות, ניתוח וויזואליזציה
                    </p>
                    <div className="flex items-center gap-2 text-[#3D4A8A] group-hover:text-[#303A72] transition-colors duration-200 font-semibold">
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>הורד PDF</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.section>

        {/* ─── From the Blog Section ─────────────────────────────────── */}
        {/* Renders only once there are published posts - stays invisible
            until content/blog/*.md has real content, so it never ships an
            empty "coming soon" section. */}
        {blogPosts.length > 0 && (
          <motion.section
            className="py-28 relative"
            id="blog"
            aria-labelledby="blog-heading"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />

            <div className="container relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
                <div>
                  <span className="section-label mb-5 inline-flex">
                    <BookOpen className="w-3 h-3" aria-hidden="true" />
                    מהבלוג
                  </span>
                  <h2 id="blog-heading" className="text-4xl md:text-5xl font-bold gradient-heading">
                    מדריכים אחרונים
                  </h2>
                </div>
                <a
                  href="/blog/"
                  className="text-sm font-semibold text-[#3D4A8A] hover:text-[#303A72] transition-colors duration-200"
                >
                  כל המדריכים ←
                </a>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.slice(0, 3).map((post) => (
                  <ArticleCard
                    key={post.slug}
                    post={post}
                    author={blogAuthors[post.author]}
                    category={blogCategories.find((c) => c.id === post.category)}
                  />
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* ─── FAQ Section ──────────────────────────────────────────── */}
        <motion.section
          className="py-28 relative"
          id="faq"
          aria-labelledby="faq-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />

          <div className="container max-w-3xl relative z-10">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <MessageCircle className="w-3 h-3" aria-hidden="true" />
                  שאלות ותשובות
                </span>
              </div>
              <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold gradient-heading">
                שאלות נפוצות
              </h2>
            </div>

            <div className="space-y-3">
              {faq.map((item, idx) => {
                const isExpanded = expandedFaq === idx;
                const panelId = `faq-panel-${idx}`;
                const buttonId = `faq-button-${idx}`;
                return (
                  <motion.div
                    key={idx}
                    custom={idx}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? "border-[#6674BC] shadow-lg shadow-[#3D4A8A]/[0.08]"
                        : "border-[#E2E4F3] hover:border-[#C9CDE4]"
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ─── CTA Section ──────────────────────────────────────────── */}
        <motion.section
          className="py-32 relative"
          aria-labelledby="cta-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2E4F3] to-transparent" aria-hidden="true" />

          {/* Ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3D4A8A]/[0.05] rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="container max-w-2xl relative z-10">
            <div className="text-center bg-white/95 backdrop-blur-sm border border-[#E2E4F3] rounded-3xl p-12 shadow-[0_20px_50px_rgba(27,30,51,0.12)]">
              <div className="flex justify-center mb-6">
                <span className="section-label">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  מוכנים להתחיל?
                </span>
              </div>
              <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
                {cta.headline}
              </h2>
              <p className="text-lg text-[#4B5170] mb-10 leading-relaxed">
                {cta.subtext}
              </p>
              <a href={hero.businessWhatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => gtag('event', 'whatsapp_click', { location: 'cta' })}>
                <Button
                  size="lg"
                  className="bg-[#25D366] hover:bg-[#1FBE5B] text-white px-14 py-7 text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-[#25D366]/25 hover:-translate-y-0.5"
                >
                  {cta.buttonText}
                </Button>
              </a>
              <div className="mt-5">
                <a
                  href={hero.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => gtag('event', 'community_join_click')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366]/90 hover:bg-[#1FBE5B] border border-[#25D366]/30 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/20"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  {cta.whatsappButtonText}
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Lightbox */}
      <Lightbox
        images={gallery}
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <footer className="border-t border-[#D2D6EA] bg-[#E9EAF8] py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-bold mb-3 text-lg text-[#1B1E33]">AI Finance Community</h3>
              <p className="text-sm text-[#4B5170] leading-relaxed mb-6 max-w-xs">
                AI מעשי למחלקות כספים — סדנאות, הרצאות וליווי, מאחורינו קהילה של מעל 1,800 אנשי כספים ישראלים.
              </p>
              <div className="flex gap-3">
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-[#EEF0FA] border border-[#E2E4F3] rounded-lg hover:bg-[#E2E5F4] hover:border-[#C9CDE4] transition-all duration-200 hover:scale-105"
                  aria-label="LinkedIn - AI Finance"
                >
                  <Linkedin className="w-4 h-4 text-[#3D4A8A]" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm text-[#1B1E33] uppercase tracking-wider">ניווט</h3>
              <ul className="space-y-2.5 text-sm text-[#3D4A8A]">
                <li><a href="#about" className="hover:text-[#303A72] hover:underline transition-colors duration-200">על הקהילה</a></li>
                <li><a href="#team" className="hover:text-[#303A72] hover:underline transition-colors duration-200">הצוות</a></li>
                <li><a href="#services" className="hover:text-[#303A72] hover:underline transition-colors duration-200">שירותים</a></li>
                <li><a href="/services/ai-workshops-for-finance/" className="hover:text-[#303A72] hover:underline transition-colors duration-200">קורסים</a></li>
                <li><a href="#guides" className="hover:text-[#303A72] hover:underline transition-colors duration-200">מדריכים</a></li>
                <li><a href="/blog/" className="hover:text-[#303A72] hover:underline transition-colors duration-200">בלוג</a></li>
                <li><a href="#faq" className="hover:text-[#303A72] hover:underline transition-colors duration-200">שאלות נפוצות</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-sm text-[#1B1E33] uppercase tracking-wider">צור קשר</h3>
              <ul className="space-y-2.5 text-sm text-[#3D4A8A]">
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-[#303A72] hover:underline transition-colors duration-200">
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#303A72] hover:underline transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#D2D6EA] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#646B89]">© 2026 AI Finance Community. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
