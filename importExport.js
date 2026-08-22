import { store } from './store.js';
import { renderCards } from './cards.js';
import { renderSidebar } from './sidebar.js';
import { showToast } from './toast.js';

export function initImportExport() {
  // Export
  document.getElementById('export-btn').addEventListener('click', exportSnippets);

  // Import
  document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-file-input').click();
  });

  document.getElementById('import-file-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    importSnippets(file);
    e.target.value = '';
  });
}

function exportSnippets() {
  const snippets = store.getAll();
  if (snippets.length === 0) {
    showToast('No snippets to export', 'info');
    return;
  }

  const data = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), snippets }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `snippetbox-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showToast(`✓ Exported ${snippets.length} snippets`, 'success');
}

function importSnippets(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      const list = parsed.snippets || (Array.isArray(parsed) ? parsed : []);
      if (!list.length) throw new Error('Empty');

      store.importAll(list);
      renderCards();
      renderSidebar();
      showToast(`✓ Imported ${list.length} snippet${list.length !== 1 ? 's' : ''}`, 'success');
    } catch {
      showToast('Import failed — invalid file', 'error');
    }
  };
  reader.readAsText(file);
}
