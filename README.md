# BCA Exam Prep — May/Jun 2026

A zero-dependency, offline-ready study hub for the BCA(DS)-IV university theory exams. Seven subjects, one dashboard, no build step. Open `index.html` in a browser or install it as a PWA on your phone.

## What's inside

Subjects listed in exam date order (Morning: 09:30–12:30):

| Exam date | Subject | Code | File |
| --- | --- | --- | --- |
| 26 May 2026 | Indian Knowledge System | VAC-104-V | [iks-exam-guide.html](iks-exam-guide.html) + [iks-crash-60.html](iks-crash-60.html) (60-min revision companion) |
| 29 May 2026 | CTRC | AEC-109-V | [ctrc-exam-guide.html](ctrc-exam-guide.html) |
| 01 Jun 2026 | DBMS | BCG-202-V | [dbms-exam-guide.html](dbms-exam-guide.html) |
| 08 Jun 2026 | Logical Organisation of Computer | BCG-208-V | [loc-exam-guide.html](loc-exam-guide.html) |
| 10 Jun 2026 | Wireless Communication | BCG-216-V | [wc-exam-guide.html](wc-exam-guide.html) |
| 12 Jun 2026 | Data Science Using R | BCA-DS-23-206 | [r-datascience-exam-guide.html](r-datascience-exam-guide.html) |
| 17 Jun 2026 | Probability & Statistics | BCD-202-V | [probstats-exam-guide.html](probstats-exam-guide.html) |

Each guide targets the **75-mark university theory paper** (Part I shorts + Part II long-form): structured unit deep-dives, full PYQ vault with model answers, frequency-ranked repeated questions, predicted questions, and a 3-hour revision plan.

[index.html](index.html) is the dashboard — subject tiles sorted by exam date, deep links into each guide, offline-ready PWA.

## How to use it

**Locally**

Just open [index.html](index.html) in any modern browser. Everything is self-contained — no server, no bundler, no `npm install`.

**As a PWA (offline on your phone)**

1. Host the folder on any static server (GitHub Pages, Netlify, Vercel, `python -m http.server`, etc.).
2. Visit the URL on your phone.
3. Tap the browser's "Add to Home Screen" option.
4. Open the installed app once while online — [sw.js](sw.js) pre-caches every guide.
5. After that it works fully offline. Bump `CACHE_VERSION` in [sw.js](sw.js) when you change any HTML/CSS/JS so the service worker invalidates the old cache.

The PWA manifest is in [manifest.json](manifest.json).

## File layout

```
.
├── index.html                         Dashboard (subject tiles sorted by exam date)
├── iks-exam-guide.html                Per-subject theory guides (75 M)
├── iks-crash-60.html                  60-min revision companion to iks-exam-guide.html
├── ctrc-exam-guide.html
├── dbms-exam-guide.html
├── loc-exam-guide.html
├── wc-exam-guide.html
├── r-datascience-exam-guide.html
├── probstats-exam-guide.html
├── manifest.json                      PWA manifest
├── sw.js                              Service worker (network-first HTML, cache-first assets)
├── icon-192.svg / icon-512.svg        App icons
└── Syllabus.pdf                       Official university syllabus (gitignored)
```

## Editing a guide

Each `*-exam-guide.html` is a standalone, hand-written HTML file with inline CSS — no shared stylesheet, no framework. Open it, edit, save, refresh. That's the whole loop.

If you change a guide's filename or add a new one:

1. Update the tile/link in [index.html](index.html).
2. Add the file to `PRECACHE_URLS` in [sw.js](sw.js).
3. Bump `CACHE_VERSION` in [sw.js](sw.js).

## Crash sheets

A crash sheet is a 60-minute, exam-morning revision companion that sits alongside a full guide. It strips the deep dives down to the absolute must-recall items: the highest-frequency PYQs, the single-line definitions, the diagrams to redraw from memory, and the mnemonics. [iks-crash-60.html](iks-crash-60.html) is the reference implementation.

Follow the same pattern for future subjects — name as `<subject>-crash-60.html`, register it in [sw.js](sw.js) `PRECACHE_URLS`, and link it from the matching row in the table above and the tile in [index.html](index.html).

## License

Personal study notes. Use, fork, remix freely.
