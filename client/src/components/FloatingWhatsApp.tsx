import { useEffect, useRef, useState } from "react";
import { GraduationCap, Laptop, Presentation, UserCheck, Users, X } from "lucide-react";
import { useContent } from "@/hooks/useContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => {
  if (typeof window !== "undefined") (window as any).gtag?.(...args);
};

// Colors per content/site-copy/14-entry-animation-whatsapp-light-color-spec.md,
// part ט׳ ("כפתור WhatsApp והתפריט הצף"). Swap values here only if the spec
// changes. The floating trigger button stays WhatsApp-standard green per the
// spec's explicit call — everything else (panel, items) follows the site's
// light indigo/lavender palette.
const COLORS = {
  buttonBg: "#25D366",
  buttonHover: "#1FBE5B",
  buttonActive: "#179C49",
  buttonIcon: "#ffffff",
  focusRing: "#3D4A8A",
  panelBg: "#FFFFFF",
  panelBorder: "#E2E4F3",
  panelShadow: "rgba(27, 30, 51, 0.14)",
  panelTitle: "#1B1E33",
  itemBg: "#FFFFFF",
  itemHoverBg: "#F0F1FA",
  itemActiveBg: "#E2E5F4",
  itemText: "#1B1E33",
  itemIcon: "#3D4A8A",
  communityIcon: "#25D366",
};

interface MenuOption {
  key: string;
  label: string;
  icon: typeof Users;
  message?: string; // omitted for the "join community" option, which links straight to the group
}

// Copy per content/site-copy/14-entry-animation-whatsapp-light-color-spec.md,
// part ב׳ ("הכפתור הצף ל-WhatsApp").
const PANEL_TITLE = "איך נוכל לעזור?";

const MENU_OPTIONS: MenuOption[] = [
  {
    key: "workshop",
    label: "סדנה למחלקת כספים",
    icon: Presentation,
    message: "היי, הגעתי מאתר AI Finance. אשמח לבדוק התאמה של סדנת AI למחלקת הכספים שלנו.",
  },
  {
    key: "community",
    label: "הצטרפות לקהילה",
    icon: Users,
  },
  {
    key: "courses",
    label: "קורסים והרשמה",
    icon: GraduationCap,
    message:
      "היי, הגעתי מאתר AI Finance. אשמח לקבל פרטים על הקורסים, כולל הקורסים בשיתוף המרכז הארצי להכשרת דירקטורים.",
  },
  {
    key: "coaching",
    label: "ליווי אישי",
    icon: UserCheck,
    message: "היי, הגעתי מאתר AI Finance. אשמח להבין מה כולל הליווי האישי ולבדוק אם הוא מתאים לי.",
  },
  {
    key: "online-training",
    label: "הדרכה מקוונת",
    icon: Laptop,
    message: "היי, הגעתי מאתר AI Finance. אשמח לקבל פרטים על האפשרויות להדרכה מקוונת.",
  },
];

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  );
}

export default function FloatingWhatsApp() {
  const { content } = useContent();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  if (!content) return null;

  function hrefFor(option: MenuOption) {
    if (!option.message) return content!.hero.whatsappUrl;
    return `${content!.contact.whatsappUrl}?text=${encodeURIComponent(option.message)}`;
  }

  function handleOptionClick(option: MenuOption) {
    gtag("event", "whatsapp_floating_click", { option: option.key });
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-40" dir="rtl">
      {open && (
        <div
          role="menu"
          aria-label={PANEL_TITLE}
          className="absolute bottom-16 right-0 w-72 rounded-2xl border overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            background: COLORS.panelBg,
            borderColor: COLORS.panelBorder,
            boxShadow: `0 16px 40px ${COLORS.panelShadow}`,
          }}
        >
          <div
            className="px-4 py-3 text-sm font-bold border-b"
            style={{ color: COLORS.panelTitle, borderColor: COLORS.panelBorder }}
          >
            {PANEL_TITLE}
          </div>
          {MENU_OPTIONS.map((option) => {
            const Icon = option.icon;
            const iconColor = option.key === "community" ? COLORS.communityIcon : COLORS.itemIcon;
            return (
              <a
                key={option.key}
                role="menuitem"
                href={hrefFor(option)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOptionClick(option)}
                className="aif-whatsapp-item flex items-center gap-3 px-4 py-3 text-sm border-b last:border-b-0"
                style={{ background: COLORS.itemBg, color: COLORS.itemText, borderColor: COLORS.panelBorder }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} aria-hidden="true" />
                {option.label}
              </a>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "סגור תפריט וואטסאפ" : "פתח תפריט יצירת קשר בוואטסאפ"}
        aria-expanded={open}
        className="aif-whatsapp-btn w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: COLORS.buttonBg, color: COLORS.buttonIcon }}
      >
        {open ? <X className="w-6 h-6" /> : <WhatsAppGlyph className="w-7 h-7" />}
      </button>

      <style>{`
        .aif-whatsapp-btn { animation: aifWhatsappPulse 3.5s ease-in-out infinite; }
        .aif-whatsapp-btn:hover { background: ${COLORS.buttonHover} !important; }
        .aif-whatsapp-btn:active { background: ${COLORS.buttonActive} !important; }
        .aif-whatsapp-btn:focus-visible { outline: 2px solid ${COLORS.focusRing}; outline-offset: 2px; }
        @keyframes aifWhatsappPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aif-whatsapp-btn { animation: none; }
        }
        .aif-whatsapp-item:hover { background: ${COLORS.itemHoverBg} !important; }
        .aif-whatsapp-item:active { background: ${COLORS.itemActiveBg} !important; }
        .aif-whatsapp-item:focus-visible { outline: 2px solid ${COLORS.focusRing}; outline-offset: -2px; }
      `}</style>
    </div>
  );
}
