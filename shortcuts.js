import { openModal, closeModal } from './modal.js';
import { openPalette, closePalette } from './palette.js';
import { closeViewModal } from './viewModal.js';

export function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

    // Ctrl/Cmd + K → Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const palette = document.getElementById('command-palette-overlay');
      if (palette.classList.contains('visible')) {
        closePalette();
      } else {
        openPalette();
      }
      return;
    }

    // Ctrl/Cmd + N → New Snippet
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      openModal();
      return;
    }

    // Ctrl/Cmd + S → Save (when modal open)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      const modal = document.getElementById('snippet-modal');
      if (modal.classList.contains('visible')) {
        e.preventDefault();
        document.getElementById('form-save')?.click();
      }
      return;
    }

    // Escape → close modals / palette
    if (e.key === 'Escape') {
      const palette = document.getElementById('command-palette-overlay');
      const modal   = document.getElementById('snippet-modal');
      const view    = document.getElementById('view-modal');
      const stats   = document.getElementById('stats-panel');

      if (palette.classList.contains('visible')) { closePalette(); return; }
      if (modal.classList.contains('visible'))   { closeModal();   return; }
      if (view.classList.contains('visible'))    { closeViewModal(); return; }
      if (stats.classList.contains('visible'))   { stats.classList.remove('visible'); return; }
      return;
    }

    // / → focus search (when not typing)
    if (e.key === '/' && !isTyping) {
      e.preventDefault();
      document.getElementById('search-input')?.focus();
      return;
    }
  });
}
