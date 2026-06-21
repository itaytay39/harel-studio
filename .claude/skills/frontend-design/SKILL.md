---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: luxury/refined — cinematic, Apple-level polish, premium dark
- **Constraints**: Next.js + Three.js + R3F + GSAP + Lenis. Hebrew RTL.
- **Differentiation**: What makes this UNFORGETTABLE? Cinematic scroll + 3D monitor + particles.

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

## Frontend Aesthetics Guidelines

- **Typography**: Heebo (Hebrew) + Space Grotesk (Latin). Beautiful, unique, intentional. NEVER Arial, Inter, Roboto, system fonts.
- **Color & Theme**: #020408 void black + #4a9eff neon blue. Dominant with sharp accents. CSS variables for consistency.
- **Motion**: GSAP ScrollTrigger for scroll-driven animation. Lenis for smooth scroll. Three.js/R3F for all 3D. Every entrance animation is DIFFERENT. Stagger 0.08–0.12s.
- **Spatial Composition**: Full-viewport immersive. No cards. No boxes on scroll sections. Text sits directly on background.
- **Backgrounds**: ParticleField GLSL shader (8k particles). HDRI studio.hdr environment. Bloom + Chromatic Aberration + Vignette post-processing.

NEVER use: purple gradients, glassmorphism on scroll sections, Inter/Roboto fonts, predictable layouts, cookie-cutter AI aesthetics.

## Scroll-Driven Website Design Guidelines

### Typography as Design
- Hero headings: **6rem minimum**, tight line-height (0.9–1.0), Heebo 800
- Section headings: **3rem minimum**, Heebo 600–700
- Horizontal marquee: **10–15vw**, uppercase, letterspaced
- Section labels: 0.7rem, uppercase, letter-spacing 0.35em, muted #7a9abf
- Text hierarchy replaces card containers — size, weight, color ARE the structure

### No Cards on Scroll Sections
- Text sits directly on background — clean, confident, editorial
- Exception: capability cards in Scene 05 use subtle glass border ONLY (1px rgba)
- Readability via font weight 700+, not containers

### Color Zones
- Scene 01–03: #020408 (void black)
- Scene 04–07: #020d1a (deep blue)
- Transitions via GSAP, never CSS transitions

### Animation Choreography
- Every section uses a DIFFERENT entrance: fade-up, slide-left, scale-up, clip-path reveal
- Stagger: 0.08–0.12s between elements
- Sequence: label → heading → body → CTA
- Scene 03 pins while portal forms
- At least one element moves horizontally on scroll (marquee)

### Stats & Numbers (Scene 07)
- Display at 4rem+ font size
- Numbers count up via GSAP — never appear statically
