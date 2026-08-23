const STORAGE_KEY = 'snippetbox_v1';

let _snippets = [];
let _activeFilter = 'all';
let _activeLang = 'all';
let _activeTag = null;
let _searchQuery = '';

function generateId() {
  return 'snip_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

export const store = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _snippets = raw ? JSON.parse(raw) : [];
    } catch {
      _snippets = [];
    }
  },

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_snippets));
  },

  getAll() {
    return [..._snippets];
  },

  getById(id) {
    return _snippets.find(s => s.id === id) || null;
  },

  add(snippet) {
    const now = Date.now();
    const s = {
      id: generateId(),
      title: snippet.title || 'Untitled',
      language: snippet.language || 'other',
      category: snippet.category || 'Uncategorized',
      tags: snippet.tags || [],
      code: snippet.code || '',
      description: snippet.description || '',
      favorite: snippet.favorite || false,
      pinned: snippet.pinned || false,
      copyCount: snippet.copyCount || 0,
      lastUsed: snippet.lastUsed || null,
      createdAt: snippet.createdAt || now,
    };
    _snippets.unshift(s);
    this.save();
    return s;
  },

  update(id, updates) {
    const idx = _snippets.findIndex(s => s.id === id);
    if (idx === -1) return null;
    _snippets[idx] = { ..._snippets[idx], ...updates };
    this.save();
    return _snippets[idx];
  },

  delete(id) {
    _snippets = _snippets.filter(s => s.id !== id);
    this.save();
  },

  incrementCopy(id) {
    const s = _snippets.find(s => s.id === id);
    if (!s) return;
    s.copyCount = (s.copyCount || 0) + 1;
    s.lastUsed = Date.now();
    this.save();
  },

  toggleFavorite(id) {
    const s = _snippets.find(s => s.id === id);
    if (!s) return;
    s.favorite = !s.favorite;
    this.save();
    return s.favorite;
  },

  togglePin(id) {
    const s = _snippets.find(s => s.id === id);
    if (!s) return;
    s.pinned = !s.pinned;
    this.save();
    return s.pinned;
  },

  // ── Filter state ──
  setFilter(f) { _activeFilter = f; },
  getFilter()  { return _activeFilter; },
  setLang(l)   { _activeLang = l; },
  getLang()    { return _activeLang; },
  setTag(t)    { _activeTag = t; },
  getTag()     { return _activeTag; },
  setSearch(q) { _searchQuery = q; },
  getSearch()  { return _searchQuery; },

  // ── Filtered view ──
  getFiltered() {
    let list = [..._snippets];

    // Named filter
    switch (_activeFilter) {
      case 'favorites': list = list.filter(s => s.favorite); break;
      case 'pinned':    list = list.filter(s => s.pinned);   break;
      case 'recent':
        list = list
          .filter(s => s.lastUsed)
          .sort((a, b) => b.lastUsed - a.lastUsed)
          .slice(0, 20);
        break;
      default:
        if (_activeFilter !== 'all') {
          list = list.filter(s => s.category === _activeFilter);
        }
        break;
    }

    // Lang filter
    if (_activeLang !== 'all') {
      list = list.filter(s => s.language.toLowerCase() === _activeLang.toLowerCase());
    }

    // Tag filter
    if (_activeTag) {
      list = list.filter(s => s.tags.includes(_activeTag));
    }

    // Search
    if (_searchQuery.trim()) {
      const q = _searchQuery.trim().toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.language.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    // Pinned first
    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return list;
  },

  // ── Aggregates ──
  getAllLanguages() {
    const langs = {};
    _snippets.forEach(s => {
      const l = s.language || 'other';
      langs[l] = (langs[l] || 0) + 1;
    });
    return langs;
  },

  getAllCategories() {
    const cats = new Set(_snippets.map(s => s.category || 'Uncategorized'));
    return [...cats].sort();
  },

  getAllTags() {
    const tags = {};
    _snippets.forEach(s => (s.tags || []).forEach(t => {
      tags[t] = (tags[t] || 0) + 1;
    }));
    return Object.entries(tags).sort((a, b) => b[1] - a[1]).map(([t]) => t);
  },

  getTopCopied(n = 5) {
    return [..._snippets]
      .filter(s => s.copyCount > 0)
      .sort((a, b) => b.copyCount - a.copyCount)
      .slice(0, n);
  },

  importAll(snippets) {
    snippets.forEach(s => {
      const exists = _snippets.find(e => e.id === s.id);
      if (exists) {
        Object.assign(exists, s);
      } else {
        _snippets.push(s);
      }
    });
    this.save();
  },
};
