# Jethro's Portfolio

React + Vite + TypeScript + Tailwind v4. Content: `src/data.ts`. Brand tokens: `@theme` in `src/index.css`.

## Brand identity (do not change without asking)
Mood: **smoky petrol + ice**. Deep blue-teal atmosphere with fog/haze and pale icy-cyan light (Jethro's references: NUORBIT portal, Hanergy misty globe, ArtStation dark slate). Replaced the earlier lime/emerald "green galaxy" on 2026-11-27 at his request.
- Tokens in `src/index.css` @theme (names kept from older palettes, values are new):
  - `space` #03121A abyss background · `deep` #061C24 deep petrol · `dark` #0B2B36 petrol surface
  - `aqua` #3CC4DC glacier cyan (primary accent) · `mint` #A8E8F4 ice · `ink` #E6F3F7 text · `muted` #8AA8B4 steel haze
  - `emerald` #6FD6EA frost · `lime` #D6F7FF ice glow (brightest highlight, active states) · `cyan` #4C9BC4 steel blue
- Atmosphere: `src/fx/Galaxy.tsx` (dim starfield, drifting fog banks `.mist`, misty floor glow), LightStreaks, FlowDiagram, useSpotlight.
- Translucent glass cards (`.glass`), Space Grotesk / Inter / JetBrains Mono, italic Instrument Serif accent words (`.accent`). For key-swapped animated words use `.accent-solid` + `.word-rise` (clip-path wipe): gradient text and transform/filter animations fail to paint in some renderers.
- **No purple. No neon lime/green.** Keep it cool, smoky and cinematic.
- Exception: skill pills (`src/SkillPill.tsx`) use each tool's **real brand colour and logo** (Jethro asked for this). Logos live in `src/brandIcons.ts` (copied from simple-icons, CC0); black marks render white; tools simple-icons lacks use a lucide symbol in their brand colour. Skills/specializations data: `techStack`, `specializations` in `src/data.ts`.

## Section order
Hero (3D desk scene, `src/Hero.tsx` + `src/hero3d/`: scroll opens the laptop, then the sales pitch fades in; lazy-loaded R3F, falls back to plain HTML without WebGL) → Services ("What I do") → AI showcase (`src/AIShowcase.tsx` + `src/ai/RobotScene.tsx`: 3D robot that follows the cursor inside a HUD frame; lazy-loaded near viewport) → About (`src/About.tsx`: portrait in an arch with a giant drifting word behind it and its outline over it, floating proof tags, "why clients pick me" pitch, polaroid strip of event photos; images in `public/about/`, referenced via `import.meta.env.BASE_URL`) → Qualifications & Education → Technical Skills → Professional Experience → Demos (swipeable flip-card deck of Drive videos, `src/DemoDeck.tsx`, data in `demos`) → Featured Projects (tabbed showcase) → Creative (graphics & video: `src/Creative.tsx`, cinematic serif line reveal with work popping between words + pinned 3D orbit: works circle a glowing light, scroll spins the next one to the front, click flies the card into a case-study panel; data in `creativeWorks`, files in Drive) → Leadership & Achievements → Certificates (scroll-pinned 3D fly-in stack, `src/Certificates.tsx`, data in `certificates`, files in Drive) → "I build ___" band → Contact (`src/Contact.tsx`: "Let's talk about your idea" project-brief form that sends via mailto or WhatsApp (no backend), live San Pablo time + availability, contact links, "what happens next" timeline)

The site is positioned as **selling Jethro's skills** to clients/employers, not just a résumé. Layout was inspired by a reference reel, but keep the copy and visuals original and teal.

## Pop-ups
Modals (case study, certificate viewer, demo video) render through `createPortal` to `document.body` so they sit above the fixed navbar.

## Project accuracy
**TalkReady** and **E-Athleta** are NOT Jethro's projects, and he has **no IEEE APWiMob paper**. Never add them back. Current projects: Joshua's Meat Products (forecasting), Succor Haven, eKalinga; demos: Genrev Systems, Sandalivid, Succor Haven.

## Experience accuracy
Keep the OJT (Alexa's Engineering Services), freelance work, and the Gallagher's Resource short-term engagement as **separate** entries. Don't present them as ongoing or full-time employment.
