# Design System: Human-Centric Finance

## 1. Overview & Creative North Star
**Creative North Star: "The Living Ledger"**

Traditional finance is often characterized by cold grids, aggressive blues, and rigid structures that feel exclusionary. This design system rejects the "bank-as-a-fortress" aesthetic in favor of "bank-as-a-garden." We move away from the sterile "template" look by embracing **The Living Ledger**—a philosophy where digital interfaces feel like high-end editorial journals. 

To break the standard SaaS mold, we utilize intentional asymmetry (e.g., staggering cards in a masonry-like flow), overlapping elements that break container boundaries, and a high-contrast typography scale. This creates a "bespoke" feel where the interface breathes, prioritizing empathy and sophistication over sheer data density.

---

## 2. Colors & Surface Philosophy

The palette is rooted in nature: Sage greens provide growth and stability, Terracottas offer warmth and human connection, and Creams replace the clinical harshness of pure white.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be established solely through background color shifts or tonal transitions. Use `surface-container-low` (#f5f3f1) sections sitting on a `surface` (#faf9f7) background to define zones.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, physical layers—like fine weighted paper. 
- **Base Layer:** `surface` (#faf9f7)
- **Secondary Zone:** `surface-container-low` (#f5f3f1)
- **Interactive/Floating Elements:** `surface-container-lowest` (#ffffff) to provide "pop" through lightness rather than shadows.

### The Glass & Gradient Rule
To add "soul" to the interface:
- **Hero CTAs:** Use a subtle linear gradient transitioning from `primary` (#516138) to `primary-container` (#697a4f) at a 135-degree angle.
- **Overlays:** For navigation bars or floating modals, use a backdrop-blur (12px–20px) combined with a 70% opacity `surface` color to create a "frosted glass" effect, softening the edges of the digital space.

---

## 3. Typography: Editorial Authority

We pair the intellectual weight of a serif with the modern clarity of a geometric sans-serif to bridge the gap between "established institution" and "modern partner."

*   **Display & Headlines (Newsreader):** Used for storytelling and high-level data summaries. The generous x-height and organic terminals of Newsreader convey a sense of history and trust.
    *   *Scale Example:* `display-lg` (3.5rem) should be used sparingly to create moments of "white space as luxury."
*   **Titles & Body (Plus Jakarta Sans):** Used for all functional UI elements. Plus Jakarta Sans provides a clean, professional counterpoint that ensures legibility in complex financial tables or forms.
*   **Hierarchy Note:** Always maintain a minimum 1.5x line-height for body text to ensure the "warm and approachable" personality isn't lost in dense paragraphs.

---

## 4. Elevation & Depth: Tonal Layering

We avoid traditional "material" shadows in favor of **Ambient Depth**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift that mimics paper-on-paper.
*   **Ambient Shadows:** If a floating effect is required (e.g., a primary action menu), use a shadow with a 32px blur, 0% spread, and 6% opacity using the `on-surface` (#1b1c1b) color. Never use pure black (#000) for shadows.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use the `outline-variant` token at 15% opacity. **Forbid 100% opaque borders.**
*   **Glassmorphism:** Use semi-transparent surface colors to allow the "warmth" of background imagery or gradients to bleed through, making the UI feel integrated into the environment.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), white text, `md` (0.75rem) corner radius. Use 24px horizontal padding to feel substantial.
- **Secondary:** `surface-container-highest` fill with `primary` text. No border.
- **Tertiary:** Text-only with a `secondary` (#934a2e) underline that expands on hover.

### Input Fields
- **Container:** Use `surface-container-high` fill. 
- **States:** No borders on default. On focus, use a 2px `primary` bottom-border only. This mimics a "signature line" on a physical document.

### Cards & Lists
- **Rule:** Forbid divider lines.
- **Separation:** Use vertical white space (`spacing-8` or `spacing-10`) or a subtle toggle between `surface-container-low` and `surface-container-highest`.
- **Lists:** Use `secondary` (#934a2e) as a small organic dot or custom glyph for bullets rather than standard discs.

### Custom Component: The "Relationship Insight" Card
A specialized card for financial advice. It features an asymmetrical layout: a `secondary_fixed_dim` (#ffb59b) background, a `headline-sm` serif title, and a background texture overlaying a candid, warm-toned photograph of people.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. For example, a 2-column layout where the left column is 5% wider than the right.
*   **Do** use candid photography. If showing a professional, ensure they are in a warm, naturally lit environment (e.g., a sunlit cafe, not a boardroom).
*   **Do** embrace "Negative Space as a Feature." Treat white space as a high-end material, not "empty" space to be filled.

### Don't
*   **Don't** use 1px dividers. If you feel you need a line, use a 12px space instead.
*   **Don't** use "Finance Blue" or "Tech Purple." Stick to the Sage and Terracotta accents to maintain the organic, human-centric feel.
*   **Don't** use sharp 90-degree corners. Everything must feel "held" and "softened" through the `md` and `lg` radius tokens.
*   **Don't** use "AI" metaphors. No glowing nodes, no digital grids, no robotic hands. If the app uses AI, represent it through "Growth" (botanical metaphors) or "Clarity" (lens flare/light metaphors).