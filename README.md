# Scroll Screenshotter

A small Chrome extension that does one boring job really well: it scrolls a page top-to-bottom in tiny steps, takes a screenshot at every step, and hands you back a clean, sequenced ZIP of PNGs.

No stitching, no flaky "full page" merging, no third-party uploads. Just raw frames you can scrub through, drop into a video editor, paste into a doc, or feed to whatever pipeline you want.

## Why this exists

The "full page screenshot" tools that already ship with browsers and DevTools are great until they aren't:

- They choke on lazy-loaded content, virtualized lists, and long feeds.
- They flatten everything into one giant PNG that's annoying to crop or animate.
- They quietly skip sticky headers, fixed sidebars, or sections that only render after scroll.

This extension takes the opposite approach. It pretends to be a human reading the page — it scrolls a few hundred pixels, waits, takes a real `captureVisibleTab` screenshot of whatever is on screen, and repeats until it hits the bottom. The result is a folder of frames that actually represent what the user sees as they scroll. If you want a stitched image, do it later with your own tool. If you want a scrolly video, you already have the frames.

## What you get

- Manifest V3, no remote code, no analytics.
- Configurable scroll step (how many pixels per move) and delay (how long to wait between shots).
- Auto-stops when the page bottom is reached, or when the page refuses to scroll further (handy for sites with weird scroll behavior).
- Lazy-loaded content friendly: it re-measures page height on every iteration, so pages that grow as you scroll keep getting captured.
- Offscreen-document ZIP build using JSZip — files come back as `screenshots/shot-001.png`, `shot-002.png`, etc., zero-padded so they sort correctly.
- Desktop notification when the ZIP lands in your Downloads folder.

## Install (developer mode)

The extension isn't on the Chrome Web Store. Load it unpacked:

1. Clone or download this folder.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Toggle **Developer mode** on (top-right).
4. Click **Load unpacked** and pick the `scroll-screenshot-extension` folder.
5. Pin the icon so you can find it.

That's it. It works on Chromium-based browsers (Chrome, Edge, Brave, Arc, etc.).

## How to use

1. Open the page you want to capture. Scroll to the very top (or don't — the extension does it for you).
2. Click the extension icon.
3. Pick your settings:
   - **Scroll step (px)** — smaller step = more frames = smoother result. `150` is a good default. Drop to `80–100` for animation-grade smoothness, push up to `400–600` if you just want one screenshot per "section."
   - **Delay between shots (ms)** — `700` is the sweet spot. Don't go below `600`: Chrome rate-limits `captureVisibleTab` to about 2 calls per second, and going faster will start failing silently.
4. Hit **Start Capture** and **leave the tab alone**. Don't switch tabs, don't minimize the window — the extension captures whatever is actually visible on screen, so backgrounding the tab will give you blank/stale frames.
5. When it's done you'll get a notification and a `scroll-screenshots-YYYY-MM-DDTHH-MM-SS.zip` in your Downloads.

You can hit **Cancel** at any time. Already-captured shots are discarded — the extension doesn't half-finish a ZIP.

## Tuning tips

- **Too many duplicate-looking shots?** Increase the scroll step. A `1080p` viewport scrolling in `150px` chunks gives you roughly 7 overlapping frames per screen height — that's intentional, it's what makes the result smooth.
- **Missing content between frames?** Decrease the step, or bump the delay so lazy-loaded sections have time to render before the next capture.
- **Page never finishes?** Some sites (infinite feeds, virtualized lists) genuinely have no bottom. The extension auto-stops after 3 stalled scroll attempts, but you may want to cancel manually once you've got what you need.
- **Sticky headers covering content?** That's a property of the page, not the extension. The screenshots reflect exactly what's on screen, sticky bars and all. If you need the underlying content, hide the sticky element via DevTools before starting.

## What it can't do

- It can't capture `chrome://`, `edge://`, extension pages, or the Chrome Web Store. Browser policy, not laziness.
- It can't capture inside iframes that are cross-origin — only what's painted on the top-level viewport.
- It doesn't merge frames into one tall PNG. Use ImageMagick, ffmpeg, or any image editor for that:
  ```
  magick shot-*.png -append full-page.png
  ```
- It doesn't capture video, scroll horizontally, or click through interactions. It's a one-axis scroller by design.

## How it works (for the curious)

```
popup.js  ──START──▶  background.js (service worker)
                           │
                           ├─▶ scripting.executeScript: read scrollHeight, scrollTo(y)
                           ├─▶ tabs.captureVisibleTab: PNG of current viewport
                           ├─▶ loop until scrollY >= maxY (or stalled)
                           │
                           └─▶ offscreen.html (BLOBS reason)
                                     │
                                     └─▶ JSZip → blob URL → <a download> click
```

A few things worth knowing if you want to fork this:

- The capture loop lives in [background.js](background.js). Page measurements run in `MAIN` world via `chrome.scripting.executeScript`, so they see the same `window` the page does.
- ZIP construction has to happen in an offscreen document because MV3 service workers don't have `URL.createObjectURL` / `<a>` / DOM. See [offscreen.js](offscreen.js).
- Job state is mirrored to `chrome.storage.local` under `ssState`, so the popup can re-render progress even if you close and reopen it mid-run.
- JSZip is vendored in [lib/jszip.min.js](lib/jszip.min.js) — no CDN, no remote fetch, MV3-friendly.

## Permissions, and why each one is here

| Permission | Used for |
|---|---|
| `activeTab`, `tabs` | Find the current tab and its window for `captureVisibleTab`. |
| `scripting` | Read scroll metrics and call `window.scrollTo` in the page. |
| `downloads` | Save the ZIP. (Triggered indirectly via the offscreen `<a>` click.) |
| `offscreen` | Build the ZIP blob outside the service worker. |
| `storage` | Persist progress so the popup can reopen mid-run. |
| `notifications` | Tell you when the ZIP is ready or something blew up. |
| `host_permissions: <all_urls>` | Required so `captureVisibleTab` works on any site you point it at. Nothing leaves your machine. |

## File layout

```
scroll-screenshot-extension/
├── manifest.json        Manifest V3 declaration
├── background.js        Service worker — capture loop, scroll control, state
├── popup.html / popup.js  280px popup UI with step/delay inputs + progress bar
├── offscreen.html       Hidden document that owns the DOM/Blob APIs
├── offscreen.js         Builds the ZIP and triggers the download
├── lib/jszip.min.js     Vendored JSZip
└── icons/               16 / 48 / 128 px action icons
```

## Troubleshooting

- **"Cannot capture this page (browser-internal URL)."** You're on `chrome://`, the Web Store, or an extension page. Switch to a normal site.
- **"Offscreen document did not respond."** Reload the extension from `chrome://extensions`. This usually means the offscreen page got torn down between runs.
- **First few shots look blank.** Some sites delay paint until first interaction. Click somewhere on the page, scroll once manually, then start the capture.
- **ZIP is empty / has fewer shots than expected.** You probably switched tabs mid-run. `captureVisibleTab` only works on the foreground tab — if it loses focus, captures fail. Keep the tab visible.
- **Progress bar stuck at 95%.** It's zipping. Big captures (hundreds of frames at 1080p) can take 10–30 seconds to compress. Give it a moment before assuming it's hung.

## License

Use it, fork it, ship it. No warranty, no telemetry, no strings.
