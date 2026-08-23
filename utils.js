export function getLangClass(lang) {
  const map = {
    javascript: 'lang-js',
    typescript: 'lang-ts',
    python:     'lang-py',
    css:        'lang-css',
    html:       'lang-html',
    cpp:        'lang-cpp',
    'c++':      'lang-cpp',
    c:          'lang-c',
    java:       'lang-java',
    rust:       'lang-rust',
    go:         'lang-go',
    bash:       'lang-bash',
    shell:      'lang-shell',
    sql:        'lang-sql',
  };
  return map[lang?.toLowerCase()] || 'lang-other';
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function formatDate(ts) {
  if (!ts) return '';
  return new Intl.DateTimeFormat('en', {
    month: 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(ts));
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
