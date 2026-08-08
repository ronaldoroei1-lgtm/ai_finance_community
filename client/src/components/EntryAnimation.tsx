import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "aif_entry_animation_seen";

// Colors per content/site-copy/14-entry-animation-whatsapp-light-color-spec.md,
// part ג׳ section 3 ("אנימציית האקסל והדשבורד") + relevant base tokens from
// section 1. Swap values here only if the spec changes.
const COLORS = {
  overlayBg: "linear-gradient(135deg, #F7F7FD 0%, #F1F2FA 52%, #E9EAF8 100%)",
  logoText: "#1B1E33",
  logoAccent: "#3D4A8A",
  caption: "#4B5170",
  headline: "#1B1E33",
  cardBg: "#FFFFFF",
  cardBorder: "#E2E4F3",
  cardShadow: "rgba(27, 30, 51, 0.08)",
  cardTitle: "#1B1E33",
  axisLine: "#E2E4F3",
  barPrimary: "#3D4A8A",
  barSecondary: "#6876BC",
  barTertiary: "#A9B0DD",
  lineStroke: "#6B5FB5",
  lineDotFill: "#FFFFFF",
  lineDotActiveFill: "#6B5FB5",
  donutSegments: ["#3D4A8A", "#7481C4", "#C7CBE9"],
  skipBg: "#EEF0FA",
  skipBorder: "#C9CDE4",
  skipText: "#303A72",
  focusRing: "#6674BC",
};

// Copy per content/site-copy/14-entry-animation-whatsapp-light-color-spec.md,
// part א׳ ("נוסח סופי מומלץ להטמעה"). The two caption lines are one sentence
// split across the animation's two stages — first line while the raw report
// is on screen, second line once the dashboard cards start revealing.
const TEXTS = {
  logoPrefix: "AI ",
  logoAccent: "Finance",
  captionExcelStage: "נתונים מפוזרים בין שורות, גיליונות וקבצים...",
  captionDashboardReady: "הופכים לתמונה ברורה שאפשר לעבוד איתה.",
  headline: "AI מעשי למחלקות כספים",
  skipLabel: "דלג",
  imageAlt: "דוגמה לדוח רווח והפסד (נתוני דוגמה בלבד)",
};

const IMAGE_SRC = "/images/entry-animation-pnl-sample.png";

// Timeline in ms from mount, ported from the approved v4 mockup's frame-based
// timing (assumed 60fps: 150 frames = 2500ms, 18-frame stagger = 300ms,
// 55-frame card reveal = 900ms), converted to real elapsed-time so it stays
// correct regardless of the browser's actual frame rate.
const LOGO_DELAY = 100;
const IMAGE_IN_DELAY = 300;
const IMAGE_OUT_START = 2400;
const IMAGE_OUT_DURATION = 600;
const CARD_START = 2500;
const CARD_STAGGER = 300;
const CARD_DURATION = 900;
// Caption 2 hands off right after caption 1 finishes fading out (both share
// the same on-screen position, so they must never be visible at once).
const CAPTION_2_DELAY = IMAGE_OUT_START + IMAGE_OUT_DURATION;
const HEADLINE_DELAY = 3400;
const HOLD_AFTER_HEADLINE = 1200;
const EXIT_DELAY = HEADLINE_DELAY + 800 + HOLD_AFTER_HEADLINE; // ~5400ms
const EXIT_DURATION = 600;

