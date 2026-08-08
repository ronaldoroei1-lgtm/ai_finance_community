# Entry Animation + Floating WhatsApp Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two independent, self-contained React features for the marketing site: (1) a one-time homepage entry animation ("P&L report turns into a dashboard") ported from the approved `mockup-entry-animation-v4.html`, and (2) a floating WhatsApp button with a 5-option contact menu, present on every page.

**Architecture:** Both features are standalone components with zero shared state: `client/src/components/EntryAnimation.tsx` (canvas + CSS keyframes, no external deps, mounted once in `Home.tsx`) and `client/src/components/FloatingWhatsApp.tsx` (DOM/CSS popover menu, mounted once in `App.tsx` outside the router `<Switch>`). Neither component talks to the other. Colors and copy are isolated into single `COLORS`/`TEXTS`/`MENU_OPTIONS` constant objects per file so Codex's final color spec and copy can be dropped in with a single, localized edit.

**Tech Stack:** React 19 + TypeScript, Tailwind v4 utility classes for layout, a scoped inline `<style>` block per component for keyframe animations (no new npm dependencies), native `<canvas>` 2D context for the dashboard-card animation (ported from the mockup), `lucide-react` for menu icons (already a dependency), `useContent()` hook for WhatsApp URLs from `content.json`.

## Global Constraints

- Two separate git commits: one for the entry animation, one for the floating WhatsApp button. Do not mix files between commits.
- Run `npm run check` (tsc --noEmit) and `npm run build` before each commit; both must pass with no new errors.
- Do not decide final colors. Every color value lives in a single `COLORS` constant object per component, ported verbatim from the placeholder values already in the approved mockups (`mockup-entry-animation-v4.html` for the animation, WhatsApp-standard `#25D366` green for the button per `prompt-terminal-whatsapp-floating-button.md`). Leave a one-line comment above each `COLORS`/copy constant noting it's a placeholder pending Codex's spec.
- Do not decide final copy. All Hebrew/English strings live in a single `TEXTS` (animation) or `MENU_OPTIONS[].label`/`.message` (WhatsApp) constant block per component, using exactly the placeholder wording already given in the source prompts.
- Do not touch the global color theme, `tailwind.config`/`index.css` design tokens, or any other page's existing look. Both features must render correctly using the site's current dark navy/blue brand colors.
- Entry animation must: run only once per `sessionStorage` (not per page refresh/nav), respect `prefers-reduced-motion` (skip entirely, every session), never gate/delay the real hero content's own render path, be dismissible via a visible skip button, and add no new npm dependency.
- Floating WhatsApp button must appear on every route (mounted outside `<Switch>` in `App.tsx`), track `whatsapp_floating_click` via the existing `gtag` helper pattern, support Escape-to-close and click-outside-to-close, and not remove/replace any existing per-page WhatsApp buttons/links.
- Do not push. Commits are local only; another Claude session reviews the diff before push.

---

## File Structure

- `client/public/images/entry-animation-pnl-sample.png` — **create.** Copy of the approved placeholder P&L sample image (`pnl-sample-en.png`), already labeled "Sample Data" / "For illustration purposes only" inside the image itself.
- `client/src/components/EntryAnimation.tsx` — **create.** Self-contained overlay component: session/reduced-motion gating, canvas-based dashboard-card reveal (ported from mockup v4), CSS-keyframed image/text fades, skip button, auto-dismiss timer.
- `client/src/pages/Home.tsx` — **modify.** Mount `<EntryAnimation />` as a sibling (not a wrapper) of the existing loading-spinner and main-content return blocks, so it never blocks or waits on `useContent()`.
- `client/src/components/FloatingWhatsApp.tsx` — **create.** Fixed bottom-right button + popover menu with 5 options, reading `hero.businessWhatsappUrl` / `hero.whatsappUrl` / `contact.whatsappUrl` from `useContent()`.
- `client/src/App.tsx` — **modify.** Import and mount `<FloatingWhatsApp />` once, as a sibling of `<Router />`, so it appears on every route.

