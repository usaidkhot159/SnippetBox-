import { store } from './store.js';
import { openModal } from './modal.js';
import { openViewModal } from './viewModal.js';
import { showToast } from './toast.js';

const COMMANDS = [
  { icon: '+', label: 'Create new snippet', sub: 'Ctrl+N', action: () => openModal() },
  { icon: '⭐', label: 'View favorites', sub: 'Filter', action: () => applyFilter('favorites') },
  { icon: '📌', label: 'View pinned snippets', sub: 'Filter', action: () => applyFilter('pinned') },
  { icon: '🕐', label: 'Recently used', sub: 'Filter', action: () => applyFilter('recent') },
  { icon: '◈',  label: 'All snippets', sub: 'Filter', action: () => applyFilter('all') },
  { icon: '📊', label: 'Statistics', sub: '', action: () => document.getElementById('stats-btn').click() },
  { icon: '📦', label: 'Export snippets', sub: '', action: () => document.getElementById('export-btn').click() },
  { icon: '📥', label: 'Import snippets', sub: '', action: () => document.getElementById('import-btn').click() },
];

let focusedIdx = -1;
let currentResults = [];

export function initCommandPalette() {
  const overlay  = document.getElementById('command-palette-overlay');
  const input    = document.getElementById('palette-input');
  const results  = document.getElementById('palette-results');

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePalette();
  });

  input.addEventListener('input', () => {
    focusedIdx = -1;
    renderPaletteResults(input.value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closePalette(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusedIdx = Math.min(focusedIdx + 1, currentResults.length - 1);
      highlightFocused(results);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedIdx = Math.max(focusedIdx - 1, 0);
      highlightFocused(results);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const idx = focusedIdx >= 0 ? focusedIdx : 0;
      if (currentResults[idx]) executeResult(currentResults[idx]);
      return;
    }
  });
}

export function openPalette() {
  const overlay = document.getElementById('command-palette-overlay');
  const input   = document.getElementById('palette-input');
  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  input.value = '';
  focusedIdx = -1;
  renderPaletteResults('');
  setTimeout(() => input.focus(), 50);
}

export function closePalette() {
  const overlay = document.getElementById('command-palette-overlay');
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
}

function renderPaletteResults(query) {
  const container = document.getElementById('palette-results');
  const q = query.trim().toLowerCase();
  currentResults = [];

  let html = '';

  if (!q) {
    // Show commands
    html += `<div class="palette-section-label">Commands</div>`;
    COMMANDS.forEach((cmd, i) => {
      currentResults.push({ type: 'command', ...cmd });
      html += paletteItemHTML(cmd.icon, cmd.label, cmd.sub, '', i);
    });
  } else {
    // Search snippets
    const snippets = store.getAll().filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q)) ||
      s.language.toLowerCase().includes(q)
    ).slice(0, 8);

    // Filter commands
    const matchedCmds = COMMANDS.filter(c => c.label.toLowerCase().includes(q));

    if (matchedCmds.length > 0) {
      html += `<div class="palette-section-label">Commands</div>`;
      matchedCmds.forEach(cmd => {
        currentResults.push({ type: 'command', ...cmd });
        html += paletteItemHTML(cmd.icon, cmd.label, cmd.sub, q, currentResults.length - 1);
      });
    }

    if (snippets.length > 0) {
      html += `<div class="palette-section-label">Snippets</div>`;
      snippets.forEach(s => {
        currentResults.push({ type: 'snippet', id: s.id, title: s.title, lang: s.language });
        html += paletteItemHTML('◈', s.title, s.category, q, currentResults.length - 1, s.language);
      });
    }

    if (currentResults.length === 0) {
      html = `<div class="palette-empty">No results for "${escHtml(query)}"</div>`;
    }
  }

  container.innerHTML = html;

  container.querySelectorAll('.palette-item').forEach(item => {
    const idx = parseInt(item.dataset.idx);
    item.addEventListener('click', () => executeResult(currentResults[idx]));
    item.addEventListener('mouseenter', () => {
      focusedIdx = idx;
      highlightFocused(container);
    });
  });
}

function paletteItemHTML(icon, label, sub, query, idx, lang) {
  const highlightedLabel = query
    ? label.replace(new RegExp(`(${escapeRegex(query)})`, 'gi'), '<span class="palette-highlight">$1</span>')
    : escHtml(label);

  const langBadge = lang ? `<span class="palette-item-lang">${escHtml(lang)}</span>` : '';

  return `
    <div class="palette-item" data-idx="${idx}">
      <div class="palette-item-icon">${icon}</div>
      <div class="palette-item-text">
        <div class="palette-item-title">${highlightedLabel}</div>
        ${sub ? `<div class="palette-item-sub">${escHtml(sub)}</div>` : ''}
      </div>
      ${langBadge}
    </div>
  `;
}

function highlightFocused(container) {
  container.querySelectorAll('.palette-item').forEach((item, i) => {
    item.classList.toggle('focused', i === focusedIdx);
  });
}

function executeResult(result) {
  closePalette();
  if (result.type === 'command') {
    result.action();
  } else if (result.type === 'snippet') {
    openViewModal(result.id);
  }
}

function applyFilter(filter) {
  store.setFilter(filter);
  document.querySelectorAll('.nav-item').forEach(i => {
    i.classList.toggle('active', i.dataset.filter === filter);
  });
  const titles = { all: 'All Snippets', favorites: '⭐ Favorites', pinned: '📌 Pinned', recent: '🕐 Recently Used' };
  document.getElementById('view-title').textContent = titles[filter] || filter;
  import('./cards.js').then(m => m.renderCards());
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
