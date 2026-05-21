# Build Prompt — BCA(DS)-IV Exam Mastery Guide

> Paste this whole file to a fresh Claude/agent session. It is the complete spec for building all seven exam guides.

---

## 0. Mission

Build a **zero-dependency static PWA** of seven university-exam study guides for a BCA(DS) 4th-semester student. Each guide is a standalone HTML file engineered to maximise marks on the 100-mark university paper (25 sessional + 75 theory).

Every paper-setter on this exam has **20+ years of teaching experience**. They penalise shallow answers, reward structured depth, and have signature question patterns that repeat across years. Build the guides accordingly — see §6 (Answer Rigor) and §8 (Prediction Methodology).

**Work only inside `/home/rex/Desktop/experiment/viva`.** No edits outside this directory.

---

## 1. Source of truth

| Source | Path | Use |
|---|---|---|
| Official syllabus | `Syllabus.pdf` | Every unit + sub-topic comes from here. Nothing extra. |
| Design language | `index.html` (lines 17–460) | Copy `:root` tokens + base styles verbatim into each new guide. |
| Latest content pattern | `other/iks-mobile.html`, `other/r-datascience-mobile.html` | Match section structure and class vocabulary. |
| Full PRD | `~/.claude/plans/replicated-zooming-pike.md` | Reference if anything below is ambiguous. |
| PYQ corpus | Provided by user when each subject begins | Required for `#pyq`, `#repeated-qs`, `#predicted-qs`. |

---

## 2. Subjects + filenames (build in this order)

| # | Subject | Code | File | Accent |
|---|---|---|---|---|
| 1 | DBMS | BCG-202-V | `dbms-exam-guide.html` | `--navy` |
| 2 | Probability & Statistics | BCD-202-V | `probstats-exam-guide.html` | `--crimson` |
| 3 | Data Science Using R | BCD-204-V | `r-datascience-exam-guide.html` | `--forest` |
| 4 | Logical Organisation of Computer | BCG-208-V | `loc-exam-guide.html` | `--gold` |
| 5 | Wireless Communication | BCG-216-V | `wc-exam-guide.html` | `--brand` (emerald) |
| 6 | CTRC | AEC-109-V | `ctrc-exam-guide.html` | `#7c2d12` (auburn) |
| 7 | IKS | VAC-104-V | `iks-exam-guide.html` | `#a16207` (saffron) |

DBMS first establishes the template. Replicate for the others with subject-specific content swaps.

---

## 3. Exam pattern (anchors content priority)

- **Total:** 100 marks · 3 hours · 25 sessional + 75 theory
- **Part I:** 10 short-answer Q's · 15 marks · whole syllabus · Q1 compulsory
- **Part II:** 6 long Q's · 60 marks · ~1.5 per unit · 15 marks each · attempt 4

→ Content must be **unit-balanced** with both Part-I (definitions, formulas, one-liners) AND Part-II (structured deep-dives) optimisations.

---

## 4. Per-guide section architecture

Every guide MUST contain these sections in this order. Use the listed anchor IDs.

### 4.1 `#cover` — Hero
Subject name (Fraunces 600, opsz 144), subject code (mono kicker), rotated exam-year stamp, 3 stats (`units`, `total marks`, `PYQs analysed`), one Caveat-font lead line.

### 4.2 `#scope` — Syllabus snapshot
`.howto.solid` box with **verbatim** units from `Syllabus.pdf`. Each unit gets `<span class="priority">High-yield · X/15 M</span>` based on PYQ frequency.

### 4.3 `#tldr` — Night-before survival kit
5–8 anchor items that "buy you 12+ marks". Mix: must-know definitions, comparison tables, **one master mnemonic**, **one master diagram**, **one formula sheet**.

### 4.4 `#toc` — Table of contents
`.toc` numbered list with topic-count badges (`12 t`), smooth-scroll anchors.