---

## Task 1: Entry Animation

**Files:**
- Create: `client/public/images/entry-animation-pnl-sample.png`
- Create: `client/src/components/EntryAnimation.tsx`
- Modify: `client/src/pages/Home.tsx:86-96` (loading-spinner early return) and `client/src/pages/Home.tsx:98` (main return) — wrap each in a `<>...<EntryAnimation />...</>` fragment, same position in both, so React preserves the component's mounted state across the loading→loaded transition instead of remounting it.

**Interfaces:**
- Produces: `export default function EntryAnimation(): JSX.Element | null` — no props, no exports other than the default. Reads nothing from `content.json` or any other component.

- [ ] **Step 1: Copy the placeholder image asset**

```bash
cp "/Users/mymac/Library/Application Support/Claude/local-agent-mode-sessions/6270a45a-4bf4-48ac-aef9-3ba12633de13/6d03e5bb-16e9-44f4-abf6-8165bbc68f5b/local_c9d28e10-066a-4d3e-a401-d308d2baf1c1/outputs/pnl-sample-en.png" \
  "client/public/images/entry-animation-pnl-sample.png"
```

Expected: file exists at `client/public/images/entry-animation-pnl-sample.png`, 1290×655 PNG, containing the visible "Sample Data" / "For illustration purposes only" labels.

- [ ] **Step 2: Create `client/src/components/EntryAnimation.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "aif_entry_animation_seen";

// Placeholder colors, ported from the approved mockup-entry-animation-v4.html —
// pending Codex's final color spec. Swap values here only.
const COLORS = {
  overlayBg: "radial-gradient(ellipse at center, #0a1a3d 0%, #04102e 55%, #061640 100%)",
  logoText: "#ffffff",
  logoAccent: "#2E8BFF",
  caption: "#FFC24D",
  headline: "#ffffff",
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.10)",
  cardTitle: "rgba(174,191,224,0.85)",
  axisLine: "rgba(174,191,224,0.2)",
  barNormal: "rgba(46,139,255,0.75)",
  barHighlight: "rgba(255,194,77,0.95)",
  lineStroke: "rgba(93,211,165,0.9)",
  lineDot: "rgba(93,211,165,1)",
  donutSegments: ["#2E8BFF", "#FFC24D", "#5DD3A5"],
  skipBg: "rgba(255,255,255,0.08)",
  skipBorder: "rgba(255,255,255,0.2)",
  skipText: "#aebfe0",
};

// Placeholder copy, ported from the approved mockup — pending Codex's final wording.
const TEXTS = {
  logoPrefix: "AI ",
  logoAccent: "Finance",
  caption: "מדוח סטטי ללוח מחוונים חי — באמצעות AI",
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
const CAPTION_DELAY = 3000;
const HEADLINE_DELAY = 3400;
const HOLD_AFTER_HEADLINE = 1200;
const EXIT_DELAY = HEADLINE_DELAY + 800 + HOLD_AFTER_HEADLINE; // ~5400ms
const EXIT_DURATION = 600;

const BAR_VALUES = [0.55, 0.68, 0.62, 0.8, 0.9, 1.0];
const LINE_VALUES = [0.3, 0.42, 0.38, 0.55, 0.6, 0.78, 0.72, 0.88];
const DONUT_SEGMENTS = [0.42, 0.31, 0.27];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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
  ctx.fillStyle = COLORS.cardBg;
  drawRoundRect(ctx, card.x, card.y, card.w, card.h, 12);
  ctx.fill();
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
          ctx!.fillStyle = i === n - 1 ? COLORS.barHighlight : COLORS.barNormal;
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
          ctx!.beginPath();
          ctx!.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx!.fillStyle = COLORS.lineDot;
          ctx!.fill();
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

      <div
        className="entry-anim-caption absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[90%] text-center text-sm font-semibold"
        style={{ color: COLORS.caption }}
      >
        {TEXTS.caption}
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
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 rounded-full px-4 py-1.5 text-xs"
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
        .entry-anim-caption { opacity: 0; animation: entryAnimFadeIn 0.8s ease forwards ${CAPTION_DELAY}ms; }
        .entry-anim-headline { opacity: 0; animation: entryAnimFadeIn 0.8s ease forwards ${HEADLINE_DELAY}ms; }
        @keyframes entryAnimFadeIn { to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .entry-anim-image, .entry-anim-logo, .entry-anim-caption, .entry-anim-headline { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
```

