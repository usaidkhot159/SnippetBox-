import { store } from './store.js';
import { showToast } from './toast.js';
import { openViewModal } from './viewModal.js';

export function renderSnippetOfTheDay() {
  const banner = document.getElementById('sotd-banner');
  const snippets = store.getAll();
  if (snippets.length === 0) { banner.classList.remove('visible'); return; }

  // Pick based on day seed so it changes daily but is consistent within the day
  const dayKey = new Date().toDateString();
  const stored = localStorage.getItem('snippetbox_sotd');
  let sotd;

  try {
    const parsed = JSON.parse(stored);
    sotd = parsed.day === dayKey ? store.getById(parsed.id) : null;
  } catch { sotd = null; }

  if (!sotd) {
    const seed = hashStr(dayKey) % snippets.length;
    sotd = snippets[Math.abs(seed)];
    localStorage.setItem('snippetbox_sotd', JSON.stringify({ day: dayKey, id: sotd.id }));
  }

  banner.innerHTML = `
    <div>
      <div class="sotd-label">⚡ Snippet of the Day</div>
      <div class="sotd-title">${escHtml(sotd.title)}</div>
      ${sotd.description ? `<div class="sotd-desc">${escHtml(sotd.description.slice(0, 80))}${sotd.description.length > 80 ? '…' : ''}</div>` : ''}
    </div>
    <div style="display:flex;gap:8px;align-items:center;">
      <button class="btn-cancel" id="sotd-view-btn" style="font-size:0.75rem;padding:6px 12px;">View</button>
      <button class="sotd-copy-btn" id="sotd-copy-btn">⎘ Copy</button>
    </div>
  `;

  banner.classList.add('visible');

  banner.querySelector('#sotd-copy-btn').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(sotd.code);
      store.incrementCopy(sotd.id);
      showToast('✓ Copied!', 'success');
    } catch { showToast('Copy failed', 'error'); }
  });

  banner.querySelector('#sotd-view-btn').addEventListener('click', () => {
    openViewModal(sotd.id);
  });
}

function hashStr(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
