# 💍 Lantern Lore

A fan-made, fully static website exploring the **Lantern Corps of the DC Universe** —
every color of the emotional spectrum, their oaths, members, homeworlds, and lore.

🌐 **Live site:** https://ariesyous.github.io/greenlanternlore/

## What's inside

- **Interactive emotional spectrum** — pick a color, dive into its Corps
- **Corps profiles** — nine classic Lantern groups:
  Red (Rage), Orange (Avarice), Yellow (Fear), Green (Will),
  Blue (Hope), Indigo (Compassion), Violet (Love), Black (Death), White (Life)
- **Spectrum explainer** — how the lights work, the Entities, how colors interact
- **Reading routes and history** — separate story chronology, era overviews, and a saved reading checklist
- **"Which Lantern Corps are you?" quiz** — 12 questions, 100% client-side
- **Illustrated lore** — comic covers, character portraits, and adaptation artwork
- **Comic reading-order timeline** — the Geoff Johns saga and guides to other eras
- **Issue-by-issue crossover guide** — core chapters, Lantern branches, and optional tie-ins
- **Classic Corps routes** — the 1981 miniseries, anthology stories, and the 1980s ensemble
- **Dated recent-era guide** — collection gaps, the 2025 Corps, and separate Absolute continuity

## Tech

Pure static site — hand-written HTML, CSS, and vanilla JavaScript.
No frameworks, no application build step, no backend.

## Deployment

Hosted on **GitHub Pages** and deployed automatically by **GitHub Actions**
on every push to `main` (see `.github/workflows/pages.yml`).
Pull requests run content and interaction checks without publishing. The deploy job packages
only the public HTML, data, and assets; repository documents and tests stay out
of the deployment.

For a new fork, enable Actions and select **Settings → Pages → Source → GitHub
Actions**. Update the absolute site URLs in HTML metadata, `sitemap.xml`, and
`robots.txt`, plus the project paths in `404.html` if the repository is renamed.
Then push to `main` or run **Deploy to GitHub Pages** from the Actions tab.

## Preview locally

Serve the folder over HTTP so search and character profiles can load their JSON:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Run the content-link, character-profile, and search checks with Node.js:

```bash
node --test tests/*.test.cjs
```

## Editing the lore

Keep introductions at premise level and put major outcomes in labeled spoiler sections.
Use series years and issue numbers, distinguish continuity and retcons, and link primary
publisher references beside reading advice. Profile reference notes distinguish the claims
supported by a linked source from debut citations that still need checking. Update `data/search-index.json` and
`sitemap.xml` when adding a page, then run the checks above. The prioritized editorial
work and completed release are recorded in [ROADMAP.md](ROADMAP.md).

Artwork attribution lives in `data/art-credits.json`. Each record distinguishes confirmed
artist roles from unidentified crops, fan art, edition differences and missing download
provenance. The public catalogue is on `sources.html`, with credits on illustrated pages
and all character profiles. The November 4 follow-up brings the 179-file inventory to
91 with supported named credits, two with identified publications but artist roles
pending, and 86 unresolved. Ganthet now uses Phil Cho's correctly labeled Earth-27
illustration, with its fan-project context stated. The old Highfather evidence remains
in the manifest's replacement history. Ash now uses Tony Harris's cover painting from
Green Lantern Corps Quarterly #7. Sister Sercy uses her labeled Blackest Night #0
profile illustration; the superseded Mindy Marvel fan-art evidence remains recorded.

After updating the manifest, regenerate the static catalogue and profile/page credits:

```bash
node scripts/sync-art-credits.cjs
node --test tests/*.test.cjs
```

Update the nearby image caption too when its publication, subject or credit changes.
The sync script does not replace editorial captions or infer new artist credits.

## Project spec

The full vision, scope, and build plan live in [PROJECT_SPEC.md](PROJECT_SPEC.md) —
it's a living doc we iterate on as the site grows.

---

*Fan-made tribute. Not affiliated with DC Comics. All lore summaries are original writing.*