Design notes for the implementer:
- `stageRef` (not just `useState`) guards `finish()` against double-firing from a stale closure: the auto-dismiss `setTimeout` captures whichever `finish` existed when the timer was scheduled (at mount), but `finish` reads `stageRef.current` at *call time*, not at closure-creation time, so a user clicking "skip" early and the auto-timer firing later can never both trigger the exit sequence.
- The `<img>` and the whole overlay are truly unmounted (`return null`) once `stage === "done"`, not just hidden with CSS — this matters because Chrome's Largest Contentful Paint algorithm excludes elements that have been removed from the DOM before the page's first interaction, which is what keeps this large splash image from being reported as the page's LCP element.
- The mount-gate effect and the auto-dismiss effect are separate from the canvas-draw effect so that a resize mid-animation doesn't restart the timeline, and so cleanup (`cancelAnimationFrame`, `removeEventListener`) always runs.

- [ ] **Step 3: Mount `EntryAnimation` in `Home.tsx` without gating it on content load**

In `client/src/pages/Home.tsx`, add the import near the other component imports:

```tsx
import EntryAnimation from "@/components/EntryAnimation";
```

Then wrap the loading-spinner early return (currently `client/src/pages/Home.tsx:86-96`) so `EntryAnimation` is the first child in a fragment:

```tsx
  if (loading || !content) {
    return (
      <>
        <EntryAnimation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-blue-300 text-lg">טוען...</p>
          </div>
        </div>
      </>
    );
  }
```