const BAR_VALUES = [0.55, 0.68, 0.62, 0.8, 0.9, 1.0];
const LINE_VALUES = [0.3, 0.42, 0.38, 0.55, 0.6, 0.78, 0.72, 0.88];
// ~50/30/20 composition per the spec ("אחוזי הדונאט הם קומפוזיציה בלבד").
const DONUT_SEGMENTS = [0.5, 0.3, 0.2];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function barColor(index: number, total: number) {
  if (index === total - 1) return COLORS.barPrimary;
  if (index === total - 2) return COLORS.barSecondary;
  return COLORS.barTertiary;
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface Card {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
}

function drawCardShell(ctx: CanvasRenderingContext2D, card: Card, revealT: number) {
  ctx.save();
  ctx.globalAlpha = revealT;
  const rise = (1 - revealT) * 14;
  ctx.translate(0, rise);

  ctx.save();
  ctx.shadowColor = COLORS.cardShadow;
  ctx.shadowBlur = 32;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = COLORS.cardBg;
  drawRoundRect(ctx, card.x, card.y, card.w, card.h, 12);
  ctx.fill();
  ctx.restore(); // drop the shadow before drawing the border/text

  ctx.strokeStyle = COLORS.cardBorder;
  ctx.lineWidth = 1;
  drawRoundRect(ctx, card.x, card.y, card.w, card.h, 12);
  ctx.stroke();
  ctx.fillStyle = COLORS.cardTitle;
  ctx.font = "600 11px Segoe UI, Arial";
  ctx.textAlign = "left";
  ctx.fillText(card.title, card.x + 14, card.y + 22);
  ctx.restore();
}

type Stage = "playing" | "exiting" | "done";

export default function EntryAnimation() {
  const [shouldRender, setShouldRender] = useState(false);
  const [stage, setStageState] = useState<Stage>("playing");
  const stageRef = useRef<Stage>("playing");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  function setStage(next: Stage) {
    stageRef.current = next;
    setStageState(next);
  }

  const finish = () => {
    if (stageRef.current !== "playing") return;
    setStage("exiting");
    window.setTimeout(() => setStage("done"), EXIT_DURATION);
  };

  // Gate: session-once + prefers-reduced-motion. Runs exactly once on mount.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadySeen = sessionStorage.getItem(STORAGE_KEY) === "1";
    if (reduced || alreadySeen) {
      setShouldRender(false);
      return;
    }
    sessionStorage.setItem(STORAGE_KEY, "1");
    setShouldRender(true);
  }, []);

  // Auto-dismiss timer.
  useEffect(() => {
    if (!shouldRender) return;
    const timer = window.setTimeout(finish, EXIT_DELAY);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender]);

  // Canvas dashboard-card draw loop.
  useEffect(() => {
    if (!shouldRender || stage === "done") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw(now: number) {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const W = canvas!.width;
      const H = canvas!.height;
      ctx!.clearRect(0, 0, W, H);

      const cardGap = 24;
      const cardW = Math.min(230, W * 0.26);
      const cardH = 190;
      const totalW = cardW * 3 + cardGap * 2;
      const startX = W / 2 - totalW / 2;
      const cardY = H * 0.56;

      const barCard: Card = { x: startX, y: cardY, w: cardW, h: cardH, title: "Revenue vs Budget" };
      const lineCard: Card = {
        x: startX + cardW + cardGap,
        y: cardY,
        w: cardW,
        h: cardH,
        title: "Margin trend",
      };
      const donutCard: Card = {
        x: startX + (cardW + cardGap) * 2,
        y: cardY,
        w: cardW,
        h: cardH,
        title: "Cost breakdown",
      };

      const barT = Math.max(0, Math.min(1, (elapsed - CARD_START) / CARD_DURATION));
      const lineT = Math.max(
        0,
        Math.min(1, (elapsed - (CARD_START + CARD_STAGGER)) / CARD_DURATION)
      );
      const donutT = Math.max(
        0,
        Math.min(1, (elapsed - (CARD_START + CARD_STAGGER * 2)) / CARD_DURATION)
      );

      if (barT > 0) drawCardShell(ctx!, barCard, Math.min(1, barT * 2));
      if (lineT > 0) drawCardShell(ctx!, lineCard, Math.min(1, lineT * 2));
      if (donutT > 0) drawCardShell(ctx!, donutCard, Math.min(1, donutT * 2));

      if (barT > 0) {
        const padX = 18,
          padTop = 36,
          padBottom = 16;
        const plotW = barCard.w - padX * 2;
        const plotH = barCard.h - padTop - padBottom;
        const n = BAR_VALUES.length;
        const bw = (plotW / n) * 0.55;
        const gap = plotW / n;
        const e = easeOutCubic(Math.min(1, barT * 1.15));
        BAR_VALUES.forEach((v, i) => {
          const h = v * plotH * e;
          const x = barCard.x + padX + i * gap + (gap - bw) / 2;
          const y = barCard.y + padTop + plotH - h;
          ctx!.fillStyle = barColor(i, n);
          drawRoundRect(ctx!, x, y, bw, h, 3);
          ctx!.fill();
        });
        ctx!.strokeStyle = COLORS.axisLine;
        ctx!.beginPath();
        ctx!.moveTo(barCard.x + padX, barCard.y + padTop + plotH);
        ctx!.lineTo(barCard.x + barCard.w - padX, barCard.y + padTop + plotH);
        ctx!.stroke();
      }

      if (lineT > 0) {
        const padX = 18,
          padTop = 36,
          padBottom = 16;
        const plotW = lineCard.w - padX * 2;
        const plotH = lineCard.h - padTop - padBottom;
        const n = LINE_VALUES.length;
        const e = easeInOutQuad(Math.min(1, lineT));
        const visibleCount = Math.max(1, Math.ceil(n * e));
        ctx!.strokeStyle = COLORS.lineStroke;
        ctx!.lineWidth = 2;
        ctx!.beginPath();
        for (let i = 0; i < visibleCount; i++) {
          const x = lineCard.x + padX + (plotW / (n - 1)) * i;
          const y = lineCard.y + padTop + plotH - LINE_VALUES[i] * plotH;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
        for (let i = 0; i < visibleCount; i++) {
          const x = lineCard.x + padX + (plotW / (n - 1)) * i;
          const y = lineCard.y + padTop + plotH - LINE_VALUES[i] * plotH;
          const isActive = i === visibleCount - 1;
          ctx!.beginPath();
          ctx!.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = isActive ? COLORS.lineDotActiveFill : COLORS.lineDotFill;
          ctx!.fill();
          ctx!.lineWidth = 2;
          ctx!.strokeStyle = COLORS.lineStroke;
          ctx!.stroke();
        }
        ctx!.strokeStyle = COLORS.axisLine;
        ctx!.beginPath();
        ctx!.moveTo(lineCard.x + padX, lineCard.y + padTop + plotH);
        ctx!.lineTo(lineCard.x + lineCard.w - padX, lineCard.y + padTop + plotH);
        ctx!.stroke();
      }

      if (donutT > 0) {
        const cx = donutCard.x + donutCard.w / 2;
        const cy = donutCard.y + 36 + (donutCard.h - 36) / 2;
        const r = Math.min(donutCard.w, donutCard.h - 36) * 0.28;
        const e = easeInOutQuad(Math.min(1, donutT));
        let startAngle = -Math.PI / 2;
        DONUT_SEGMENTS.forEach((frac, i) => {
          const segAngle = frac * Math.PI * 2 * e;
          ctx!.beginPath();
          ctx!.arc(cx, cy, r, startAngle, startAngle + segAngle);
          ctx!.strokeStyle = COLORS.donutSegments[i];
          ctx!.lineWidth = 12;
          ctx!.lineCap = "butt";
          ctx!.stroke();
          startAngle += frac * Math.PI * 2;
        });
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [shouldRender, stage]);

  if (!shouldRender || stage === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{
        background: COLORS.overlayBg,
        opacity: stage === "exiting" ? 0 : 1,
        transition: `opacity ${EXIT_DURATION}ms ease-out`,
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <img
        src={IMAGE_SRC}
        alt={TEXTS.imageAlt}
        fetchPriority="low"
        className="entry-anim-image absolute left-1/2 top-[38%] rounded-lg shadow-2xl"
        style={{ width: "min(520px, 58vw)", transform: "translate(-50%, -50%)" }}
      />

      <div className="absolute top-[7%] left-1/2 -translate-x-1/2 w-[90%] text-center">
        <div
          className="entry-anim-logo text-2xl font-extrabold tracking-wide"
          style={{ color: COLORS.logoText }}
        >
          {TEXTS.logoPrefix}
          <span style={{ color: COLORS.logoAccent }}>{TEXTS.logoAccent}</span>
        </div>
      </div>

      {/* Two-stage caption: one sentence split across the raw-report and
          dashboard-ready moments of the animation. */}
      <div
        className="entry-anim-caption-1 absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[90%] text-center text-sm font-semibold"
        style={{ color: COLORS.caption }}
      >
        {TEXTS.captionExcelStage}
      </div>
      <div
        className="entry-anim-caption-2 absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[90%] text-center text-sm font-semibold"
        style={{ color: COLORS.caption }}
      >
        {TEXTS.captionDashboardReady}
      </div>

      <div
        className="entry-anim-headline absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[90%] text-center text-xl font-bold"
        style={{ color: COLORS.headline }}
      >
        {TEXTS.headline}
      </div>

      <button
        type="button"
        onClick={finish}
        aria-label={TEXTS.skipLabel}
        className="entry-anim-skip absolute bottom-5 left-1/2 -translate-x-1/2 z-20 rounded-full px-4 py-1.5 text-xs"
        style={{
          background: COLORS.skipBg,
          border: `1px solid ${COLORS.skipBorder}`,
          color: COLORS.skipText,
        }}
      >
        {TEXTS.skipLabel}
      </button>

      <style>{`
        .entry-anim-image { opacity: 0; animation: entryAnimImgIn 0.7s ease forwards ${IMAGE_IN_DELAY}ms, entryAnimImgOut ${IMAGE_OUT_DURATION}ms ease forwards ${IMAGE_OUT_START}ms; }
        @keyframes entryAnimImgIn { to { opacity: 1; } }
        @keyframes entryAnimImgOut { to { opacity: 0; transform: translate(-50%,-50%) scale(0.94); } }
        .entry-anim-logo { opacity: 0; animation: entryAnimFadeIn 0.7s ease forwards ${LOGO_DELAY}ms; }
        .entry-anim-caption-1 { opacity: 0; animation: entryAnimFadeIn 0.7s ease forwards ${IMAGE_IN_DELAY}ms, entryAnimFadeOut ${IMAGE_OUT_DURATION}ms ease forwards ${IMAGE_OUT_START}ms; }
        .entry-anim-caption-2 { opacity: 0; animation: entryAnimFadeIn 0.8s ease forwards ${CAPTION_2_DELAY}ms; }
        .entry-anim-headline { opacity: 0; animation: entryAnimFadeIn 0.8s ease forwards ${HEADLINE_DELAY}ms; }
        @keyframes entryAnimFadeIn { to { opacity: 1; } }
        @keyframes entryAnimFadeOut { to { opacity: 0; } }
        .entry-anim-skip:focus-visible { outline: 2px solid ${COLORS.focusRing}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .entry-anim-image, .entry-anim-logo, .entry-anim-caption-1, .entry-anim-caption-2, .entry-anim-headline { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
