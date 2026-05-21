# BCA Exam Prep — 2nd Sessional

A zero-dependency, offline-ready study hub for the BCA-IV 2nd Sessional. Seven subjects, one dashboard, no build step. Open `index.html` in a browser or install it as a PWA on your phone.

## What's inside

| # | Subject | Code | File |
| --- | --- | --- | --- |
| 1 | DBMS | BCG-202-V | [dbms-exam-guide.html](dbms-exam-guide.html) |
| 2 | Probability & Statistics | BCD-202-V | [probstats-exam-guide.html](probstats-exam-guide.html) |
| 3 | Data Science Using R | BCD-204-V | [r-datascience-exam-guide.html](r-datascience-exam-guide.html) |
| 4 | Logical Organisation of Computer | BCG-208-V | [loc-exam-guide.html](loc-exam-guide.html) |
| 5 | Wireless Communication | BCG-216-V | [wc-exam-guide.html](wc-exam-guide.html) |
| 6 | CTRC | AEC-109-V | [ctrc-exam-guide.html](ctrc-exam-guide.html) |
| 7 | Indian Knowledge System | VAC-104-V | [iks-exam-guide.html](iks-exam-guide.html) |

Each guide targets the **75-mark university theory paper** (Part I shorts + Part II long-form), engineered for senior-prof rigor: structured deep-dives, PYQ vault sorted unit ASC / year DESC, frequency-ranked repeated questions, and pattern-predicted questions for the next exam.

[index.html](index.html) is the dashboard — exam countdown, subject tiles, deep links into each guide.

## How to use it

**Locally**

Just open [index.html](index.html) in any modern browser. Everything is self-contained — no server, no bundler, no `npm install`.

**As a PWA (offline on your phone)**

1. Host the folder on any static server (GitHub Pages, Netlify, Vercel, `python -m http.server`, etc.).
2. Visit the URL on your phone.
3. Tap the browser's "Add to Home Screen" option.
4. Open the installed app once while online — [sw.js](sw.js) pre-caches every guide.
5. After that it works fully offline. Bump `CACHE_VERSION` in [sw.js](sw.js) when you change any HTML/CSS/JS so the service worker invalidates the old cache.

The PWA manifest is in [manifest.json](manifest.json). Three home-screen shortcuts (DBMS, WC, LOC) are pre-wired.

## File layout

```
.
├── index.html                       Dashboard (countdown + subject tiles)
├── dbms-study-guide.html            Per-subject guides
├── wc-study-guide.html
├── loc-study-guide.html
├── r-datascience-study-guide.html
├── ctrc-study-guide.html
├── probstats-study-guide.html
├── iks-study-guide.html
├── manifest.json                    PWA manifest
├── sw.js                            Service worker (cache-first, offline)
├── icon-192.svg / icon-512.svg      App icons
└── reference/                       Personal PYQs & syllabi (gitignored)
```

## Editing a guide

Each `*-study-guide.html` is a standalone, hand-written HTML file with inline CSS — no shared stylesheet, no framework. Open it, edit, save, refresh. That's the whole loop.

If you change a guide's filename or add a new one:

1. Update the tile/link in [index.html](index.html).
2. Add the file to `PRECACHE_URLS` in [sw.js](sw.js).
3. Bump `CACHE_VERSION` in [sw.js](sw.js).

## Reference materials

The `reference/` folder holds PYQs, syllabi, and scans used while writing the guides. It's gitignored on purpose — keep your own copies locally and don't commit copyrighted university material.

## License

Personal study notes. Use, fork, remix freely.