And wrap the main return (currently starting at `client/src/pages/Home.tsx:98`) the same way, with `EntryAnimation` in the same first-child position, so React reuses the same component instance across the loading→loaded transition instead of unmounting/remounting it (which would restart the animation's timers):

```tsx
  return (
    <>
      <EntryAnimation />
      <div className="min-h-screen bg-background text-foreground overflow-hidden">
        {/* ...existing content, unchanged... */}
      </div>
    </>
  );
```

Do not change anything else in `Home.tsx` — the entry animation must not depend on `hero`, `content`, or any fetched data.

- [ ] **Step 4: Typecheck and build**

Run: `npm run check`
Expected: no TypeScript errors.

Run: `npm run build`
Expected: build succeeds, no new warnings about `EntryAnimation.tsx` or `Home.tsx`.

- [ ] **Step 5: Visual verification (desktop + mobile, both interaction paths)**

Use a headless-browser check (Playwright, as used earlier in this session) against `npm run preview` (the production build) to confirm, at both a desktop (1280px) and mobile (390px) viewport:
1. On first load of a fresh context (no `sessionStorage`), the overlay is visible immediately, the P&L image fades in/out, the three cards reveal in sequence, and the logo/caption/headline fade in — then the whole overlay disappears on its own within ~6s, revealing the real homepage underneath unmodified.
2. Reloading the same page (same `sessionStorage`) does **not** replay the animation — the real homepage renders immediately.
3. With `prefers-reduced-motion: reduce` emulated, the animation never appears at all, on either load.
4. Clicking "דלג" (skip) during playback immediately dismisses the overlay.
5. `console --errors` / page console is clean (no uncaught exceptions from the canvas code).
6. Take screenshots at both viewports mid-animation and after dismissal; confirm nothing else on the homepage is broken (nav, hero text, footer).

- [ ] **Step 6: Commit**

```bash
git add client/public/images/entry-animation-pnl-sample.png client/src/components/EntryAnimation.tsx client/src/pages/Home.tsx
git commit -m "feat: add homepage entry animation (P&L to dashboard)"
```

---

## Task 2: Floating WhatsApp Button

**Files:**
- Create: `client/src/components/FloatingWhatsApp.tsx`
- Modify: `client/src/App.tsx` — import and mount `<FloatingWhatsApp />` as a sibling of `<Router />`, inside `<TooltipProvider>`.

**Interfaces:**
- Produces: `export default function FloatingWhatsApp(): JSX.Element | null` — no props. Consumes `useContent()` (from `client/src/hooks/useContent.ts`, already defined: `content.hero.businessWhatsappUrl`, `content.hero.whatsappUrl`, `content.contact.whatsappUrl`).

- [ ] **Step 1: Create `client/src/components/FloatingWhatsApp.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { GraduationCap, Laptop, Presentation, UserCheck, Users, X } from "lucide-react";
import { useContent } from "@/hooks/useContent";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gtag = (...args: any[]) => {
  if (typeof window !== "undefined") (window as any).gtag?.(...args);
};

// Placeholder colors — standard WhatsApp green per
// prompt-terminal-whatsapp-floating-button.md — pending Codex's final color
// spec (including whether to keep WhatsApp-standard green or switch to a
// brand color). Swap values here only.
const COLORS = {
  buttonBg: "#25D366",
  buttonIcon: "#ffffff",
  menuBg: "#061640",
  menuBorder: "rgba(255,255,255,0.12)",
  menuText: "#ffffff",
  menuHoverBg: "rgba(255,255,255,0.08)",
};

interface MenuOption {
  key: string;
  label: string;
  icon: typeof Users;
  message?: string; // omitted for the "join community" option, which links straight to the group
}

// Placeholder labels/messages, ported verbatim from
// prompt-terminal-whatsapp-floating-button.md — pending Codex's final copy.
const MENU_OPTIONS: MenuOption[] = [
  {
    key: "workshop",
    label: "פרטים על סדנה למחלקת כספים",
    icon: Presentation,
    message: "היי, הגעתי מהאתר של AI Finance ואשמח לשמוע פרטים על סדנה למחלקת הכספים שלנו.",
  },
  {
    key: "community",
    label: "הצטרפות לקהילה",
    icon: Users,
  },
  {
    key: "courses",
    label: "רישום לקורסים (כולל קורס דירקטורים)",
    icon: GraduationCap,
    message: "היי, אשמח לשמוע פרטים על הקורסים שלכם, כולל קורס דירקטורים.",
  },
  {
    key: "coaching",
    label: "ליווי אישי",
    icon: UserCheck,
    message: "היי, אשמח לשמוע פרטים על ליווי אישי.",
  },
  {
    key: "online-training",
    label: "הדרכה מקוונת",
    icon: Laptop,
    message: "היי, אשמח לשמוע פרטים על הדרכה מקוונת.",
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
          aria-label="אפשרויות יצירת קשר בוואטסאפ"
          className="absolute bottom-16 right-0 w-72 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{ background: COLORS.menuBg, borderColor: COLORS.menuBorder }}
        >
          {MENU_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <a
                key={option.key}
                role="menuitem"
                href={hrefFor(option)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOptionClick(option)}
                className="flex items-center gap-3 px-4 py-3 text-sm border-b last:border-b-0 transition-colors duration-150 hover:bg-white/[0.08]"
                style={{ color: COLORS.menuText, borderColor: COLORS.menuBorder }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
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
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg entry-whatsapp-pulse"
        style={{ background: COLORS.buttonBg, color: COLORS.buttonIcon }}
      >
        {open ? <X className="w-6 h-6" /> : <WhatsAppGlyph className="w-7 h-7" />}
      </button>

      <style>{`
        .entry-whatsapp-pulse { animation: entryWhatsappPulse 3.5s ease-in-out infinite; }
        @keyframes entryWhatsappPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          50% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .entry-whatsapp-pulse { animation: none; }
        }
      `}</style>
    </div>
  );
}
```

