---
name: Urban Aristocracy
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#dfbfba'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a78a86'
  outline-variant: '#58413e'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#680201'
  primary-container: '#660000'
  on-primary-container: '#f56b58'
  inverse-primary: '#aa3527'
  secondary: '#eabe95'
  on-secondary: '#452a0d'
  secondary-container: '#5f4021'
  on-secondary-container: '#d7ad85'
  tertiary: '#c7c6c6'
  on-tertiary: '#303030'
  tertiary-container: '#2e2f2f'
  on-tertiary-container: '#979696'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#891d12'
  secondary-fixed: '#ffdcbe'
  secondary-fixed-dim: '#eabe95'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#5f4021'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Cinzel
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  headline-lg:
    fontFamily: Cinzel
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Cinzel
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.1em
  body-lg:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.2em
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style

The design system is built upon the concept of "Urban Aristocracy"—a fusion of heritage prestige and raw street authority. It is designed for an elite target audience that values historical weight as much as modern exclusivity. The UI evokes a sense of "Grit meets Luxury," utilizing high-end editorial aesthetics juxtaposed with dark, moody environmental textures.

The visual style is **Minimalist / High-Contrast**, leaning into the cinematic quality of luxury fashion houses. It prioritizes vast negative space, sharp structural lines, and a "dark mode by default" philosophy to emphasize the rich, saturated accent colors.

### Core Pillars
- **Manifesto:** Establishing the new elite. We do not follow trends; we command the future by respecting the past.
- **Mission:** To provide a sovereign wardrobe for the modern vanguard.
- **Vision:** Redefining street status through the lens of imperial heritage.
- **Real Applications:** High-end e-commerce, exclusive member portals, and immersive lookbooks that feel like digital galleries.

## Colors

The palette is rooted in deep, somber tones to create an atmosphere of mystery and power.

- **Primary (Blood Heritage):** #660000 is used for key call-to-actions and brand iconography, representing passion and legacy.
- **Secondary (Champagne Gold):** #ECC097 provides a sophisticated contrast, used for high-level labels, borders, and accents to signify wealth and refinement.
- **Neutrals:** The background architecture is dominated by #050505 (Obsidian), while #5A5A5A (Slate) provides depth in secondary text and structural dividers.
- **Surface:** #0F0000 (Deep Crimson-Black) acts as a subtle container color to distinguish layers without breaking the dark immersion.

## Typography

The typography strategy employs a "Modern Classicist" approach.

- **Headlines:** Uses **Cinzel** (not available in standard list, replaced by **ebGaramond** for system parity if necessary, but strictly **Cinzel** for the brand identity). It is always rendered in uppercase for primary titles to evoke stone-carved inscriptions of old-world empires.
- **Body & Functional UI:** **Montserrat** provides the modern, geometric balance. It ensures high legibility against dark backgrounds.
- **Styling:** Headings should utilize generous tracking (letter-spacing) to emphasize the premium nature of the brand. Body text remains tight and clean.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain "editorial" control over content positioning, transitioning to a fluid model on mobile.

- **Rhythm:** A strict 8px/4px base unit system ensures mathematical harmony.
- **Desktop:** 12-column grid with wide margins (64px) to create a centered, focused experience resembling a luxury magazine.
- **Mobile:** 4-column grid with 16px margins.
- **Whitespace:** Use "aggressive" whitespace. Elements should never feel crowded; the negative space is what makes the product feel expensive.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layers** and **Subtle Outlines**.

- **Surface Tiers:** Depth is created by shifting from #050505 (Background) to #0F0000 (Card/Container). 
- **Outlines:** Instead of shadows, use 1px solid borders in #5A5A5A at 20% opacity or #ECC097 at 15% opacity to define boundaries.
- **Backdrop Blurs:** Use subtle dark blurs (20px radius) behind navigation bars to maintain the "Elite" atmospheric feel while scrolling over vibrant product imagery.

## Shapes

The shape language is **Sharp (0)**. 

To communicate "Grit" and "Authority," all UI elements—including buttons, input fields, and images—feature 90-degree corners. This evokes architectural permanence and precision. Avoid rounded corners entirely, as they soften the "aristocratic" edge the brand requires.

## Components

- **Buttons:** Primary buttons are solid #660000 with white or #ECC097 uppercase text. Ghost buttons use #ECC097 outlines. No rounding; sharp edges only.
- **Inputs:** Minimalist bottom-border only or a thin #5A5A5A frame. Labels should be small, uppercase Montserrat.
- **Cards:** Background of #0F0000 with no shadow. Use a thin Gold (#ECC097) top-border to signify "Premium" status for featured items.
- **Chips/Badges:** Small, rectangular tags with high tracking. Used for "Exclusive," "Limited," or "Archive" status.
- **Iconography:** Thin-line icons in Gold or White. Icons should be framed within crests or shields when used for brand-value sections.
- **Navigation:** Top-tier navigation should be minimalist, utilizing Cinzel for category headers to maintain the aristocratic feel throughout the user journey.