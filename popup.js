const startBtn = document.getElementById('start');
const cancelBtn = document.getElementById('cancel');
const stepEl = document.getElementById('step');
const delayEl = document.getElementById('delay');
const statusEl = document.getElementById('status');
const bar = document.getElementById('bar');

function render(s) {
  if (!s) { statusEl.textContent = 'Idle.'; bar.style.width = '0%'; startBtn.disabled = false; return; }
  startBtn.disabled = !!s.running;
  if (s.phase === 'capturing') {
    statusEl.textContent = `Capturing… ${s.count} shot(s) · scrollY=${s.scrollY ?? '?'} / ${s.maxY ?? '?'}`;
    if (s.maxY) bar.style.width = Math.min(100, Math.round((s.scrollY / s.maxY) * 100)) + '%';
  } else if (s.phase === 'zipping') {
    statusEl.textContent = `Building ZIP from ${s.count} shots…`;
    bar.style.width = '95%';
  } else if (s.phase === 'done') {
    statusEl.textContent = `✅ Done. ${s.count} shots → Downloads.`;
    bar.style.width = '100%';
  } else if (s.phase === 'error') {
    statusEl.textContent = '❌ ' + (s.error || 'Unknown error');
    bar.style.width = '0%';
  } else {
    statusEl.textContent = 'Idle.';
    bar.style.width = '0%';
  }
}

async function refresh() {
  const { ssState } = await chrome.storage.local.get('ssState');
  render(ssState);
}

startBtn.addEventListener('click', async () => {
  startBtn.disabled = true;
  const step = parseInt(stepEl.value, 10) || 150;
  const delay = Math.max(600, parseInt(delayEl.value, 10) || 700);
  statusEl.textContent = 'Starting…';
  const res = await chrome.runtime.sendMessage({ type: 'START', step, delay });
  if (res && res.error) { statusEl.textContent = '❌ ' + res.error; startBtn.disabled = false; }
});

cancelBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'CANCEL' });
  statusEl.textContent = 'Cancelling…';
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.ssState) render(changes.ssState.newValue);
});

refresh();
