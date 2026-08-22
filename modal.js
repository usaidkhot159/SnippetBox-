import { store } from './store.js';
import { renderCards } from './cards.js';
import { renderSidebar } from './sidebar.js';
import { showToast } from './toast.js';
import { LANGUAGES, CATEGORIES } from './constants.js';
import { suggestTags } from './tagSuggester.js';

let editingId = null;
let currentTags = [];

export function initModal() {
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('snippet-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
}

export function openModal(snippetId = null) {
  editingId = snippetId;
  const snippet = snippetId ? store.getById(snippetId) : null;
  currentTags = snippet ? [...(snippet.tags || [])] : [];

  document.getElementById('modal-title-label').textContent = snippet ? 'Edit Snippet' : 'New Snippet';

  const body = document.getElementById('modal-body');
  body.innerHTML = buildForm(snippet);

  // Wire up tags input
  initTagsInput(snippet);

  // Wire up code textarea → live tag suggestions
  const codeArea = body.querySelector('#form-code');
  const titleInput = body.querySelector('#form-title');
  codeArea.addEventListener('input', () => updateTagSuggestions(codeArea.value, titleInput.value));
  titleInput.addEventListener('input', () => updateTagSuggestions(codeArea.value, titleInput.value));

  // Update code editor bar label
  const langSelect = body.querySelector('#form-lang');
  const editorLang = body.querySelector('#editor-lang-label');
  langSelect.addEventListener('change', () => {
    editorLang.textContent = langSelect.value;
  });

  // Cancel
  body.querySelector('#form-cancel').addEventListener('click', closeModal);

  // Save
  body.querySelector('#form-save').addEventListener('click', saveSnippet);

  // Handle Tab in textarea
  codeArea.addEventListener('keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = codeArea.selectionStart;
      const end = codeArea.selectionEnd;
      codeArea.value = codeArea.value.slice(0, start) + '  ' + codeArea.value.slice(end);
      codeArea.selectionStart = codeArea.selectionEnd = start + 2;
    }
  });

  openOverlay('snippet-modal');
}

function buildForm(snippet) {
  const langOptions = LANGUAGES.map(l =>
    `<option value="${l}" ${snippet?.language === l ? 'selected' : ''}>${l}</option>`
  ).join('');

  const catOptions = CATEGORIES.map(c =>
    `<option value="${c}" ${snippet?.category === c ? 'selected' : ''}>${c}</option>`
  ).join('');

  return `
    <div class="form-group">
      <label class="form-label" for="form-title">Title</label>
      <input class="form-input" id="form-title" type="text" 
        placeholder="e.g. JavaScript Debounce" 
        value="${escHtml(snippet?.title || '')}" autocomplete="off" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label class="form-label" for="form-lang">Language</label>
        <select class="form-select" id="form-lang">
          ${langOptions}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="form-cat">Category</label>
        <select class="form-select" id="form-cat">
          ${catOptions}
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Tags</label>
      <div class="tags-input-wrapper" id="tags-wrapper"></div>
      <div class="tag-suggestions" id="tag-suggestions"></div>
    </div>

    <div class="form-group">
      <label class="form-label" for="form-code">Code</label>
      <div class="code-editor-wrap">
        <div class="code-editor-bar">
          <span id="editor-lang-label" class="code-editor-lang">${snippet?.language || 'javascript'}</span>
        </div>
        <textarea class="code-textarea" id="form-code" 
          placeholder="Paste your code here…" 
          spellcheck="false">${escHtml(snippet?.code || '')}</textarea>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="form-desc">Description</label>
      <textarea class="form-textarea" id="form-desc" 
        rows="2" 
        placeholder="What does this snippet do?">${escHtml(snippet?.description || '')}</textarea>
    </div>

    <div class="modal-submit-row">
      <button class="btn-cancel" id="form-cancel">Cancel</button>
      <button class="btn-save" id="form-save">
        ${snippet ? 'Save Changes' : '⚡ Save Snippet'}
      </button>
    </div>
  `;
}

function initTagsInput(snippet) {
  const wrapper = document.getElementById('tags-wrapper');
  renderTagPills(wrapper);

  // Text input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tags-text-input';
  input.placeholder = currentTags.length === 0 ? 'Add tags (press Enter or comma)…' : '';
  wrapper.appendChild(input);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input.value.trim().toLowerCase().replace(/[^a-z0-9\-_]/g, ''));
      input.value = '';
      input.placeholder = '';
      renderTagPills(wrapper, input);
    }
    if (e.key === 'Backspace' && input.value === '' && currentTags.length > 0) {
      currentTags.pop();
      renderTagPills(wrapper, input);
    }
  });

  wrapper.addEventListener('click', () => input.focus());
}

function renderTagPills(wrapper, inputEl) {
  [...wrapper.querySelectorAll('.tag-input-pill')].forEach(el => el.remove());
  const input = inputEl || wrapper.querySelector('.tags-text-input');

  currentTags.forEach((tag, i) => {
    const pill = document.createElement('span');
    pill.className = 'tag-input-pill';
    pill.innerHTML = `#${escHtml(tag)} <span class="tag-input-pill-remove" data-idx="${i}">✕</span>`;
    pill.querySelector('.tag-input-pill-remove').addEventListener('click', e => {
      e.stopPropagation();
      currentTags.splice(i, 1);
      renderTagPills(wrapper, input);
    });
    wrapper.insertBefore(pill, input);
  });
}

function addTag(tag) {
  if (!tag || currentTags.includes(tag) || currentTags.length >= 8) return;
  currentTags.push(tag);
}

function updateTagSuggestions(code, title) {
  const suggested = suggestTags(code, title);
  const container = document.getElementById('tag-suggestions');
  if (!container) return;

  const newOnes = suggested.filter(t => !currentTags.includes(t)).slice(0, 6);
  if (newOnes.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = '<span style="font-size:0.65rem;color:var(--text-muted);margin-right:4px;">Suggested:</span>' +
    newOnes.map(t => `<span class="tag-suggestion-item" data-tag="${t}">#${t}</span>`).join('');

  container.querySelectorAll('.tag-suggestion-item').forEach(el => {
    el.addEventListener('click', () => {
      addTag(el.dataset.tag);
      const wrapper = document.getElementById('tags-wrapper');
      const input = wrapper.querySelector('.tags-text-input');
      renderTagPills(wrapper, input);
      el.remove();
    });
  });
}

function saveSnippet() {
  const title = document.getElementById('form-title').value.trim();
  const language = document.getElementById('form-lang').value;
  const category = document.getElementById('form-cat').value;
  const code = document.getElementById('form-code').value.trim();
  const description = document.getElementById('form-desc').value.trim();

  if (!title) { showToast('Please add a title', 'error'); return; }
  if (!code)  { showToast('Code cannot be empty', 'error'); return; }

  const data = { title, language, category, tags: currentTags, code, description };

  if (editingId) {
    store.update(editingId, data);
    showToast('✓ Snippet updated', 'success');
  } else {
    store.add(data);
    showToast('⚡ Snippet saved!', 'success');
  }

  closeModal();
  renderCards();
  renderSidebar();
}

export function closeModal() {
  closeOverlay('snippet-modal');
  editingId = null;
  currentTags = [];
}

export function openOverlay(id) {
  const el = document.getElementById(id);
  el.classList.add('visible');
  el.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

export function closeOverlay(id) {
  const el = document.getElementById(id);
  el.classList.remove('visible');
  el.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