### 4.5 `#unit-1` … `#unit-N` — Per-unit deep dives
One `<section class="unit">` per syllabus unit. Each contains:
- `.unit-head` — kicker (`Unit 01 · ER Model`), `<h2>`, lede, priority badge
- Multiple `.topic` blocks (one per syllabus sub-topic), composed from the component vocabulary (§5)

### 4.6 `#pyq` — Previous Year Questions vault
- Distinct `.pyq` blocks, tagged `{year, unit, marks, frequency}`
- Inline model answer in `.ans` (no toggles, always visible, print-friendly)
- Sorted by **unit ASC then year DESC**
- Cross-link to relevant `.topic` via anchor

### 4.7 `#repeated-qs` — Most-repeated questions (frequency-ranked) ⭐ NEW
Top **10–15 highest-frequency questions** pulled from the PYQ corpus, ranked by appearance count.
- `.qcard.repeated` blocks with `.tag.hot` frequency badge (`⭐ Repeated 5× (2019–2024)`)
- Year list inline (`Appeared: 2024, 2022, 2021, 2019`)
- Unit anchor back to relevant `.topic`
- **Full 15-mark depth model answer** even if the Q appeared at lower marks — include `.box.tip` showing how to compress for shorter mark versions
- Sort descending by frequency; tie-break by most recent year
- Open with a `.score` box: "If you nail these 10 questions, you're looking at 35–45 marks guaranteed."

### 4.8 `#predicted-qs` — Predicted questions for next exam ⭐ NEW
5–8 predicted questions, derived from PYQ pattern analysis (see §8).
- `.qcard.predicted` blocks
- Confidence tag: `Very Likely` / `Likely` / `Possible`
- **Reasoning line in `.box.prof`** citing which signal(s) justify the prediction
- Predicted marks tier (2 / 5 / 15)
- Full model answer at predicted marks tier using §6 rigor
- Never fabricate without pattern evidence — if PYQ corpus is too thin, leave a placeholder

### 4.9 `#drill` — Self-test
- 8–12 short-Q (Part I style) covering whole syllabus
- 4–6 long-Q (Part II style), minimum one per unit
- Answer key in `<details>` (only allowed JS-free toggle)

### 4.10 `#revision-plan` — 3-hour schedule
Time-boxed table: `0:00–0:30 TL;DR + diagrams` · `0:30–1:30 Unit highlights` · `1:30–2:30 PYQs + repeated + predicted` · `2:30–3:00 Drill`.

### 4.11 `footer.end` — Sign-off + offline-status indicator

---

## 5. Component vocabulary — REUSE, do not invent

Grep `other/*.html` for the closest match before writing fresh HTML.

**Layout:** `.topbar` · `.wrap` · `.hero` · `<section class="unit">` · `.unit-head` · `.topic` · `footer.end`

**Front-matter:** `.howto.solid` · `.tldr` · `.toc` (with `.d` count suffix)

**Semantic content boxes:**
- `.box.def` (gold) — definition
- `.box.why` (forest) — why it matters / exam relevance
- `.box.prof` (ink italic) — "how prof asks this" / prediction reasoning
- `.box.warn` (crimson) — common mistakes / pitfalls
- `.box.tip` (auburn) — tricks / shortcuts / compression hints
- `.box.eli5` (amber dashed) — simplified explanation

**Q/A:** `.qcard` · `.qhead` · `.qbody` · `.step.k` (numbered steps) · `.ans` · `.pyq` · `.numeric` · `.qcard.repeated` · `.qcard.predicted`

**Inline aids:** `.formula` (monospace) · `.mnem` (yellow cursive with `<b>Mnemonic:</b>`) · `.scribble` · `.score` (dashed gold scoring box) · `<mark>` (highlighter)

**Tags:** `.tag` · `.tag.hot ⭐` · `.priority` · `.pill`

**Diagrams:** `.diagram-fig > svg` · `.svg-text.mono/.title/.label` · CSS vars `--svg-ink`, `--svg-line`, `--svg-brand`

