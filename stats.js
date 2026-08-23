import { store } from './store.js';
import { openViewModal } from './viewModal.js';
import { getLangClass } from './utils.js';

export function initStatsPanel() {
  document.getElementById('stats-btn').addEventListener('click', () => {
    const panel = document.getElementById('stats-panel');
    const isVisible = panel.classList.contains('visible');
    if (isVisible) {
      panel.classList.remove('visible');
    } else {
      renderStats();
      panel.classList.add('visible');
      panel.setAttribute('aria-hidden', 'false');
    }
  });
}

function renderStats() {
  const inner = document.getElementById('stats-panel-inner');
  const all = store.getAll();
  const langs = store.getAllLanguages();
  const topCopied = store.getTopCopied(5);
  const totalCopies = all.reduce((sum, s) => sum + (s.copyCount || 0), 0);
  const maxLangCount = Math.max(...Object.values(langs), 1);

  const langBars = Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([lang, count]) => {
      const pct = Math.round((count / maxLangCount) * 100);
      return `
        <div class="stats-bar-item">
          <div class="stats-bar-row">
            <span class="stats-bar-lang ${getLangClass(lang)}">${lang}</span>
            <span class="stats-bar-count">${count}</span>
          </div>
          <div class="stats-bar-track">
            <div class="stats-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');

  const topCopiedHtml = topCopied.length === 0
    ? `<div style="color:var(--text-muted);font-size:0.8rem;">No copies yet</div>`
    : topCopied.map((s, i) => `
        <div class="stats-ranked-item" data-id="${s.id}">
          <span class="stats-rank-num">${i + 1}</span>
          <span class="stats-rank-title">${escHtml(s.title)}</span>
          <span class="stats-rank-copies">${s.copyCount} cop${s.copyCount === 1 ? 'y' : 'ies'}</span>
        </div>
      `).join('');

  // Recently used
  const recent = [...all]
    .filter(s => s.lastUsed)
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, 5);

  const recentHtml = recent.length === 0
    ? `<div style="color:var(--text-muted);font-size:0.8rem;">Nothing used yet</div>`
    : recent.map(s => {
        const ago = timeAgo(s.lastUsed);
        return `
          <div class="stats-ranked-item" data-id="${s.id}">
            <span class="stats-rank-num">🕐</span>
            <span class="stats-rank-title">${escHtml(s.title)}</span>
            <span class="stats-rank-copies">${ago}</span>
          </div>
        `;
      }).join('');

  inner.innerHTML = `
    <div class="stats-panel-header">
      <span class="stats-panel-title">📊 Statistics</span>
      <button class="stats-close-btn" id="stats-close-btn">✕</button>
    </div>
    <div class="stats-body">

      <div>
        <div class="stats-section-label">Overview</div>
        <div class="stats-big-grid">
          <div class="stat-big-card">
            <div class="stat-big-number">${all.length}</div>
            <div class="stat-big-label">Total Snippets</div>
          </div>
          <div class="stat-big-card">
            <div class="stat-big-number">${totalCopies}</div>
            <div class="stat-big-label">Total Copies</div>
          </div>
          <div class="stat-big-card">
            <div class="stat-big-number">${all.filter(s => s.favorite).length}</div>
            <div class="stat-big-label">Favorites</div>
          </div>
          <div class="stat-big-card">
            <div class="stat-big-number">${Object.keys(langs).length}</div>
            <div class="stat-big-label">Languages</div>
          </div>
        </div>
      </div>

      <div>
        <div class="stats-section-label">By Language</div>
        <div class="stats-bar-list">${langBars}</div>
      </div>

      <div>
        <div class="stats-section-label">Most Copied</div>
        <div class="stats-ranked-list" id="top-copied-list">${topCopiedHtml}</div>
      </div>

      <div>
        <div class="stats-section-label">Recently Used</div>
        <div class="stats-ranked-list" id="recent-list">${recentHtml}</div>
      </div>

    </div>
  `;

  // Close button
  inner.querySelector('#stats-close-btn').addEventListener('click', () => {
    document.getElementById('stats-panel').classList.remove('visible');
  });

  // Clickable items
  inner.querySelectorAll('.stats-ranked-item[data-id]').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('stats-panel').classList.remove('visible');
      openViewModal(el.dataset.id);
    });
  });
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
