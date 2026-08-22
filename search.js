import { store } from './store.js';
import { renderCards } from './cards.js';

export function initSearch() {
  const input = document.getElementById('search-input');
  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      store.setSearch(input.value);
      renderCards();
    }, 180);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      input.value = '';
      store.setSearch('');
      renderCards();
      input.blur();
    }
  });
}
