import { store } from './store.js';
import { renderSidebar } from './sidebar.js';
import { renderCards } from './cards.js';
import { initModal } from './modal.js';
import { initCommandPalette } from './palette.js';
import { initKeyboardShortcuts } from './shortcuts.js';
import { initStatsPanel } from './stats.js';
import { initImportExport } from './importExport.js';
import { renderSnippetOfTheDay } from './sotd.js';
import { initSearch } from './search.js';
import { initViewModal } from './viewModal.js';

async function boot() {
  // Load data
  store.load();

  // Seed default snippets if empty
  if (store.getAll().length === 0) {
    const { DEFAULT_SNIPPETS } = await import('./defaults.js');
    DEFAULT_SNIPPETS.forEach(s => store.add(s));
  }

  // Init all modules
  initModal();
  initViewModal();
  initCommandPalette();
  initKeyboardShortcuts();
  initStatsPanel();
  initImportExport();
  initSearch();

  // Initial render
  renderSidebar();
  renderCards();
  renderSnippetOfTheDay();

  // New snippet button
  document.getElementById('new-snippet-btn').addEventListener('click', () => {
    import('./modal.js').then(m => m.openModal());
  });
}

boot();
