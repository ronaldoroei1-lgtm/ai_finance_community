import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ChevronDown,
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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Lightbox from "@/components/Lightbox";
import { useContent } from "@/hooks/useContent";
import { posts as blogPosts, authors as blogAuthors, categories as blogCategories } from "@/generated/blog";
import ArticleCard from "@/components/blog/ArticleCard";

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
    <div className="min-h-screen bg-background text-foreground overflow-hidden">

      {/* ─── Navigation ───────────────────────────────────────────── */}
      <nav
        className="fixed top-0 right-0 left-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/[0.06]"
        aria-label="ניווט ראשי"
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            className="text-xl font-bold text-white hover:text-blue-200 transition-colors duration-200"
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
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 right-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop CTA + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <a
              href={hero.businessWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/25"
            >
              דברו איתנו בוואטסאפ
            </a>
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

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/98 border-b border-white/[0.06] py-4"
          >
            <div className="container flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-300 hover:text-white transition-colors duration-200 py-3 border-b border-white/[0.05] last:border-0 font-medium text-base"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={hero.businessWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-all duration-200"
              >
                דברו איתנו בוואטסאפ
              </a>
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
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/6 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/4 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          {/* Floating particles */}
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-400 rounded-full particle opacity-50" aria-hidden="true" />
          <div className="absolute top-40 right-40 w-1 h-1 bg-blue-300 rounded-full particle opacity-40" style={{ animationDelay: "1s" }} aria-hidden="true" />
          <div className="absolute top-60 right-60 w-1.5 h-1.5 bg-blue-500 rounded-full particle opacity-50" style={{ animationDelay: "2s" }} aria-hidden="true" />
          <div className="absolute bottom-40 right-32 w-1 h-1 bg-blue-400 rounded-full particle opacity-40" style={{ animationDelay: "3s" }} aria-hidden="true" />
          <div className="absolute top-32 left-20 w-1 h-1 bg-blue-300 rounded-full particle opacity-35" style={{ animationDelay: "1.5s" }} aria-hidden="true" />

          <div className="container relative z-10">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Community size badge — visible & meaningful content */}
              <motion.div
                className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-10 bg-blue-950/70 border border-blue-700/40 rounded-full text-sm text-blue-300 font-medium"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                מאחורינו קהילה של 1,800+ אנשי כספים
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight gradient-heading">
                {hero.headline}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
                {hero.subtext}
                <br />
                <span className="text-blue-400 font-medium mt-2 block">{hero.subtagline}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a href={hero.businessWhatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-6 text-base font-semibold rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                  >
                    דברו איתנו בוואטסאפ
                  </Button>
                </a>
                <a href={hero.whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-white/15 text-white bg-white/5 hover:bg-white/10 hover:border-white/25 px-10 py-6 text-base font-semibold rounded-xl transition-all duration-200"
                  >
                    הצטרפו לקהילה
                  </Button>
                </a>
              </div>

              <div className="flex justify-center gap-3">
                <a
                  href={hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-900/50 hover:border-blue-500/40 transition-all duration-200 hover:scale-110"
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
          className="py-28 relative"
          id="about"
          aria-labelledby="about-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Subtle top divider gradient */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />

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
              <p className="text-lg text-slate-300 leading-relaxed text-justify">
                {about.text}
              </p>
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
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />

          {/* Section bg tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent pointer-events-none" aria-hidden="true" />

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
              <p className="text-slate-400 text-lg">הצוות שמאחורי הקהילה</p>
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
                  className="relative bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group overflow-hidden"
                >
                  {/* Decorative top-right glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-full pointer-events-none"
                    aria-hidden="true"
                  />

                  <div className="w-24 h-24 rounded-full mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 overflow-hidden border-2 border-white/10 shadow-xl shadow-blue-900/40 ring-2 ring-blue-500/20">
                    <img
                      src={member.image}
                      alt={`תמונת פרופיל של ${member.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-1.5">{member.name}</h3>
                  <p className="text-sm text-blue-400 text-center mb-5 font-semibold leading-snug">{member.title}</p>
                  <p className="text-slate-300 text-sm mb-6 text-justify leading-relaxed">{member.bio}</p>

                  <ul className="space-y-2.5" aria-label={`תחומי התמחות של ${member.name}`}>
                    {member.expertise.map((exp, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-3">
                        <span className="text-blue-500 font-bold mt-0.5 flex-shrink-0" aria-hidden="true">▸</span>
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
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />

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
              <p className="text-slate-400 text-lg">סדנאות, הרצאות וליווי למחלקות כספים</p>
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
                  className="relative bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 group overflow-hidden flex flex-col"
                >
                  {/* Large background number */}
                  <div
                    className="absolute bottom-4 left-4 text-8xl font-black text-blue-800/15 select-none leading-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  <div
                    className="text-blue-400 mb-6 group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300 w-fit"
                    aria-hidden="true"
                  >
                    {iconMap[service.iconKey] ?? <TrendingUp className="w-10 h-10" />}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed flex-grow">{service.description}</p>
                  <a href={hero.businessWhatsappUrl} target="_blank" rel="noopener noreferrer">
                    <Button
                      variant="outline"
                      className="border border-blue-500/30 text-blue-300 bg-blue-900/20 hover:bg-blue-900/50 hover:border-blue-400/60 w-full font-semibold transition-all duration-200"
                    >
                      דברו איתנו לפרטים
                    </Button>
                  </a>
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
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent pointer-events-none" aria-hidden="true" />

          <div className="container relative z-10">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-5">
                <span className="section-label">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  אמון וניסיון
                </span>
              </div>
              <h2 id="clients-heading" className="text-4xl md:text-5xl font-bold mb-3 gradient-heading">
                הלקוחות שלנו
              </h2>
              <p className="text-slate-400 text-lg">ארגונים מובילים שבחרו בנו</p>
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
                  className="relative bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl p-7 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden"
                >
                  {/* Decorative quote mark */}
                  <div
                    className="absolute top-3 left-5 text-6xl text-blue-500/15 font-serif leading-none select-none pointer-events-none"
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
          className="py-28 relative"
          id="gallery"
          aria-labelledby="gallery-heading"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />

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
              <p className="text-slate-400 text-lg">רגעים מיוחדים מהרצאות שלנו</p>
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
                  className="aspect-square bg-gradient-to-br from-blue-900/30 to-blue-950/50 rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-300 cursor-pointer group border border-white/[0.06] hover:border-blue-500/30 shadow-md hover:shadow-2xl hover:shadow-blue-500/15"
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
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-transparent pointer-events-none" aria-hidden="true" />

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
              <p className="text-slate-400 text-lg">משאבים לשילוב בינה מלאכותית בעבודה היומיומית</p>
            </div>

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
                <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#0a1420]">
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
                    <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-200 font-semibold">
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
                <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#0a1420]">
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
                    <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-200 font-semibold">
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
                <div className="bg-gradient-to-br from-[#0f1c35] to-[#0a1220] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col group-hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#0a1420]">
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
                    <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-200 font-semibold">
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>הורד HTML</span>
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
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />

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
                  className="text-sm font-semibold text-blue-300 hover:text-blue-200 transition-colors duration-200"
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
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />

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
                    className={`bg-gradient-to-r from-[#0f1c35] to-[#0a1220] border rounded-xl overflow-hidden transition-all duration-300 ${
                      isExpanded
                        ? "border-blue-500/40 shadow-lg shadow-blue-500/8"
                        : "border-white/[0.07] hover:border-white/15"
                    }`}
                  >
                    <button
                      id={buttonId}
                      aria-expanded={isExpanded}
                      aria-controls={panelId}
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200 text-right"
                    >
                      <span className="font-semibold text-right text-base leading-snug text-white">{item.question}</span>
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
                      className="px-6 py-5 bg-black/20 border-t border-white/[0.06] text-slate-300 text-sm leading-relaxed"
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
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" aria-hidden="true" />

          {/* Ambient glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="container max-w-2xl relative z-10">
            <div className="text-center bg-gradient-to-br from-[#0f1c35]/80 to-[#0a1220]/80 backdrop-blur-sm border border-white/[0.08] rounded-3xl p-12 shadow-2xl shadow-blue-900/20">
              <div className="flex justify-center mb-6">
                <span className="section-label">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  מוכנים להתחיל?
                </span>
              </div>
              <h2 id="cta-heading" className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
                {cta.headline}
              </h2>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                {cta.subtext}
              </p>
              <a href={hero.businessWhatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-14 py-7 text-lg font-semibold rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-emerald-500/35 hover:-translate-y-0.5"
                >
                  {cta.buttonText}
                </Button>
              </a>
              <div className="mt-5">
                <a
                  href={hero.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700/60 hover:bg-emerald-600/80 border border-emerald-500/30 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20"
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
      <footer className="border-t border-white/[0.06] bg-[#060c18] py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="font-bold mb-3 text-lg text-white">AI Finance Community</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                AI מעשי למחלקות כספים — סדנאות, הרצאות וליווי, מאחורינו קהילה של מעל 1,800 אנשי כספים ישראלים.
              </p>
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
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-pink-900/30 hover:border-pink-500/30 transition-all duration-200 hover:scale-105"
                  aria-label="Instagram - AI Finance"
                >
                  <Instagram className="w-4 h-4 text-blue-300" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm text-white uppercase tracking-wider">ניווט</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><a href="#about" className="hover:text-blue-300 transition-colors duration-200">על הקהילה</a></li>
                <li><a href="#team" className="hover:text-blue-300 transition-colors duration-200">הצוות</a></li>
                <li><a href="#services" className="hover:text-blue-300 transition-colors duration-200">שירותים</a></li>
                <li><a href="/services/ai-workshops-for-finance/" className="hover:text-blue-300 transition-colors duration-200">קורסים</a></li>
                <li><a href="#guides" className="hover:text-blue-300 transition-colors duration-200">מדריכים</a></li>
                <li><a href="/blog/" className="hover:text-blue-300 transition-colors duration-200">בלוג</a></li>
                <li><a href="#faq" className="hover:text-blue-300 transition-colors duration-200">שאלות נפוצות</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-sm text-white uppercase tracking-wider">צור קשר</h3>
              <ul className="space-y-2.5 text-sm text-slate-400">
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
                    className="hover:text-emerald-400 transition-colors duration-200 inline-flex items-center gap-2"
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

          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">© 2025 AI Finance Community. כל הזכויות שמורות.</p>
            {/* Discreet admin access */}
            <a
              href="/admin"
              className="text-slate-800 hover:text-slate-600 transition-colors duration-200 text-xs"
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
