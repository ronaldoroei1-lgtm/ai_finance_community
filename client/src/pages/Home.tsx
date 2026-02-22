import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Brain,
  Users,
  TrendingUp,
  Camera,
  MessageCircle,
  Linkedin,
  Instagram,
  Download,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Lightbox from "@/components/Lightbox";
import { useContent } from "@/hooks/useContent";

const iconMap: Record<string, React.ReactNode> = {
  trending: <TrendingUp className="w-10 h-10" />,
  users: <Users className="w-10 h-10" />,
  message: <MessageCircle className="w-10 h-10" />,
};

const navLinks = [
  { label: "על הקהילה", href: "#about" },
  { label: "הצוות", href: "#team" },
  { label: "שירותים", href: "#services" },
  { label: "לקוחות", href: "#clients" },
  { label: "שאלות נפוצות", href: "#faq" },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const cardVariants = {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-300 text-lg">טוען...</p>
        </div>
      </div>
    );
  }

  const { hero, about, team, services, clients, gallery, faq, contact, cta } = content;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden" style={{ fontFamily: "'Rubik', sans-serif" }}>

      {/* ─── Navigation ───────────────────────────────────────────── */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 bg-background/90 backdrop-blur-md border-b border-blue-800/60"
        aria-label="ניווט ראשי"
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-bold text-blue-300 hover:text-blue-200 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            AI Finance
          </a>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-blue-300 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={hero.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-green-500/30"
            >
              הצטרפו לקהילה
            </a>
            <button
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
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
            className="md:hidden bg-background/98 border-b border-blue-800 py-4"
          >
            <div className="container flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-blue-300 transition-colors py-3 border-b border-blue-900/60 last:border-0 font-medium text-base"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={hero.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-accent hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all"
              >
                הצטרפו לקהילה
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      <main>
        {/* ─── Hero Section ─────────────────────────────────────────── */}
        <section className="relative pt-32 pb-28 overflow-hidden" aria-label="כותרת ראשית">
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />

          {/* Ambient glow blobs */}
          <div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Floating particles */}
          <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full particle opacity-60" aria-hidden="true" />
          <div className="absolute top-40 right-40 w-1 h-1 bg-blue-300 rounded-full particle opacity-50" style={{ animationDelay: "1s" }} aria-hidden="true" />
          <div className="absolute top-60 right-60 w-2 h-2 bg-blue-500 rounded-full particle opacity-60" style={{ animationDelay: "2s" }} aria-hidden="true" />
          <div className="absolute bottom-40 right-32 w-1 h-1 bg-blue-400 rounded-full particle opacity-50" style={{ animationDelay: "3s" }} aria-hidden="true" />
          <div className="absolute top-32 left-20 w-1.5 h-1.5 bg-blue-300 rounded-full particle opacity-40" style={{ animationDelay: "1.5s" }} aria-hidden="true" />

          <div className="container relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Community size badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-blue-900/60 border border-blue-700/60 rounded-full text-sm text-blue-300 font-medium"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                aria-hidden="true"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                קהילה פעילה עם 1,700+ אנשי כספים
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight tracking-tight">
                {hero.headline}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                {hero.subtext}
                <br />
                <span className="text-blue-400 font-medium mt-1 block">{hero.subtagline}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a href={hero.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-green-600 text-white px-10 py-6 text-base font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5"
                  >
                    הצטרפו לקהילה
                  </Button>
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-blue-500/70 text-white hover:bg-blue-900/50 hover:border-blue-400 px-10 py-6 text-base font-semibold rounded-xl transition-all"
                  >
                    פנו אלינו
                  </Button>
                </a>
              </div>

              <div className="flex justify-center gap-4">
                <a
                  href={hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-900/60 border border-blue-800 rounded-xl hover:bg-blue-800 hover:border-blue-600 transition-all hover:scale-110 duration-300"
                  aria-label="LinkedIn - AI Finance"
                >
                  <Linkedin className="w-5 h-5 text-blue-300" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── About Section ────────────────────────────────────────── */}
        <motion.section
          className="py-24 bg-gradient-to-b from-blue-950/30 to-background"
          id="about"
          aria-labelledby="about-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-8" aria-hidden="true">
                <div className="p-4 bg-blue-900/60 border border-blue-700/50 rounded-2xl shadow-lg shadow-blue-900/30">
                  <Brain className="w-14 h-14 text-blue-300" />
                </div>
              </div>
              <div className="flex justify-center mb-8">
                <img src="/images/logo.png" alt="לוגו קהילת AI Finance" className="h-28 w-auto" />
              </div>
              <h2 id="about-heading" className="text-4xl md:text-5xl font-bold text-center mb-8">
                על הקהילה
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed text-justify">
                {about.text}
              </p>
            </div>
          </div>
        </motion.section>

        {/* ─── Team Section ─────────────────────────────────────────── */}
        <motion.section
          className="py-24"
          id="team"
          aria-labelledby="team-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container">
            <h2 id="team-heading" className="text-4xl md:text-5xl font-bold text-center mb-4">
              מי אנחנו
            </h2>
            <p className="text-center text-slate-400 mb-14 text-lg">הצוות שמאחורי הקהילה</p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative bg-gradient-to-br from-blue-900/50 to-blue-950/60 border border-blue-800/70 rounded-2xl p-8 hover:border-blue-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 group overflow-hidden"
                >
                  {/* Decorative corner accent */}
                  <div
                    className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-bl-full pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 overflow-hidden border-4 border-blue-700/40 shadow-lg shadow-blue-900/40">
                    <img
                      src={member.image}
                      alt={`תמונת פרופיל של ${member.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{member.name}</h3>
                  <p className="text-sm text-blue-300 text-center mb-5 font-semibold leading-snug">{member.title}</p>
                  <p className="text-slate-300 text-sm mb-6 text-justify leading-relaxed">{member.bio}</p>

                  <ul className="space-y-2.5" aria-label={`תחומי התמחות של ${member.name}`}>
                    {member.expertise.map((exp, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-3">
                        <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
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
          className="py-24 bg-gradient-to-b from-blue-950/30 to-background"
          id="services"
          aria-labelledby="services-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container">
            <h2 id="services-heading" className="text-4xl md:text-5xl font-bold text-center mb-4">
              המוצרים והשירותים שלנו
            </h2>
            <p className="text-center text-slate-400 mb-14 text-lg">מה אנחנו מציעים</p>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative bg-gradient-to-br from-blue-900/40 to-blue-950/50 border border-blue-800/70 rounded-2xl p-8 hover:border-blue-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 group overflow-hidden flex flex-col"
                >
                  {/* Large background number */}
                  <div
                    className="absolute bottom-4 left-4 text-8xl font-black text-blue-700/20 select-none leading-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <div
                    className="text-blue-300 mb-6 group-hover:scale-110 group-hover:text-blue-200 transition-all duration-300 w-fit"
                    aria-hidden="true"
                  >
                    {iconMap[service.iconKey] ?? <TrendingUp className="w-10 h-10" />}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed flex-grow">{service.description}</p>
                  <a href={`mailto:${contact.email}`}>
                    <Button
                      variant="outline"
                      className="border-blue-500/60 text-blue-300 hover:bg-blue-900/60 hover:border-blue-400 w-full font-semibold transition-all"
                    >
                      פנו אלינו לפרטים
                    </Button>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Clients Section ──────────────────────────────────────── */}
        <motion.section
          className="py-24"
          id="clients"
          aria-labelledby="clients-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container">
            <h2 id="clients-heading" className="text-4xl md:text-5xl font-bold text-center mb-4">
              הלקוחות שלנו
            </h2>
            <p className="text-center text-slate-400 mb-14 text-lg">ארגונים מובילים שבחרו בנו</p>

            <div className="grid md:grid-cols-2 gap-6">
              {clients.map((client, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  className="relative bg-gradient-to-br from-blue-900/40 to-blue-950/50 border border-blue-800/70 rounded-2xl p-7 hover:border-blue-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 overflow-hidden"
                >
                  {/* Decorative quote mark */}
                  <div
                    className="absolute top-3 left-5 text-6xl text-blue-600/20 font-serif leading-none select-none pointer-events-none"
                    aria-hidden="true"
                  >
                    "
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white">{client.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{client.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Gallery Section ──────────────────────────────────────── */}
        <motion.section
          className="py-24 bg-gradient-to-b from-blue-950/30 to-background"
          id="gallery"
          aria-labelledby="gallery-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container">
            <div className="flex justify-center mb-8" aria-hidden="true">
              <div className="p-4 bg-blue-900/60 border border-blue-700/50 rounded-2xl shadow-lg shadow-blue-900/30">
                <Camera className="w-14 h-14 text-blue-300" />
              </div>
            </div>
            <h2 id="gallery-heading" className="text-4xl md:text-5xl font-bold text-center mb-4">
              גלריית תמונות מההרצאות
            </h2>
            <p className="text-center text-slate-400 mb-14 text-lg">רגעים מיוחדים מהרצאות שלנו</p>

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
                  className="aspect-square bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group border border-blue-700/60 hover:border-blue-500 shadow-md hover:shadow-xl hover:shadow-blue-500/20"
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
          className="py-24"
          aria-labelledby="guides-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container">
            <div className="flex justify-center mb-8" aria-hidden="true">
              <div className="p-4 bg-blue-900/60 border border-blue-700/50 rounded-2xl shadow-lg shadow-blue-900/30">
                <BookOpen className="w-14 h-14 text-blue-300" />
              </div>
            </div>
            <h2 id="guides-heading" className="text-4xl md:text-5xl font-bold text-center mb-4">
              מדריכים מקצועיים
            </h2>
            <p className="text-center text-slate-400 mb-14 text-lg">משאבים לשילוב בינה מלאכותית בעבודה היומיומית</p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Excel Guide */}
              <motion.a
                href="/guides/excel-agent-guide.pdf"
                download
                className="group"
                custom={0}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/50 border border-blue-800/70 rounded-2xl overflow-hidden hover:border-blue-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-800 to-blue-900">
                    <img
                      src="/images/excel-agent-guide.png"
                      alt="מדריך Excel Copilot Agent Mode לאוטומציה פיננסית"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">Excel Copilot Agent Mode</h3>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed flex-grow">
                      מדריך מעשי לשימוש ב-Agent Mode של Copilot ב-Excel לאוטומציה של משימות פיננסיות וניתוח נתונים
                    </p>
                    <div className="flex items-center gap-2 text-blue-300 group-hover:text-blue-200 transition-colors font-semibold">
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
                className="group"
                custom={1}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/50 border border-blue-800/70 rounded-2xl overflow-hidden hover:border-blue-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-800 to-blue-900">
                    <img
                      src="/images/chatgpt-prompts-guide.png"
                      alt="ספריית ChatGPT Prompts לאנשי פיננסים"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">ChatGPT Prompts Library</h3>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed flex-grow">
                      ספריית 20 prompts מעודכנים לתפקידים שונים בפיננסים - CFO, אודיטור, אנליסט ועוד
                    </p>
                    <div className="flex items-center gap-2 text-blue-300 group-hover:text-blue-200 transition-colors font-semibold">
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
                className="group"
                custom={2}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
              >
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-950/50 border border-blue-800/70 rounded-2xl overflow-hidden hover:border-blue-600/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-800 to-blue-900">
                    <img
                      src="/images/gemini-prompts-guide.png"
                      alt="ספריית Gemini Prompts לניתוח פיננסי"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3">Gemini Prompts Library</h3>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed flex-grow">
                      ספריית prompts מקצועיים עבור Google Gemini לניתוח פיננסי, דוחות ותכנון אסטרטגי
                    </p>
                    <div className="flex items-center gap-2 text-blue-300 group-hover:text-blue-200 transition-colors font-semibold">
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>הורד HTML</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            </div>
          </div>
        </motion.section>

        {/* ─── FAQ Section ──────────────────────────────────────────── */}
        <motion.section
          className="py-24 bg-gradient-to-b from-blue-950/30 to-background"
          id="faq"
          aria-labelledby="faq-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container max-w-3xl">
            <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold text-center mb-14">
              שאלות נפוצות
            </h2>

            <div className="space-y-4">
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
                    className="bg-gradient-to-r from-blue-900/40 to-blue-950/50 border border-blue-800/70 rounded-2xl overflow-hidden hover:border-blue-600/70 transition-all duration-300"
                  >
                    <button
                      id={buttonId}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-blue-900/40 transition-colors text-right"
                    >
                      <span className="font-semibold text-right text-base leading-snug">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-blue-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
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
                      className="px-6 py-5 bg-blue-950/60 border-t border-blue-800/60 text-slate-300 text-sm leading-relaxed"
                    >
                      {item.answer}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ─── Social Section ───────────────────────────────────────── */}
        <motion.section
          className="py-16 bg-gradient-to-b from-blue-950/20 to-background"
          aria-label="רשתות חברתיות"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="container text-center">
            <p className="text-slate-400 mb-8 text-lg">עקבו אחרינו ברשתות החברתיות</p>
            <div className="flex justify-center gap-4">
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-900/60 border border-blue-800 rounded-xl hover:bg-blue-800 hover:border-blue-600 transition-all hover:scale-110 duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                aria-label="LinkedIn - AI Finance"
              >
                <Linkedin className="w-6 h-6 text-blue-300" aria-hidden="true" />
              </a>
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-900/60 border border-blue-800 rounded-xl hover:bg-blue-800 hover:border-blue-600 transition-all hover:scale-110 duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                aria-label="Instagram - AI Finance"
              >
                <Instagram className="w-6 h-6 text-blue-300" aria-hidden="true" />
              </a>
            </div>
          </div>
        </motion.section>

        {/* ─── CTA Section ──────────────────────────────────────────── */}
        <motion.section
          className="py-28"
          aria-labelledby="cta-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="container max-w-2xl">
            <div className="text-center bg-gradient-to-br from-blue-900/30 to-blue-950/40 border border-blue-800/60 rounded-3xl p-12 shadow-2xl shadow-blue-900/20">
              <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold mb-6">
                {cta.headline}
              </h2>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {cta.subtext}
              </p>
              <a href={hero.whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-green-600 text-white px-14 py-7 text-lg font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5"
                >
                  {cta.buttonText}
                </Button>
              </a>
              <div className="mt-6">
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600/80 hover:bg-green-600 border border-green-500/40 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-green-500/30"
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
      <footer className="bg-blue-950/70 border-t border-blue-800/60 py-16">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-bold mb-4 text-lg text-white">AI Finance Community</h3>
              <p className="text-sm text-slate-400 leading-relaxed">גשר בין עולם הפיננסים לעולם הבינה המלאכותית</p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg text-white">קישורים</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#about" className="hover:text-blue-300 transition-colors">
                    על הקהילה
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-blue-300 transition-colors">
                    שירותים
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-blue-300 transition-colors">
                    שאלות נפוצות
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg text-white">צור קשר</h3>
              <p className="text-sm text-slate-400 mb-3">
                <a href={`mailto:${contact.email}`} className="hover:text-blue-300 transition-colors">
                  {contact.email}
                </a>
              </p>
              <p className="text-sm text-slate-400">
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  שלח הודעה ב-WhatsApp
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-blue-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2025 AI Finance Community. כל הזכויות שמורות.</p>
            {/* Discreet admin access */}
            <a
              href="/admin"
              className="text-slate-700 hover:text-slate-500 transition-colors text-xs"
              title="לוח בקרה"
              aria-label="לוח בקרה לניהול תוכן"
            >
              ⚙ ניהול
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
