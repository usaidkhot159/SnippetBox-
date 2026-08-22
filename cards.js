import { store } from './store.js';
import { openModal } from './modal.js';
import { openViewModal } from './viewModal.js';
import { showToast } from './toast.js';
import { renderSidebar } from './sidebar.js';
import { getLangClass } from './utils.js';

export function renderCards() {
  const grid = document.getElementById('cards-grid');
  const empty = document.getElementById('empty-state');
  const snippets = store.getFiltered();

  // Clear existing cards (keep empty state el)
  [...grid.children].forEach(el => {
    if (!el.classList.contains('empty-state')) el.remove();
  });

  if (snippets.length === 0) {
    empty.style.display = 'flex';
    return;
  }
  empty.style.display = 'none';

  snippets.forEach((snippet, idx) => {
    const card = buildCard(snippet, idx);
    grid.appendChild(card);
  });
}

function buildCard(snippet, idx) {
  const card = document.createElement('div');
  card.className = 'snippet-card' + (snippet.pinned ? ' pinned' : '');
  card.dataset.id = snippet.id;
  card.style.animationDelay = `${Math.min(idx * 40, 400)}ms`;

  const langClass = getLangClass(snippet.language);
  const tagsHtml = (snippet.tags || []).slice(0, 3).map(t =>
    `<span class="card-tag">#${t}</span>`
  ).join('');

  const codePreview = escapeHtml(snippet.code.slice(0, 300));

  card.innerHTML = `
    <div class="card-header">
      <div class="card-header-left">
        <span class="card-lang-badge ${langClass}">${snippet.language}</span>
        <span class="card-title">${escapeHtml(snippet.title)}</span>
      </div>
      <div class="card-actions">
        <button class="card-action-btn fav-btn ${snippet.favorite ? 'active' : ''}" 
          title="Favorite" data-action="fav">⭐</button>
        <button class="card-action-btn pin-btn ${snippet.pinned ? 'active' : ''}" 
          title="Pin" data-action="pin">📌</button>
        <button class="card-action-btn edit-btn" 
          title="Edit" data-action="edit">✏️</button>
        <button class="card-action-btn del-btn" 
          title="Delete" data-action="del">🗑</button>
      </div>
    </div>

    <div class="card-code-preview">
      <pre><code class="language-${snippet.language}">${codePreview}</code></pre>
      <div class="card-code-fade"></div>
    </div>

    <div class="card-footer">
      <div class="card-tags">${tagsHtml}</div>
      <button class="card-copy-btn" data-action="copy">
        <span>⎘</span> Copy
      </button>
    </div>
    <div class="card-meta">
      ${snippet.copyCount > 0 ? `<span class="card-copy-count">📋 ${snippet.copyCount} cop${snippet.copyCount === 1 ? 'y' : 'ies'}</span>` : ''}
      ${snippet.pinned ? `<span class="card-pin-badge">📌 Pinned</span>` : ''}
    </div>
  `;

  // Syntax highlight
  const codeEl = card.querySelector('code');
  if (window.hljs && codeEl) {
    window.hljs.highlightElement(codeEl);
  }

  // Events
  card.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;

    if (action === 'copy') {
      e.stopPropagation();
      copySnippet(snippet.id, e.target.closest('.card-copy-btn'));
      return;
    }
    if (action === 'fav') {
      e.stopPropagation();
      const isFav = store.toggleFavorite(snippet.id);
      e.target.closest('.fav-btn').classList.toggle('active', isFav);
      renderSidebar();
      return;
    }
    if (action === 'pin') {
      e.stopPropagation();
      const isPinned = store.togglePin(snippet.id);
      card.classList.toggle('pinned', isPinned);
      e.target.closest('.pin-btn').classList.toggle('active', isPinned);
      renderSidebar();
      renderCards();
      return;
    }
    if (action === 'edit') {
      e.stopPropagation();
      openModal(snippet.id);
      return;
    }
    if (action === 'del') {
      e.stopPropagation();
      if (confirm(`Delete "${snippet.title}"?`)) {
        store.delete(snippet.id);
        renderCards();
        renderSidebar();
        showToast('Snippet deleted', 'info');
      }
      return;
    }

    // Click card → view modal
    openViewModal(snippet.id);
  });

  return card;
}

export async function copySnippet(id, btnEl) {
  const snippet = store.getById(id);
  if (!snippet) return;

  try {
    await navigator.clipboard.writeText(snippet.code);
    store.incrementCopy(id);
    showToast('✓ Copied to clipboard!', 'success');

    if (btnEl) {
      btnEl.innerHTML = '<span class="copy-check">✓</span> Copied';
      btnEl.classList.add('copied');
      setTimeout(() => {
        btnEl.innerHTML = '<span>⎘</span> Copy';
        btnEl.classList.remove('copied');
      }, 2000);
    }
  } catch {
    showToast('Copy failed — please try manually', 'error');
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
