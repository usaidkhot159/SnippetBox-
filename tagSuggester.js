const KEYWORD_MAP = [
  { pattern: /\bfetch\b|\baxios\b|\bXMLHttpRequest\b/i, tags: ['api', 'http', 'fetch'] },
  { pattern: /\basync\b|\bawait\b/i,                     tags: ['async', 'promise'] },
  { pattern: /\bPromise\b/i,                             tags: ['promise', 'async'] },
  { pattern: /\bdebounce\b/i,                            tags: ['debounce', 'performance'] },
  { pattern: /\bthrottle\b/i,                            tags: ['throttle', 'performance'] },
  { pattern: /\blocalStorage\b|\bsessionStorage\b/i,     tags: ['storage', 'browser'] },
  { pattern: /\bdocument\.\b|\bgetElement/i,             tags: ['dom', 'browser'] },
  { pattern: /\beventListener\b/i,                       tags: ['events', 'dom'] },
  { pattern: /\bsetTimeout\b|\bsetInterval\b/i,          tags: ['timer', 'async'] },
  { pattern: /\barray\b|\.map\(|\.filter\(|\.reduce\(/i, tags: ['array', 'functional'] },
  { pattern: /\bregex\b|new RegExp|\/[^/]+\/[gimsuy]*/i, tags: ['regex', 'string'] },
  { pattern: /\bclass\b/i,                               tags: ['oop', 'class'] },
  { pattern: /\breadFile\b|\bwriteFile\b|\bfs\./i,       tags: ['filesystem', 'node'] },
  { pattern: /\brequire\b|\bimport\b/i,                  tags: ['module', 'es6'] },
  { pattern: /\bconsole\./i,                             tags: ['debug', 'logging'] },
  { pattern: /\bsort\b|\bbinary\b|\bsearch\b/i,          tags: ['algorithm', 'sorting'] },
  { pattern: /\bbfs\b|\bdfs\b|\bgraph\b/i,               tags: ['algorithm', 'graph'] },
  { pattern: /\bqueue\b|\bstack\b/i,                     tags: ['data-structure'] },
  { pattern: /\bSQL\b|\bSELECT\b|\bINSERT\b/i,          tags: ['sql', 'database'] },
  { pattern: /\bcurl\b|\bwget\b/i,                       tags: ['cli', 'http'] },
  { pattern: /\bgrid\b|\bflex\b/i,                       tags: ['layout', 'css'] },
  { pattern: /\banimation\b|\btransition\b/i,            tags: ['animation', 'css'] },
  { pattern: /\b:root\b|--[a-z]/i,                       tags: ['css-variables'] },
  { pattern: /\btry\b.*\bcatch\b/is,                     tags: ['error-handling'] },
  { pattern: /\bjson\b|JSON\./i,                         tags: ['json', 'parsing'] },
  { pattern: /\bReact\b|\buseState\b|\buseEffect\b/i,    tags: ['react', 'hooks'] },
  { pattern: /\bvue\b|\bVue\b/i,                         tags: ['vue'] },
  { pattern: /\bexpress\b|\bapp\.get\b|\bapp\.post\b/i,  tags: ['express', 'backend', 'node'] },
  { pattern: /\bcrypto\b|\bhash\b|\bencrypt\b/i,         tags: ['security', 'crypto'] },
  { pattern: /\bvalidat\b|\bschem\b/i,                   tags: ['validation'] },
];

const TITLE_KEYWORD_MAP = [
  { pattern: /debounce/i,      tags: ['debounce', 'performance'] },
  { pattern: /throttle/i,      tags: ['throttle', 'performance'] },
  { pattern: /modal/i,         tags: ['ui', 'modal'] },
  { pattern: /dark.?mode/i,    tags: ['dark-mode', 'ui'] },
  { pattern: /fetch|api/i,     tags: ['api', 'http'] },
  { pattern: /sort|search/i,   tags: ['algorithm'] },
  { pattern: /regex/i,         tags: ['regex'] },
  { pattern: /toggle/i,        tags: ['ui', 'toggle'] },
  { pattern: /animation/i,     tags: ['animation'] },
  { pattern: /hook/i,          tags: ['react', 'hooks'] },
  { pattern: /util|helper/i,   tags: ['utility'] },
];

export function suggestTags(code, title = '') {
  const suggested = new Set();

  KEYWORD_MAP.forEach(({ pattern, tags }) => {
    if (pattern.test(code)) tags.forEach(t => suggested.add(t));
  });

  TITLE_KEYWORD_MAP.forEach(({ pattern, tags }) => {
    if (pattern.test(title)) tags.forEach(t => suggested.add(t));
  });

  return [...suggested].slice(0, 8);
}