Design notes for the implementer:
- Uses `content.contact.whatsappUrl` (the bare `https://wa.me/972542380333` URL, no query string) as the base for the four message-carrying options, rather than `content.hero.businessWhatsappUrl` (which already has its own different default message baked into its query string) — this avoids concatenating onto an existing `?text=`.
- The "join community" option (`community`, no `message`) links straight to `content.hero.whatsappUrl` (the group invite link), per the spec.
- `hover:bg-white/[0.08]` on the menu rows is a Tailwind utility (not inline JS hover handlers) — simpler and avoids inline-style specificity fights with the `:hover` pseudo-class.
- The `Icon` per option is decorative next to the visible label text, so `aria-hidden="true"` on the icon is correct; the accessible name for each row comes from the link's visible text content.

- [ ] **Step 2: Mount `FloatingWhatsApp` in `App.tsx`**

Add the import:

```tsx
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
```

Mount it as a sibling of `<Router />`, inside `<TooltipProvider>`, so it renders on every route regardless of which page component is active:

```tsx
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <FloatingWhatsApp />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

Do not modify `Router()` or any individual page component — this is additive only, and must not remove or replace any existing per-page WhatsApp links/buttons (nav bar, hero CTA, footer, services pages all keep their existing WhatsApp links unchanged).

- [ ] **Step 3: Typecheck and build**

Run: `npm run check`
Expected: no TypeScript errors.

Run: `npm run build`
Expected: build succeeds, no new warnings.

- [ ] **Step 4: Visual verification across page types**

Using the same headless-browser approach as Task 1, against `npm run preview`:
1. Load `/`, `/blog`, `/blog/<any-published-slug>/`, `/community`, `/services/ai-workshops-for-finance/` (or another services page) — confirm the button appears bottom-right on every one, doesn't overlap/hide any existing footer links, nav items, or per-page CTA buttons, and doesn't get hidden by the mobile nav or blog footer.
2. Click the button — confirm the 5-option menu opens above it, all 5 labels are visible and legible against the dark menu background.
3. Confirm each of the 4 message options' `href` is a `https://wa.me/972542380333?text=...` URL containing the correct pre-filled Hebrew message (URL-decode to check), and the "הצטרפות לקהילה" option's `href` is the raw `https://chat.whatsapp.com/...` group link with no `?text=`.
4. Press Escape while the menu is open — confirm it closes. Click outside the menu — confirm it also closes.
5. At a mobile viewport (390px), confirm the button is at least 48×48px and doesn't get obscured by/doesn't obscure other fixed elements.
6. Confirm no console errors on any of the pages checked.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/FloatingWhatsApp.tsx client/src/App.tsx
git commit -m "feat: add floating WhatsApp button with 5-option contact menu"
```

---

## Self-Review Notes (for the plan author, already applied above)

- **Spec coverage:** session-once ✅ (Task 1 Step 2, `sessionStorage`), reduced-motion ✅ (JS gate + CSS media query belt-and-suspenders), non-blocking LCP ✅ (design notes + fragment-sibling mounting in Step 3, no `useContent()` dependency in `EntryAnimation`), skip button ✅, no heavy deps ✅ (canvas + plain CSS only), texts as easily-replaceable constants ✅ (`TEXTS`/`MENU_OPTIONS`), colors as placeholders ✅ (`COLORS` in both files, verbatim from mockup/spec), two commits ✅, tsc+build gate ✅, visual verification steps ✅, all 5 WhatsApp options present including the 3 without dedicated pages ✅, GA4 tracking ✅, Escape/click-outside ✅, doesn't touch existing per-page WhatsApp buttons ✅, doesn't touch global color scheme ✅.
- **Placeholder scan:** none found — every step has runnable code or a concrete command with an expected result.
- **Type consistency:** `EntryAnimation` and `FloatingWhatsApp` are both default-exported, no-prop components, referenced consistently by name across Task 1 Step 3 / Task 2 Step 2 and their own definitions.
