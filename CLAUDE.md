# scroll-shot — exam study guide repo

## What this repo is

A set of HTML study guides for BCA(DS) IV-Sem university exams (Course code prefix: BCG-2xx-V). One file per subject, plus a Chrome extension scaffold (`scroll-shot/`) that's unrelated to the guides.

Subjects + files at repo root:
- `dbms-study-guide.html` — Database Management System (BCG-202-V) — most actively iterated, treat as the reference template
- `ctrc-study-guide.html` — CTRC
- `iks-study-guide.html` — Indian Knowledge System
- `loc-study-guide.html` — LOC
- `probstats-study-guide.html` — Probability & Statistics
- `r-datascience-study-guide.html` — R Datascience
- `wc-study-guide.html` — WC

Reference materials (PYQ + syllabi) live in `reference/`:
- DBMS: `DBMS1.jpg`..`DBMS4.jpg`, `dbms-Syllabus.pdf`
- WC: `WC2025PYQ.pdf`, `wc_syllabus.jpg`
- IKS: `IKS2025PYQ.pdf`, `IKS2025PYQ_p1.png`, `IKS2025PYQ_p2.png`, `IKS_SYLLABUS.pdf`
- CTRC: `CTRC_PYQ.pdf`, `CTRC_SYLLABUS.pdf`
- ProbStats: `PS1.jpeg`..`PS4.jpeg`

## Guide structure (use DBMS as the canonical layout)

Each guide is one self-contained HTML file with:
- Inline `<style>` defining a semantic color system (CSS variables on `:root`)
- A two-column layout: sticky sidebar nav + main content
- Top-numbered topic sections `<section id="t1">` … `<section id="tN">`, each `<h2 class="topic">` with a unit pill
- A "Sessional Q&A" section (`id="t12"` in DBMS) with a frozen list of long-form 8-mark exam questions
- A "Sessional Booster" / 30-mark drill section after it
- Mobile responsive at 880px / 600px / 480px / 380px breakpoints

## Aesthetic — existing CSS classes (REUSE, don't invent)

Box variants (semantic background + left border):
- `.box.def` — blue, label "Definition"
- `.box.eg` — green, label "Example"
- `.box.tip` — amber, label "Tip" / "Properties"
- `.box.bad` — red, label "Pitfall" / "Question"
- `.simple` — teal floating-badge "IN SIMPLE WORDS" box, supports nested `.analogy`
- `.walkthrough` — amber floating-badge "WORKED EXAMPLE — STEP BY STEP", contains `.step` rows with `.step-n` (numbered circle) + `.step-body`
- `.mnemonic` — yellow dashed memory-hook box
- `.quiz` with `.q` + `.answer` reveal pattern

Code spans inside `<pre><code>`: `<span class="keyword">`, `<span class="string">`, `<span class="comment">`.

Diagrams: `<div class="diagram"><div class="diagram-title">…</div><svg viewBox="0 0 W H">…</svg></div>`.

## SVG diagram conventions

- Palette literals (matches the box CSS):
  - brand: bg `#e8f0fe`, stroke `#1f6feb`
  - good:  bg `#e6f4ea`, stroke `#1a7f37`
  - warn:  bg `#fff5e1`, stroke `#b54708`
  - bad:   bg `#fdecec`, stroke `#b42318`
  - ink `#1a2233`, neutral `#5a6577`, line `#e3e7ee`
- `rx="8"` rounded rects, `stroke-width="2"`
- Use `font-family="monospace"` for code/data, default sans for labels
- Arrow markers: `<defs><marker id="arrXX" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto"><polygon points="0 0, 10 5, 0 10" fill="#1f6feb"/></marker></defs>`. Use a UNIQUE marker id per diagram (e.g. `arrQ1`, `arrPyqQp`).
- ViewBox padding: leave ≥ 20px below the lowest text element so captions aren't clipped.
- Boxes must fit their text — at 10px monospace, ~6.5px per char; size rects accordingly.

## Content rules (from explicit user feedback)

- **PYQ answers go INSIDE the related topic**, never in a standalone "PYQ Workshop" section. Use a `<h3>PYQ Spotlight (May 2025) — &lt;topic&gt;</h3>` with a `border-top:2px dashed var(--brand)` divider at the END of each affected topic.
- **Named question lists stay frozen.** The Sessional Q&A section in DBMS has six fixed questions (Q1-Q6) — do not add Q7/Q8 there. Map any new exam content to existing topic sections instead.
- **Aim for 8-mark answers** in long-form blocks: scoring template (1m breakdown), definition box, in-simple-words analogy, types/categories with examples, comparison table, mnemonic, walkthrough, applications. Surface-level prose isn't enough.

## Workflow conventions

- **Multi-region edits to one large guide** → dispatch many parallel subagents (4-8), each owning one unique anchor (topic section / question block). Two-phase pattern: removals first (parallel), then insertions (parallel). Brief each agent with exact path, anchor text, CSS classes to reuse, and "do not touch other sections."
- **Trivial deletions** can use `model: "haiku"` subagents to save cost.
- **Verify SVGs render** — read the inserted SVG and check (a) text x/y stays inside its rect, (b) viewBox has padding below last text, (c) no overlapping y-coordinates on adjacent text elements.
- **Don't open browsers/start dev servers automatically** — the user opens files manually for visual review.

## Memory

This project has a memory system at `C:\Users\ankit\.claude\projects\C--Users-ankit-OneDrive-Desktop-New-folder-scroll-shot\memory\` — `MEMORY.md` is auto-loaded each session. Update memory when learning new user/feedback/project/reference facts.
