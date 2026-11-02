# GreenLanternLore — Project Specification

> Living spec for the GreenLanternLore static site. We iterate on this file
> together; each agreed change gets committed, then built in phases.

## 1. Vision

A fun, highly visual, **fully static website** where visitors can explore the
entire Lantern mythology of the DC Universe — every color of the emotional
spectrum, the Corps behind each color, their oaths, notable members,
homeworlds, and lore. It should feel like a cosmic toy box: click around,
get dazzled, learn something.

## 2. Scope — The Nine Corps

The site covers the **full emotional spectrum**, not just the Green Lanterns:

| Color  | Corps               | Emotion    | Central figure |
|--------|---------------------|------------|----------------|
| Red    | Red Lantern Corps   | Rage       | Atrocitus      |
| Orange | Orange Lantern Corps| Avarice    | Larfleeze      |
| Yellow | Sinestro Corps      | Fear       | Sinestro       |
| Green  | Green Lantern Corps | Will       | Hal Jordan     |
| Blue   | Blue Lantern Corps  | Hope       | Saint Walker   |
| Indigo | Indigo Tribe        | Compassion | Indigo-1       |
| Violet | Star Sapphires      | Love       | Carol Ferris   |
| Black  | Black Lantern Corps | Death      | Black Hand     |
| White  | White Lantern Corps | Life       | Kyle Rayner    |

## 3. Pages & Features

1. **Home** — cinematic hero + interactive emotional spectrum bar.
   Click a color → jump to that Corps.
2. **Corps profiles** (one page per Corps, 9 total) — each with:
   - Corps oath
   - Emotion & what it means in-universe
   - Notable members
   - Base of operations / homeworld
   - Ring abilities & quirks
   - Lore summary
3. **The Emotional Spectrum, explained** — how the spectrum works, the
   Entities, why the colors matter.
4. **Timeline** — major Lantern events across history.
5. **Quiz: "Which Lantern Corps are you?"** — playful personality quiz.
6. *(maybe later)* Glossary, reading guide.

## 4. Design Principles

- **Color-first:** every Corps section is drenched in its own color —
  glows, gradients, themed accents on a deep-space dark background.
- **Visual, not walls of text:** CSS art, animated glows, spectrum
  visualizations. Minimal reliance on external images (keep it fast and
  self-contained).
- **Playful tone:** fun to click through, easter eggs welcome.
- **Fast & accessible:** static files only, semantic HTML, mobile-friendly.

## 5. Tech

- **Pure static:** hand-written HTML + CSS + vanilla JavaScript.
  No frameworks, no build step, no backend.
- **Hosting:** GitHub Pages, deployed automatically by **GitHub Actions**
  on every push to `main`.
- **URL:** `https://dev1magnascale.github.io/greenlanternlore/`

## 6. Proposed Repo Structure

```
/
├── PROJECT_SPEC.md            # this file
├── .github/
│   └── workflows/
│       └── pages.yml          # build & deploy to GitHub Pages
├── index.html                 # home + spectrum explorer
├── spectrum.html              # emotional spectrum explainer (maybe merged into index)
├── timeline.html
├── quiz.html
├── corps/
│   ├── red.html
│   ├── orange.html
│   ├── yellow.html
│   ├── green.html
│   ├── blue.html
│   ├── indigo.html
│   ├── violet.html
│   ├── black.html
│   └── white.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/                    # local images/SVGs if needed
```

## 7. Build Phases

Each phase is built, committed to `main`, and auto-deployed — the live site
grows piece by piece.

- **Phase 0 — Foundation** (now): this spec, Pages + Actions workflow,
  empty site skeleton. ✅ done Nov 2026
- **Phase 1 — Home:** homepage with interactive spectrum explorer. ✅ done Nov 2026
- **Phase 2 — Corps profiles, batch 1:** Green, Yellow, Red. ✅ done Nov 2026
- **Phase 3 — Corps profiles, batch 2:** Blue, Orange, Indigo. ✅ done Nov 2026
- **Phase 4 — Corps profiles, batch 3:** Violet, Black, White. ✅ done Nov 2026
- **Phase 5 — Spectrum explainer + timeline.** ✅ done Nov 2026
- **Phase 6 — Quiz + polish, easter eggs.** ✅ done Nov 2026 — all phases complete.

## Addendum — Nov 2026 (post-launch enhancements)

- Original AI-generated artwork for six Corps so far (orange, yellow, green, blue, indigo, violet) — fan-site-safe, integrated into Corps page heroes.
- Red Corps artwork could not be generated; abstract alternative offered to Dash.
- Comic reading-order timeline added to timeline.html (Geoff Johns saga, spoiler-light, "you are here" marker at Blackest Night).
- Social share preview card (`og-preview.jpg`, 1200×630) + Open Graph/Twitter meta tags for WhatsApp/Discord link unfurls.

## 8. Content Notes

- Lore summaries are **original writing** (no copied text from comics or wikis).
- Keep summaries foundational; go easy on deep plot spoilers for the
  biggest event arcs.

## 9. Decisions (agreed with Dash, Nov 2026)

1. **All nine Corps** — full emotional spectrum. ✅
2. **One page per Corps** — separate pages, better for sharing/linking. ✅
3. **Quiz: yes** — 100% client-side (vanilla JS, no backend; GitHub Pages is static-only). ✅
4. **Visual style: comic-book halftone** — halftone dot textures, bold comic
   panels, heavy display type, on a deep-space dark background. ✅
5. **Homepage: no dramatic intro** — drop straight into the interactive
   spectrum as the hero. ✅
