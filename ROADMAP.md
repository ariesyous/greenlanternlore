# Lantern Lore — Roadmap

**Vision:** The best Green Lantern site on the internet for fans worldwide — compelling to read,
fun to browse, and a visual journey with accurate, sourced writing. Publish useful content
even when a suitable credited illustration is not yet available.

**House rules**
- Public audience: no personal markers, no in-jokes, no "you are here" badges.
- Spoiler-light but comprehensive: document characters and lore fully; don't coyly dodge their stories.
- Real comic/fan art, credited on-page, self-hosted in the repo. No hotlinking, no AI-generated art.
- Small enhancements ship directly; big features get a spec first.

## Content audit — 2026-11-04

The site already has substantial coverage, four homepage entry paths, character profiles,
essays, creator spotlights, and a reading checklist. The next editorial pass should improve
accuracy, reading guidance, and depth before adding more pages. Earlier phase lists below
are historical records and include completed work that still appears as planned.

### Corrected in this audit

- [x] **New 52 continuity:** corrected `eras/new52.html` and the era card in
  `timeline.html`. New issue numbering did not reset Green Lantern's ongoing story.
  [DC's explanation of the Green Lantern and Batman exceptions](https://www.dc.com/blog/2023/08/02/ask-the-question-why-wasn-t-batman-or-green-lantern-reset-for-the-new-52).
- [x] **War Journal publication status:** corrected `eras/current.html` to identify
  the complete twelve-issue series, removed the claim that both books remain monthly,
  and replaced unsupported superlatives with a concrete premise and creator credits.
  [DC identifies #12, released August 21, 2024, as the final issue](https://www.dc.com/comics/green-lantern-war-journal-2023/green-lantern-war-journal-12).
- [x] **Core lore and character recommendations:** distinguished the seven emotions
  from life and death on the homepage, corrected Atrocitus' debut citation, separated
  Kyle's later White Lantern ascension from *Blackest Night*, and corrected reading
  recommendations that predated Jessica Cruz and Simon Baz. See
  [DC's Atrocitus profile](https://www.dc.com/characters/atrocitus) and
  [Green Lanterns: Rebirth #1](https://www.dc.com/comics/dc-universe-rebirth-2016/green-lanterns-rebirth-1).
- [x] **Discovery and documentation:** repaired search on nested pages, restored the
  glossary's entity-guide link and broken character timeline anchors, and reconciled
  the README's outdated art description. Reused existing illustrations where suitable;
  removed broken image references from the scanning and healing pages until sourced
  illustrations are available.
- [x] **Profile completeness:** supplied missing fields for Galius Zed, Jessica Cruz,
  and Simon Baz; corrected Rankorr and Miri Riam's pre-debut recommendations; and added
  Jo Mullein's *Far Sector* collection with the correct 2019–2021 publication range.

### Implemented content release — 2026-11-04

- [x] **Dependable reading order.** Rebuilt `timeline.html` around thirteen Johns-era
  stops (eleven core, two optional), with issue ranges, collection references, and next
  links. Removed the repeated era entries from the checklist, filled the #26–28 gap,
  separated the central *Brightest Day* series from the Green Lantern tie-ins, and
  carried the saga through the 2013 finale. Six later/parallel paths have their own
  counts. Existing anchors remain valid; checkmarks persist in the reader's browser.
- [x] **Fictional history separated from publication.** Consolidated the duplicated
  moments into twenty-three ordered cards with relative eras and separate publication
  context. The history is behind a spoiler disclosure; era overviews and adaptations
  remain separate sections. Legacy deep links land at the spoiler gate.
- [x] **Useful entry routes.** The homepage now leads to one complete book (*Far
  Sector*), Hal's origin, John Stewart, or the long spectrum saga. The guide also
  offers classics. Each route explains prerequisites and commitment. The FAQ no longer
  describes *Emerald Twilight* and *Blackest Night* as standalone beginner alternatives.
- [x] **Spoiler boundaries.** All seventy character histories start closed; preview
  metadata uses a summary or tagline. New guides and revised Ring Quest, Starheart,
  and entity sections put major outcomes behind labeled disclosures. Core profiles
  now offer safe introductions before their histories.
- [x] **Deeper explanations.** Rewrote the *Brightest Day* guide with the actual cast,
  creative teams, central-series/GL distinction, and collection contents. Revised
  scanning, healing, and space/time travel around examples and limitations; removed
  contradictory blanket claims from the powers hub and adjacent guides.
- [x] **Broader coverage.** Added Alan Scott as a distinct Starheart/Justice Society
  profile, expanded the Starheart and Jo Mullein material, and added sourced guides for
  *Far Sector*, *Hard-Traveling Heroes*, *Green Lantern* (2021), and *War Journal*.
  The continuity guide supplies a separately labeled *Absolute Green Lantern* entry.
- [x] **Sources and maintenance.** Revised guides include direct publisher references,
  issue ranges, and review dates. `sources.html` explains publication dates, retcons,
  interpretation, spoiler conventions, and the limits of older citations. Search and
  the sitemap include the new material. CI checks local destinations, profile rendering,
  search behavior, and checklist persistence/fallbacks before deploying.
- [x] **Identity versus entity.** Parallax and Ion profiles and spectrum summaries now
  distinguish earlier identities from later emotional-entity revelations. The Morrison
  guide includes *Blackstars* and the annual, with consistent publication dates.

### Continue the editorial work

- Extend the issue-level citation and concise-biography pass to older character and
  event pages. Source links on selected profiles are not a claim that all legacy prose
  has been independently reverified.
- Add finer issue-by-issue crossover guidance and further classic Corps stories as
  separately scoped additions, keeping the core route readable.
- Continue image-credit verification and add suitable credited illustrations for the
  scanning and healing guides. Missing artwork must not prevent useful lore coverage.
- Keep current-era coverage dated and recheck publication status when extending it.

Primary references are linked beside the relevant claims and collections on the site.
This release implements the prioritized audit above; the older phase lists below are
retained as project history, not a second pending implementation checklist.

---

## Phase 1 — Cross-linking & discovery (DONE)

- [x] Corps pages: turn "Notable Members" into portrait chips that link to character detail pages
      (all 9 corps pages). Each chip: portrait thumbnail + name + one-liner, linking to
      `character.html?id=<slug>`. Members without pages yet get a corps-color initial chip.
- [x] Sync corps member lists with the roster: red +4 (Zilius Zox, Skallox, Vice, Laira),
      black +1 (Scar). Blue/violet/orange/indigo already listed their roster members.
- [x] Homepage: add a "Keep exploring" section with three cards — Meet the Lanterns
      (characters.html), Which Corps Are You? (quiz.html), Start Reading (timeline.html).
- [x] Quiz result: suggest a kindred character ("you'd fight alongside…") alongside the Corps result.

## Phase 2 — Character depth

- [x] Fuller biographies for all 28 characters (4–6 sentences each, spoiler-light but comprehensive —
      origin, role, personality, key beats; no plot-recap minutiae).
- [x] Roster round 3 — research, verify first appearances, source portraits, add cards + detail pages: (DONE — 39 total)
  - Sinestro Corps: Lyssa Drak, Karu-Sil, Despotellis
  - Green Lantern Corps: Tomar-Re, Salaak, Arisia Rrab, Soranik Natu
  - Blue Lantern Corps: Ganthet, Sayd, Brother Hynn
  - Star Sapphires: Miri Riam
  - Natromo (Indigo Tribe): skipped — no verifiable portrait exists online.
- [ ] Nite-Lik: deliberately omitted — no comic art exists anywhere (toy-line character).

## Phase 3 — Spectrum depth (DONE)

- [x] Emotional entity profiles: Ion (will), Parallax (fear), Ophidian (avarice), the Butcher (rage),
      Adara (hope), Proselyte (compassion), the Predator (love) — plus the Life Entity (white).
      Short cards: what each entity is, which light it embodies, key lore. Comic art where findable.

## Phase 4 — Timeline & adaptations (DONE)

- [x] Expand in-universe history: added Alan Scott / Golden Age entry ("The first Lantern of Earth", 1940).
- [x] New "On screen" section: Green Lantern adaptations — Justice League animated, First Flight,
      2011 film, Emerald Knights, The Animated Series — with posters/stills.

## Phase 5 — Reading guide

- [x] "Where to read" notes on each reading-order entry (collected editions + DC Universe Infinite note).

## Phase 6 — SEO & social polish

- [x] Per-page Open Graph/Twitter card tags (9 corps pages, characters, timeline, spectrum, quiz, 404).
- [x] `sitemap.xml` + `robots.txt`.

## Phase 7 — Nice to have (DONE)

- [x] Site-wide client-side search (header search box on all pages, live dropdown).
- [x] Glossary page (power ring/battery, sector, oath, entity, Guardians, Starheart…).
- [x] Mobile polish pass (search input responsive; grids stack).
- [x] Fixed: round-3 roster cards were rendering outside their grid (full-width images) — rebuilt all 8 sections.

---

*History: Phases 0–6 (spec, homepage, corps profiles, spectrum, timeline, quiz, 404) shipped Nov 2026.
Two QA feedback rounds shipped Nov 2026 (real comic art throughout, character roster + detail pages,
timeline covers, spectrum citations, in-universe visuals).*

---

## Phase 8 — Major events (PLANNED)

Dedicated profile pages for the saga-defining events, each with: premise (spoiler-light),
key players (linked to character pages), the corps involved, and "where to read" linking
into the timeline's reading order. New `events.html` hub + individual pages:
`events/emerald-twilight.html`, `events/sinestro-corps-war.html`, `events/blackest-night.html`,
`events/war-of-the-green-lanterns.html`. Event art: real comic covers, credited, self-hosted.

## Phase 9 — Powers of the ring (PLANNED)

A visual guide to what a power ring can actually do: energy constructs, flight, force fields,
energy projection, universal translation, environmental protection, scanning/analysis,
wormhole travel, and the limits (charge, willpower, yellow impurity for green rings).
Comic-art illustrations, tied to corps pages.

## Phase 10 — Discovery & fun (PLANNED)

- [ ] "Start here" beginner reading paths on the timeline: 3 curated entry routes
      (modern epic / classic Silver Age / animated fan), each 3–4 books.
- [ ] Quotes page: iconic lines and oaths, shareable cards.
- [ ] Random Lantern button: client-side "summon a random Lantern" on the roster page.
- [ ] Quiz expansion: 8 → 12 questions for better sorting across 9 outcomes.
- [ ] Sources & credits page: bibliography of comics cited + art sources, non-commercial fan notice.

## Phase 11 — Roster round 4 & cross-links (PLANNED)

- [ ] New characters: Sodam Yat (Ion's host), Katma Tui, Ch'p — verified first appearances,
      bios, portraits (real comic art, credited, self-hosted).
- [ ] Character ↔ reading-order cross-links: "appears in" reading entries on character pages.

---

## Phase 12 — Competitive research findings (Nov 2, 2026)

Researched: Green Lantern Watch, DC Database, Green Lantern Wiki (Fandom), Blog of Oa,
comicbookreadingorders.com, comicbooktreasury.com, Wookieepedia (structural reference).

### Tier 1 — high impact, fits our model (DO THESE)
- [ ] **Interactive reading checklist**: "mark as read" checkboxes on timeline reading-order
      entries, persisted in localStorage, with progress bar. 100% client-side. (from
      comicbookreadingorders.com — "the single best interactive idea")
- [ ] **"New here? Three ways in" onboarding**: homepage/timeline entry paths for different
      reader types — the big saga path / the characters path / the quiz path. (from GL Watch)
- [ ] **"Explained" long-form essays**: narrative essays like "Emerald Twilight, explained"
      or "Why the Corps fell (and rose)". Start with 2–3. (from GL Watch + Blog of Oa 101s)
- [ ] **Per-character signature blocks**: signature constructs / key issues / recommended
      reading on character pages. (from DC Database, adapted)

### Tier 2 — strong additions, moderate effort
- [ ] **Reading order extended past 2011**: New 52, Rebirth, Morrison eras — titles-only,
      spoiler-light. (Ours ends at War of the Green Lanterns.)
- [ ] **Creators section**: writer/artist credits per arc + creator spotlights
      (Johns/Reis, Morrison/Sharp, O'Neil/Adams). "Behind the scenes" split. (Wookieepedia pattern)
- [ ] **Constructs gallery**: visual page of famous hard-light constructs. Pure visual candy.
- [ ] **Quote cards**: famous lines as styled shareable cards. (folds into Phase 10 quotes page)
- [ ] **DC Universe Infinite deep-links** per reading-order entry.

### Verdicts
- We beat the GL Wiki (Fandom) on curation, design, visual quality — nothing to steal.
- Blog/news cadence (GL Watch news, Blog of Oa) is out of scope for a static curated site.
- We already do oaths better than the listicle sites.

---

## Shipped Nov 2, 2026 (post-analysis build)

### Phase 8 — Major events (DONE)
- events.html hub + 4 event pages: Emerald Twilight, Sinestro Corps War, Blackest Night, War of the Green Lanterns.
- Each: story, key players (portrait chips), corps involved, where to read, aftermath. Real comic covers, credited.
- Events link in nav on all pages.

### Phase 9 — Powers of the Ring (DONE)
- powers.html: 8 powers (constructs, flight, force fields, energy projection, translation, scanning, travel, healing) + 4 limits (charge, emotion, yellow impurity, the bearer).

### Phase 10 — Discovery & fun (DONE)
- "Three ways in" onboarding on homepage (Big Saga / Meet the Players / Find Your Corps).
- quotes.html: all 8 corps oaths as shareable cards.
- sources.html: key comics bibliography, art credits, fan tribute notice.
- Random Lantern button on roster page.
- Quiz expanded 8 → 12 questions.

### Phase 11 — Roster round 4 & cross-links (DONE)
- 3 new characters → 42 total: Sodam Yat (Tales of GLC Annual #2, 1986), Katma Tui (GL v2 #30, 1964), Ch'p (GL v2 #148, 1982). Portraits verified, credited, self-hosted.
- Character ↔ reading-order cross-links: "Key stories" section on character pages linking to timeline entries; timeline entries have anchor IDs.

### Phase 12 — Competitive findings (PARTIAL)
- [x] Interactive reading checklist (localStorage, progress bar) on timeline.
- [x] "Three ways in" onboarding.
- [ ] "Explained" long-form essays (2–3 to start).
- [ ] Per-character signature blocks (signature constructs / key issues).
- [ ] Reading order extended past 2011 (New 52, Rebirth, Morrison eras).
- [ ] Creators section (writer/artist credits + spotlights).
- [ ] Constructs gallery.

### Phase 12 — continued (Nov 2, 2026)
- [x] Second Explained essay: "Geoff Johns and Green Lantern, Explained".
- [x] Creators page: 7 writer/artist spotlights (Johns, Van Sciver/Reis, Marz/Banks, Moore/O'Neill, O'Neil/Adams, Broome/Kane, Morrison/Sharp).
- [x] Per-character signature blocks on all 42 character pages.
- [ ] Constructs gallery (image sourcing in progress).
- [ ] DC Universe Infinite deep-links per reading-order entry.