**Navigation:** `nav.chips` · `.up` (fixed back-to-top) · `html { scroll-behavior: smooth }`

---

## 6. Answer rigor — calibrated for 20+ year professors

Senior professors penalise shallow, generic, definition-only answers — even on short Qs. Every model answer in `.ans` must follow this structure:

| Marks tier | Required structure | Minimum content |
|---|---|---|
| **2-mark** | 2–3 dense sentences | Definition + 1 distinguishing property OR 1 example |
| **5-mark** | 1 paragraph + 1 supporting element | Definition + classification + 1 diagram OR worked example OR formula |
| **10-mark** | 4-block | (1) Definition with formal notation · (2) Diagram/formula · (3) Worked example or derivation · (4) Use case + significance |
| **15-mark** | 5-block | (1) Definition + context · (2) **Mandatory diagram** · (3) Classification/types/properties · (4) Worked numerical or detailed derivation · (5) Real-world application + limitations |

**Hard rules — every answer:**
- Never bullet-only. Prose connective tissue between bullets.
- Cite the formula explicitly even if not asked (Bayes', binomial PMF, ER cardinality notation, etc.).
- Worked numericals show every step in numbered `.step.k` substeps — no skipped algebra.
- Diagrams mandatory on 10+ mark questions for any topic with a canonical visual.
- Edge cases / common pitfalls end the answer in a `.box.warn` for any 10+ mark Q.
- **Mark-allocation footer** on every 10+ mark answer: a `.score` box breaking down how the 15 marks distribute across the 5 blocks.

---

## 7. PYQ integration protocol

For each subject the agent MUST:

1. Pause after scaffolding sections §4.1–4.5 (skeleton). **Ask the user for that subject's PYQ corpus.**
2. Classify each PYQ: `{year, unit, marks, topic-tag, frequency}`.
3. Place in `#pyq` (sorted unit ASC, year DESC).
4. Write model answer per §6 rigor.
5. Cross-link each PYQ to its `.topic` via anchor.
6. If a PYQ tests something **outside the syllabus**, flag in `.box.warn` and skip the model answer — never fabricate coverage.
7. **Derive `#repeated-qs`** by counting cross-year appearances (merge semantic duplicates — "Define normalization" ≡ "What is normalization?").
8. **Derive `#predicted-qs`** using §8 methodology.

If no PYQs provided yet: leave `#pyq`, `#repeated-qs`, `#predicted-qs` as `.box.tip` placeholders saying "Awaiting PYQ corpus from user". **Never invent fake PYQs or predictions.**

---

## 8. Prediction methodology

To populate `#predicted-qs`, analyse the PYQ corpus using these signals (priority order):

1. **Frequency × recency** — questions appearing 3+ times with last appearance 2+ years ago = HIGH probability of return.
2. **Cyclic pattern** — if a topic appears in {2019, 2021, 2023}, the 2025/2026 paper is very likely to repeat it.
3. **Syllabus gap** — topics flagged "High-yield" in `Syllabus.pdf` but absent from last 2–3 years of PYQs are overdue.
4. **Format rotation** — if a topic appeared as 5-mark Q twice and 15-mark Q once, predict it may surface in the under-represented format.
5. **Prof signature topics** — concepts with rich application angles (Normalization, Bayes', Pipelining, ER design) attract senior profs disproportionately.

Each predicted Q MUST:
- Cite which of the 5 signals justify the prediction (in the `.box.prof` reasoning line).
- Include a full model answer at the predicted marks tier (using §6 rigor).
- Carry a confidence tag: `Very Likely` (3+ signals), `Likely` (2 signals), `Possible` (1 signal).

---

## 9. Design system (reuse — do NOT redesign)

**Fonts:** Fraunces (display) · Spectral (body) · JetBrains Mono (labels, UPPERCASE + letter-spacing) · Caveat (handwritten accents)

**Tokens** (copy from `index.html`):
- `--paper #f7f1e1` · `--ink #1a1209` · `--brand #065f46`
- Subject accents per §2

**Brutalist signature:**
- 1.5px solid ink borders
- Hard offset shadows: `box-shadow: 4px 4px 0 var(--ink)`
- Border-radius 4px max (never larger)
- Active state: `transform: translate(2px,2px); box-shadow: 2px 2px 0 var(--ink)`

**Responsive:** mobile-first · `.wrap` max-width 760px · breakpoints 360 / 480 / 600 / 780
**Print:** existing `@media print` rules must keep working
**Accessibility:** `input,textarea,select { font-size:16px }` · tap targets ≥ 44px · `prefers-reduced-motion` respected

---

## 10. Diagrams

**Inline SVG only.** No external images. No Mermaid runtime. No JS chart libs.

Reference patterns:
- DBMS: ER diagrams, normalization arrows
- P&S: distribution curves with axis ticks
- R/DS: 3-pillar Venn (Stats + CS + Domain), ETL pipeline
- LOC: CPU/memory hierarchy nested rectangles
- WC: cellular hex grid, signal propagation
- CTRC: Six Thinking Hats orbit
- IKS: timeline, decimal place-value boxes (reuse from `other/iks-mobile.html`)

Every diagram: `<figcaption><b>Fig X.Y</b> + one-line caption`. Use `--svg-ink`, `--svg-line`, `--svg-brand` so diagrams adapt to subject color and print B/W.

---

## 11. Files to modify

| Path | Action |
|---|---|
| 7× `*-exam-guide.html` | Create in repo root |
| `index.html` | Add "Exam Mastery" section between Viva Guides and Sessional Study Guides. Remove broken `viva/r-viva.html` and `viva/stats-viva.html` links. |
| `sw.js` | Append 7 new files to `PRECACHE_URLS`. Bump `CACHE_VERSION`. |
| `README.md` | Update file table. |

---

## 12. Verification per guide

1. Open the file directly in a browser (no server) — fonts load, no console errors.
2. Open `Syllabus.pdf` side-by-side; tick every unit + sub-topic against the guide's TOC.
3. Every user-supplied PYQ appears in `#pyq` with a model answer at §6 rigor.
4. `#repeated-qs` ranked descending by frequency.
5. Every predicted Q in `#predicted-qs` cites at least one signal from §8.
6. Mobile viewport (390px) — no horizontal scroll, tap targets ≥ 44px.
7. Print preview — page breaks land between sections, no color bleed, no cut diagrams.
8. After `sw.js` update: hard-reload `index.html`, confirm DevTools → Application → Cache Storage shows the new file.
9. `grep -r "viva/r-viva\|viva/stats-viva" .` returns nothing.

End-to-end PWA test: `python3 -m http.server` → install on phone → airplane mode → confirm every guide opens.

---

## 13. Hard constraints

- ❌ No npm, no bundler, no framework, no Mermaid runtime, no JS chart libs
- ❌ No new design language — reuse existing `:root` tokens
- ❌ No fabricated PYQs, no fabricated predictions, no syllabus-extra content
- ❌ No edits outside `/home/rex/Desktop/experiment/viva`
- ❌ No shallow bullet-only answers — every answer follows §6 rigor
- ✅ One subject at a time. DBMS first. Pause for PYQs before completing `#pyq`, `#repeated-qs`, `#predicted-qs`.

---

## 14. Kickoff

Start with **DBMS**. Build the skeleton (sections §4.1–4.5 populated from `Syllabus.pdf` BCG-202-V Units I–IV). Then stop and ask:

> "DBMS skeleton ready. Paste the DBMS PYQ corpus (year-wise, with marks per Q) so I can build #pyq, #repeated-qs, and #predicted-qs."

After PYQs arrive, populate §4.6–4.10, then run §12 verification, then move to subject #2.
