# Jethro's Portfolio

React + Vite + TypeScript + Tailwind v4. Content: `src/data.ts`. Brand tokens: `@theme` in `src/index.css`.

## Brand identity (do not change without asking)
- Deep Teal `#071B1B` (background), Dark Teal `#0B3030` (surfaces), Aqua `#12B8A6` (accent), Mint `#8BE5D5` (highlight)
- Translucent glassmorphism cards (`.glass`), clean modern type (Space Grotesk / Inter / JetBrains Mono)
- Aurora "green galaxy" accents (added at Jethro's request): Emerald `#2EE59D`, Lime `#C6F432`, Cyan `#22D3EE`, Space `#030D0D` (page background behind the starfield). Effects live in `src/fx/` (Galaxy starfield, LightStreaks, FlowDiagram, useSpotlight). Accent words use italic Instrument Serif via `.accent`.
- **Never use purple** or the typical purple-gradient dev-portfolio look.

## Section order
Hero (3D desk scene, `src/Hero.tsx` + `src/hero3d/`: scroll opens the laptop, then the sales pitch fades in; lazy-loaded R3F, falls back to plain HTML without WebGL) → Services ("What I do") → About → Qualifications & Education → Technical Skills → Professional Experience → Demos (swipeable flip-card deck of Drive videos, `src/DemoDeck.tsx`, data in `demos`) → Featured Projects (tabbed showcase) → Leadership & Achievements → "I build ___" band → Contact ("Have something to build?" + Let's talk)

The site is positioned as **selling Jethro's skills** to clients/employers, not just a résumé. Layout was inspired by a reference reel, but keep the copy and visuals original and teal.

## Experience accuracy
Keep the OJT (Alexa's Engineering Services), freelance work, and the Gallagher's Resource short-term engagement as **separate** entries. Don't present them as ongoing or full-time employment.
