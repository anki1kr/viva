// Scroll Screenshotter — simple, robust version.
// Scrolls the active tab in small steps and captures a screenshot at each step.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pad = (n, w) => String(n).padStart(w, '0');

let job = null; // { tabId, windowId, cancelled, shots: [base64,...], step, delay, maxY, scrollY }

async function setState(patch) {
  const cur = (await chrome.storage.local.get('ssState')).ssState || {};
  const next = { ...cur, ...patch };
  await chrome.storage.local.set({ ssState: next });
  return next;
}
async function clearState() { await chrome.storage.local.remove('ssState'); }

async function scriptEval(tabId, fn, args = []) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId, allFrames: false },
    func: fn,
    args,
    world: 'MAIN',
  });
  return result;
}

async function getMetrics(tabId) {
  return scriptEval(tabId, () => {
    const d = document.documentElement, b = document.body;
    const sh = Math.max(d.scrollHeight, b ? b.scrollHeight : 0,
                        d.offsetHeight, b ? b.offsetHeight : 0);
    return {
      innerHeight: window.innerHeight,
      scrollHeight: sh,
      maxY: Math.max(0, sh - window.innerHeight),
      scrollY: window.scrollY || window.pageYOffset || 0,
    };
  });
}
async function scrollTo(tabId, y) {
  return scriptEval(tabId, (yy) => {
    window.scrollTo(0, yy);
    return { y: window.scrollY || window.pageYOffset || 0 };
  }, [y]);
}

async function captureViewport(windowId) {
  // captureVisibleTab is rate-limited (~2/sec). Caller paces with delay >= 600ms.
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(windowId, { format: 'png' }, (dataUrl) => {
      const err = chrome.runtime.lastError;
      if (err) reject(new Error(err.message));
      else if (!dataUrl) reject(new Error('captureVisibleTab returned empty'));
      else resolve(dataUrl);
    });
  });
}

async function ensureOffscreen() {
  if (chrome.runtime.getContexts) {
    const ctxs = await chrome.runtime.getContexts({ contextTypes: ['OFFSCREEN_DOCUMENT'] });
    if (ctxs && ctxs.length) return;
  }
  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['BLOBS'],
      justification: 'Build a ZIP of captured screenshots and trigger a download.',
    });
  } catch (e) {
    if (!String(e.message || e).includes('Only a single offscreen document')) throw e;
  }
}
async function pingOffscreen(timeoutMs = 5000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try {
      const r = await chrome.runtime.sendMessage({ type: 'OFFSCREEN_PING' });
      if (r && r.ok) return true;
    } catch {}
    await sleep(120);
  }
  throw new Error('Offscreen document did not respond.');
}

async function buildAndDownload(shots) {
  await ensureOffscreen();
  await pingOffscreen();
  const files = shots.map((b64, i) => ({
    name: `shot-${pad(i + 1, Math.max(3, String(shots.length).length))}.png`,
    base64: b64,
  }));
  const r = await chrome.runtime.sendMessage({ type: 'BUILD_ZIP', files });
  if (!r || r.error) throw new Error((r && r.error) || 'ZIP build failed.');
}

function dataUrlToBase64(dataUrl) {
  const i = dataUrl.indexOf(',');
  return i >= 0 ? dataUrl.slice(i + 1) : dataUrl;
}

async function notify(title, message) {
  try {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title, message,
    });
  } catch {}
}

async function runJob(step, delay) {
  if (job && job.running) throw new Error('Already running.');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) throw new Error('No active tab.');
  if (/^chrome:|^edge:|^chrome-extension:|chromewebstore\.google\.com/.test(tab.url || '')) {
    throw new Error('Cannot capture this page (browser-internal URL).');
  }

  job = { tabId: tab.id, windowId: tab.windowId, cancelled: false, shots: [], step, delay, running: true };
  await setState({ running: true, phase: 'capturing', count: 0, scrollY: 0, maxY: 0 });

  // settle initial state
  await scrollTo(job.tabId, 0);
  await sleep(400);

  const m0 = await getMetrics(job.tabId);
  let maxY = m0.maxY;
  await setState({ maxY });

  let y = 0;
  let lastY = -1;
  let stalledRounds = 0;

  while (!job.cancelled) {
    // capture current viewport
    let dataUrl;
    try {
      dataUrl = await captureViewport(job.windowId);
    } catch (e) {
      // tab might have been switched; wait and retry once
      await sleep(800);
      dataUrl = await captureViewport(job.windowId);
    }
    job.shots.push(dataUrlToBase64(dataUrl));
    await setState({ count: job.shots.length, scrollY: y, maxY });

    // recompute maxY each iteration (lazy-loaded content can grow the page)
    const m = await getMetrics(job.tabId);
    maxY = Math.max(maxY, m.maxY);

    if (y >= maxY) break; // bottom reached

    const nextY = Math.min(maxY, y + step);
    await scrollTo(job.tabId, nextY);
    await sleep(delay);

    const after = await getMetrics(job.tabId);
    if (after.scrollY === lastY) {
      stalledRounds++;
      if (stalledRounds >= 3) break; // page refuses to scroll further
    } else {
      stalledRounds = 0;
    }
    lastY = after.scrollY;
    y = after.scrollY;
    maxY = Math.max(maxY, after.maxY);
    await setState({ scrollY: y, maxY });
  }

  if (job.cancelled) {
    await setState({ running: false, phase: 'error', error: 'Cancelled by user', count: job.shots.length });
    job.running = false;
    return;
  }

  await setState({ phase: 'zipping', count: job.shots.length });
  try {
    await buildAndDownload(job.shots);
    await setState({ running: false, phase: 'done', count: job.shots.length });
    notify('Screenshots ready', `${job.shots.length} shots saved as ZIP to Downloads.`);
  } catch (e) {
    await setState({ running: false, phase: 'error', error: String(e.message || e) });
    notify('Screenshot ZIP failed', String(e.message || e));
  } finally {
    job.running = false;
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'START') {
    runJob(msg.step, msg.delay).catch(async (e) => {
      await setState({ running: false, phase: 'error', error: String(e.message || e) });
    });
    sendResponse({ ok: true });
    return false;
  }
  if (msg.type === 'CANCEL') {
    if (job) job.cancelled = true;
    sendResponse({ ok: true });
    return false;
  }
});

// reset state on extension load so stale "running" never sticks
clearState();
