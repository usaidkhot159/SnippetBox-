import { store } from './store.js';
import { renderCards } from './cards.js';
import { getLangClass } from './utils.js';

export function renderSidebar() {
  updateCounts();
  renderCategoryNav();
  renderTagCloud();
  renderLangFilter();
}

function updateCounts() {
  const all = store.getAll();
  document.getElementById('count-all').textContent = all.length;
  document.getElementById('count-favorites').textContent = all.filter(s => s.favorite).length;
  document.getElementById('count-pinned').textContent = all.filter(s => s.pinned).length;
}

function renderCategoryNav() {
  const nav = document.getElementById('category-nav');
  const categories = store.getAllCategories();
  const currentFilter = store.getFilter();

  nav.innerHTML = categories.map(cat => {
    const count = store.getAll().filter(s => s.category === cat).length;
    const isActive = currentFilter === cat;
    return `
      <li class="nav-item ${isActive ? 'active' : ''}" data-filter="${escAttr(cat)}">
        <span class="nav-icon">📂</span>
        <span>${escHtml(cat)}</span>
        <span class="nav-count">${count}</span>
      </li>
    `;
  }).join('');

  nav.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      store.setFilter(item.dataset.filter);
      store.setTag(null);
      setActiveNav(item);
      renderCards();
      updateViewTitle();
    });
  });
}

function renderTagCloud() {
  const cloud = document.getElementById('tag-cloud');
  const tags = store.getAllTags().slice(0, 24);
  const activeTag = store.getTag();

  cloud.innerHTML = tags.map(tag => `
    <span class="tag-pill ${activeTag === tag ? 'active' : ''}" data-tag="${escAttr(tag)}">#${escHtml(tag)}</span>
  `).join('');

  cloud.querySelectorAll('.tag-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const tag = pill.dataset.tag;
      if (store.getTag() === tag) {
        store.setTag(null);
        pill.classList.remove('active');
      } else {
        store.setTag(tag);
        cloud.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
      renderCards();
    });
  });
}

function renderLangFilter() {
  const container = document.getElementById('lang-filter');
  const langs = store.getAllLanguages();
  const activeLang = store.getLang();

  const chips = [{ lang: 'all', count: store.getAll().length }, ...Object.entries(langs).map(([lang, count]) => ({ lang, count }))];

  container.innerHTML = chips.map(({ lang, count }) => `
    <button class="lang-chip ${getLangClass(lang)} ${activeLang === lang ? 'active' : ''}" data-lang="${escAttr(lang)}">
      ${lang === 'all' ? 'All' : lang}
    </button>
  `).join('');

  container.querySelectorAll('.lang-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      store.setLang(chip.dataset.lang);
      container.querySelectorAll('.lang-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderCards();
    });
  });
}

export function initNavItems() {
  document.getElementById('nav-list').addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    const filter = item.dataset.filter;
    store.setFilter(filter);
    store.setTag(null);
    setActiveNav(item);
    renderCards();
    updateViewTitle();
  });
}

function setActiveNav(activeItem) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  activeItem.classList.add('active');
}

function updateViewTitle() {
  const filter = store.getFilter();
  const titles = {
    all: 'All Snippets',
    favorites: '⭐ Favorites',
    pinned: '📌 Pinned',
    recent: '🕐 Recently Used',
  };
  document.getElementById('view-title').textContent = titles[filter] || filter;
}

function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(str) {
  return String(str).replace(/"/g, '&quot;');
}

// Init nav item clicks on boot
document.addEventListener('DOMContentLoaded', () => { }, false);
// Attach nav-list listener immediately since it's static HTML
document.getElementById('nav-list').addEventListener('click', e => {
  const item = e.target.closest('.nav-item');
  if (!item) return;
  const filter = item.dataset.filter;
  store.setFilter(filter);
  store.setTag(null);

  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  item.classList.add('active');

  const titles = { all: 'All Snippets', favorites: '⭐ Favorites', pinned: '📌 Pinned', recent: '🕐 Recently Used' };
  document.getElementById('view-title').textContent = titles[filter] || filter;

  renderCards();
});
