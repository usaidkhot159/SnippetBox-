import { store } from './store.js';
import { openModal } from './modal.js';
import { copySnippet } from './cards.js';
import { getLangClass } from './utils.js';
import { showToast } from './toast.js';

export function initViewModal() {
  document.getElementById('view-modal-close-btn').addEventListener('click', closeViewModal);
  document.getElementById('view-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeViewModal();
  });
}

export function openViewModal(id) {
  const snippet = store.getById(id);
  if (!snippet) return;

  store.incrementCopy(id); // track "last used" via open

  // Lang badge in header
  const langBadge = document.getElementById('view-modal-lang');
  langBadge.textContent = snippet.language;
  langBadge.className = `modal-lang-badge ${getLangClass(snippet.language)}`;

  // Related snippets by shared tags
  const related = getRelated(snippet);

  const body = document.getElementById('view-modal-body');
  body.innerHTML = buildViewBody(snippet, related);

  // Highlight code
  const codeEl = body.querySelector('code');
  if (window.hljs && codeEl) {
    window.hljs.highlightElement(codeEl);
  }

  // Copy button
  body.querySelector('#view-copy-btn').addEventListener('click', async function () {
    try {
      await navigator.clipboard.writeText(snippet.code);
      store.incrementCopy(id);
      this.textContent = '✓ Copied!';
      this.classList.add('copied');
      showToast('✓ Copied to clipboard!', 'success');
      setTimeout(() => {
        this.textContent = '⎘ Copy Code';
        this.classList.remove('copied');
      }, 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  });

  // Edit button
  const editBtn = body.querySelector('#view-edit-btn');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      closeViewModal();
      openModal(id);
    });
  }

  // Related item clicks
  body.querySelectorAll('.related-item').forEach(el => {
    el.addEventListener('click', () => {
      closeViewModal();
      setTimeout(() => openViewModal(el.dataset.id), 150);
    });
  });

  const overlay = document.getElementById('view-modal');
  overlay.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeViewModal() {
  const overlay = document.getElementById('view-modal');
  overlay.classList.remove('visible');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function buildViewBody(snippet, related) {
  const tagsHtml = (snippet.tags || []).map(t =>
    `<span class="card-tag">#${escHtml(t)}</span>`
  ).join('');

  const relatedHtml = related.length > 0
    ? `<div class="view-related">
        <div class="view-related-title">Related Snippets</div>
        <div class="related-list">
          ${related.map(r => `
            <div class="related-item" data-id="${r.id}">
              → ${escHtml(r.title)}
            </div>
          `).join('')}
        </div>
      </div>`
    : '';

  return `
    <div class="view-snippet-title">${escHtml(snippet.title)}</div>

    <div class="view-snippet-meta">
      <span class="card-lang-badge ${getLangClass(snippet.language)}">${snippet.language}</span>
      <span class="view-category-badge">📂 ${escHtml(snippet.category)}</span>
      ${snippet.favorite ? '<span class="view-category-badge">⭐ Favorite</span>' : ''}
      ${snippet.pinned   ? '<span class="view-category-badge">📌 Pinned</span>' : ''}
    </div>

    ${snippet.description
      ? `<p class="view-desc">${escHtml(snippet.description)}</p>`
      : ''}

    <div class="view-code-block">
      <div class="view-code-topbar">
        <span class="view-code-lang">${snippet.language}</span>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="view-copy-btn" id="view-copy-btn">⎘ Copy Code</button>
          <button class="btn-cancel" id="view-edit-btn" style="font-size:0.75rem;padding:5px 10px;">✏️ Edit</button>
        </div>
      </div>
      <pre><code class="language-${snippet.language}">${escHtml(snippet.code)}</code></pre>
    </div>

    ${tagsHtml ? `<div class="view-tags">${tagsHtml}</div>` : ''}

    ${snippet.copyCount > 0
      ? `<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-muted);">
           📋 Copied ${snippet.copyCount} time${snippet.copyCount === 1 ? '' : 's'}
         </div>`
      : ''}

    ${relatedHtml}
  `;
}

function getRelated(snippet) {
  if (!snippet.tags?.length) return [];
  const all = store.getAll().filter(s => s.id !== snippet.id);
  return all
    .map(s => ({
      ...s,
      sharedTags: (s.tags || []).filter(t => snippet.tags.includes(t)).length,
    }))
    .filter(s => s.sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, 5);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
