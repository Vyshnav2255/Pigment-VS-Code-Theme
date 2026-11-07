// Builds file + product icon themes for the extra icon packs (Tabler, Iconoir, Fluent, Heroicons).
// Run: node src/packs.mjs   then build each producticons-* font with src/font.py (see package.json "build").
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileColors, ext, names, langs, folders, C } from './filemap.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nm = (...p) => join(root, 'node_modules', ...p);

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p)); else if (p.endsWith('.svg')) out.push(p);
  }
  return out;
}
// index: normalized name -> file path
function index(files, keyOf) {
  const m = new Map();
  for (const f of files) { const k = keyOf(basename(f, '.svg')); if (k && !m.has(k)) m.set(k, f); }
  return m;
}
const norm = (s) => s.toLowerCase().replace(/_/g, '-').replace(/-+/g, '-');

// ---------- packs ----------
const tablerOut = index(walk(nm('@tabler/icons', 'icons', 'outline')), norm);
const tablerFill = index(walk(nm('@tabler/icons', 'icons', 'filled')), norm);
const iconoirReg = index(walk(nm('iconoir', 'icons', 'regular')), norm);
const iconoirSolid = index(walk(nm('iconoir', 'icons', 'solid')), norm);
const fluentFiles = readdirSync(nm('@fluentui/svg-icons', 'icons')).map((f) => nm('@fluentui/svg-icons', 'icons', f));
const fluentStyle = (style) => {
  const m = new Map();
  for (const size of ['24', '20', '28', '16']) {
    for (const f of fluentFiles) {
      const b = basename(f, '.svg');
      const suffix = `_${size}_${style}`;
      if (b.endsWith(suffix)) { const k = norm(b.slice(0, -suffix.length)); if (!m.has(k)) m.set(k, f); }
    }
  }
  return m;
};
const heroOut = index(walk(nm('heroicons', '24', 'outline')), norm);
const heroSolid = index(walk(nm('heroicons', '24', 'solid')), norm);

const withFallback = (...maps) => ({ get: (k) => { for (const m of maps) if (m.has(k)) return m.get(k); }, has: (k) => maps.some((m) => m.has(k)) });

const PACKS = [
  { id: 'tabler-outline', label: 'Tabler Outline', map: tablerOut },
  { id: 'tabler-filled', label: 'Tabler Filled', map: withFallback(tablerFill, tablerOut) },
  { id: 'iconoir-regular', label: 'Iconoir Regular', map: iconoirReg },
  { id: 'iconoir-solid', label: 'Iconoir Solid', map: withFallback(iconoirSolid, iconoirReg) },
  { id: 'fluent-regular', label: 'Fluent Regular', map: fluentStyle('regular') },
  { id: 'fluent-filled', label: 'Fluent Filled', map: fluentStyle('filled') },
  { id: 'heroicons-outline', label: 'Heroicons Outline', map: heroOut },
  { id: 'heroicons-solid', label: 'Heroicons Solid', map: withFallback(heroSolid, heroOut) },
];

// ---------- concept -> candidate names (normalized kebab; first match wins per pack) ----------
const FILE = {
  _file: ['file', 'document', 'description', 'file-blank', 'page', 'draft', 'note'],
  _folder: ['folder', 'folder-closed'],
  _folder_open: ['folder-open', 'folder-opened', 'folder-2-open', 'folder-open-line', 'open-folder', 'folder'],
  js: ['file-type-js', 'filetype-js', 'javascript', 'brand-javascript', 'logo-javascript', 'js', 'file-code', 'code-file', 'document-code', 'code', 'code-bracket'],
  ts: ['file-type-ts', 'filetype-tsx', 'brand-typescript', 'typescript', 'logo-typescript', 'file-code', 'code-file', 'document-code', 'code', 'code-bracket'],
  react: ['brand-react', 'reactjs', 'react', 'logo-react', 'file-type-jsx', 'filetype-jsx', 'atom', 'atom-2', 'file-code', 'code'],
  python: ['brand-python', 'file-type-py', 'filetype-py', 'logo-python', 'python', 'file-code', 'code'],
  java: ['file-type-java', 'filetype-java', 'coffee', 'cup', 'logo-java', 'file-code', 'code'],
  php: ['file-type-php', 'filetype-php', 'brand-php', 'php', 'file-code', 'code'],
  html: ['file-type-html', 'filetype-html', 'html5', 'brand-html5', 'logo-html5', 'html', 'code', 'code-xml', 'web'],
  css: ['file-type-css', 'filetype-css', 'css3', 'brand-css3', 'logo-css3', 'css', 'palette', 'color-palette', 'brush'],
  tailwind: ['brand-tailwind', 'tailwind-css', 'tailwind', 'wind', 'weather-windy', 'windy', 'palette'],
  json: ['json', 'filetype-json', 'braces', 'brackets-curly', 'data-object', 'curly-brackets', 'code-brackets', 'brackets', 'code'],
  yaml: ['file-type-yml', 'filetype-yml', 'yaml', 'settings-2', 'braces', 'data-object', 'code'],
  xml: ['file-type-xml', 'filetype-xml', 'xml', 'code-xml', 'code', 'code-view'],
  code: ['file-code', 'code-file', 'document-code', 'file-code-2', 'filetype-code', 'code', 'code-bracket', 'source-code'],
  markdown: ['markdown', 'filetype-md', 'file-type-md', 'logo-markdown', 'file-text', 'document-text', 'text-snippet', 'article'],
  text: ['file-type-txt', 'filetype-txt', 'file-text', 'document-text', 'text-snippet', 'txt', 'article', 'file-text-1'],
  csv: ['file-type-csv', 'filetype-csv', 'csv', 'file-spreadsheet', 'table', 'table-2', 'grid', 'table-view'],
  sql: ['sql', 'filetype-sql', 'file-type-sql', 'database', 'data-base', 'db'],
  database: ['database', 'database-2', 'data-base', 'db', 'storage'],
  image: ['photo', 'image', 'file-image', 'picture', 'image-2', 'filetype-png', 'media-image'],
  svg: ['file-type-svg', 'filetype-svg', 'svg', 'vector-pen', 'pen-tool', 'bezier', 'pen-nib', 'draw'],
  video: ['movie', 'video', 'film', 'file-video', 'videocam', 'video-camera', 'play-circle'],
  audio: ['music', 'music-note', 'music-2', 'audio', 'file-music', 'headphones', 'music-double-note'],
  pdf: ['file-type-pdf', 'filetype-pdf', 'file-pdf', 'pdf', 'picture-as-pdf', 'document-pdf', 'page'],
  zip: ['file-zip', 'zip', 'file-zip-2', 'archive', 'folder-zip', 'archive-box', 'zip-box', 'compress'],
  font: ['typography', 'fonts', 'font-size', 'text', 'text-fields', 'font', 'text-font', 'letter-t'],
  shell: ['terminal-2', 'terminal-box', 'terminal', 'filetype-sh', 'command-line', 'code-bracket-square', 'console', 'prompt'],
  git: ['git-branch', 'git', 'branch', 'fork', 'git-fork', 'merge'],
  npm: ['brand-npm', 'npmjs', 'npm', 'package', 'box', 'archive-box', 'deployed-code', 'inventory-2'],
  package: ['package', 'box', 'archive-box', 'deployed-code', 'inventory-2', 'cube', 'boxes', 'archive-stack', 'archive-2'],
  lock: ['lock', 'lock-closed', 'padlock', 'lock-2', 'locked'],
  key: ['key', 'key-2', 'vpn-key', 'password'],
  license: ['license', 'certificate', 'scale', 'balance', 'gavel', 'award', 'badge'],
  readme: ['book', 'book-open', 'book-2', 'menu-book', 'journal', 'open-book', 'notebook'],
  settings: ['settings', 'gear', 'cog', 'settings-3', 'tune', 'adjustments'],
  test: ['flask', 'flask-2', 'test-tube', 'beaker', 'science', 'chemistry', 'experiment'],
  log: ['file-text', 'document-text', 'receipt', 'list-details', 'notes', 'article', 'text-snippet'],
  vsix: ['puzzle', 'puzzle-piece', 'extension', 'apps', 'plug'],
};

const UI = {
  mic: ['microphone', 'mic', 'microphone-2', 'mic-2'], 'case-sensitive': ['letter-case', 'case-sensitive', 'text-aa', 'text-case', 'abc', 'text-size', 'text-font'],
  'whole-word': ['whole-word', 'text-recognition', 'text-box', 'text-t', 'text', 'text-fields'], regex: ['regex', 'asterisk', 'code-asterix', 'asterisk-simple'],
  'circle-filled': ['point-filled', 'circle-filled', 'circle', 'record', 'point'], bracket: ['brackets', 'brackets-curly', 'braces', 'code-brackets', 'data-object'],
  files: ['files', 'copy', 'documents', 'document-multiple', 'file-copy', 'file-copy-2', 'description', 'document-duplicate', 'files-alt', 'file'],
  search: ['search', 'magnifying-glass', 'zoom', 'magnifier'],
  'source-control': ['git-branch', 'branch', 'git-fork', 'fork', 'merge', 'git', 'fork-right', 'branch'],
  'debug-alt': ['bug', 'debug', 'bug-report'], 'debug-alt-small': ['bug', 'debug', 'bug-report'], debug: ['bug', 'debug', 'bug-report'],
  extensions: ['puzzle', 'puzzle-piece', 'extension', 'apps', 'puzzle-2', 'apps-add-in', 'squares-plus', 'app'],
  'remote-explorer': ['device-desktop', 'computer', 'desktop', 'desktop-computer', 'monitor', 'computer-desktop', 'screen', 'display'],
  account: ['user-circle', 'account-circle', 'person-circle', 'user', 'person', 'account'],
  'settings-gear': ['settings', 'gear', 'cog', 'settings-3', 'cog-6-tooth'], gear: ['settings', 'gear', 'cog', 'settings-3', 'cog-6-tooth'],
  settings: ['adjustments', 'settings-2', 'equalizer', 'tune', 'sliders', 'adjustments-horizontal', 'settings-adjust', 'options', 'settings'],
  close: ['x', 'close', 'dismiss', 'x-mark', 'xmark', 'close-large'], add: ['plus', 'add', 'add-large'], plus: ['plus', 'add', 'add-large'],
  remove: ['minus', 'subtract', 'remove', 'dash', 'subtract-large'], trash: ['trash', 'delete', 'delete-bin', 'trash-can', 'trash-3', 'bin'],
  refresh: ['refresh', 'reload', 'arrow-clockwise', 'renew', 'arrow-path', 'restart', 'refresh-line', 'rotate-clockwise', 'arrow-sync'],
  copy: ['copy', 'files', 'file-copy', 'document-copy', 'content-copy', 'clipboard', 'duplicate', 'square-2-stack'],
  filter: ['filter', 'funnel', 'filter-2', 'filter-list', 'filter-3'], 'filter-filled': ['filter', 'funnel', 'filter-2', 'filter-list'],
  ellipsis: ['dots', 'more', 'more-horizontal', 'ellipsis-horizontal', 'three-dots', 'more-horiz', 'overflow-menu-horizontal', 'more-2'],
  'kebab-vertical': ['dots-vertical', 'more-vertical', 'ellipsis-vertical', 'three-dots-vertical', 'more-vert', 'overflow-menu-vertical', 'more-2-vertical'],
  'new-file': ['file-plus', 'file-add', 'document-add', 'note-add', 'document-plus', 'add-file', 'file-earmark-plus', 'page-plus'],
  'new-folder': ['folder-plus', 'folder-add', 'create-new-folder', 'add-folder', 'new-folder'],
  'collapse-all': ['fold', 'collapse', 'unfold-less', 'arrows-minimize', 'collapse-vertical', 'contract-up-down', 'chevrons-down-up', 'arrow-collapse', 'arrows-collapse', 'collapse-all', 'arrow-collapse-all'],
  'expand-all': ['unfold', 'expand', 'unfold-more', 'arrows-maximize', 'expand-vertical', 'expand-up-down', 'chevrons-up-down', 'arrow-expand', 'arrows-expand', 'expand-all'],
  'chevron-right': ['chevron-right', 'arrow-right-s', 'nav-arrow-right', 'keyboard-arrow-right', 'caret-right'],
  'chevron-down': ['chevron-down', 'arrow-down-s', 'nav-arrow-down', 'keyboard-arrow-down', 'expand-more', 'caret-down'],
  'chevron-left': ['chevron-left', 'arrow-left-s', 'nav-arrow-left', 'keyboard-arrow-left', 'caret-left'],
  'chevron-up': ['chevron-up', 'arrow-up-s', 'nav-arrow-up', 'keyboard-arrow-up', 'expand-less', 'caret-up'],
  'arrow-right': ['arrow-right', 'arrow-forward'], 'arrow-left': ['arrow-left', 'arrow-back'],
  'arrow-up': ['arrow-up', 'arrow-upward'], 'arrow-down': ['arrow-down', 'arrow-downward'],
  terminal: ['terminal-2', 'terminal-box', 'terminal', 'command-line', 'console', 'code-bracket-square'],
  'terminal-bash': ['terminal', 'terminal-2', 'terminal-box', 'command-line', 'console'],
  'split-horizontal': ['layout-columns', 'layout-column', 'split-cells-horizontally', 'columns', 'layout-2', 'view-column', 'split-screen', 'split-vertical', 'layout-split'],
  'split-vertical': ['layout-rows', 'layout-row', 'split-cells-vertically', 'rows', 'view-agenda', 'split-horizontal', 'layout-row-2'],
  'layout-sidebar-left': ['layout-sidebar', 'layout-left', 'side-bar', 'sidebar', 'layout-column-2', 'panel-left', 'left-panel-open', 'side-panel-left', 'layout-sidebar-left', 'open-panel-left'],
  'layout-sidebar-left-off': ['layout-sidebar', 'layout-left', 'side-bar', 'sidebar', 'panel-left', 'left-panel-open', 'layout-sidebar-left', 'open-panel-left'],
  'layout-sidebar-right': ['layout-sidebar-right', 'layout-right', 'sidebar-reversed', 'panel-right', 'right-panel-open', 'side-panel-right', 'layout-sidebar', 'open-panel-right'],
  'layout-sidebar-right-off': ['layout-sidebar-right', 'layout-right', 'sidebar-reversed', 'panel-right', 'right-panel-open', 'layout-sidebar', 'open-panel-right'],
  'layout-panel': ['layout-bottombar', 'layout-bottom', 'panel-bottom', 'bottom-panel-open', 'bottom-panel', 'layout-row', 'dock-bottom', 'layout-bottom-panel', 'open-panel-bottom'],
  'layout-panel-off': ['layout-bottombar', 'layout-bottom', 'panel-bottom', 'bottom-panel-open', 'bottom-panel', 'layout-row', 'dock-bottom', 'open-panel-bottom'],
  layout: ['layout', 'layout-dashboard', 'dashboard', 'layout-grid', 'grid', 'grid-view', 'squares-2x2'],
  'screen-full': ['maximize', 'fullscreen', 'arrows-maximize', 'full-screen', 'arrows-fullscreen', 'expand', 'open-in-full', 'arrows-pointing-out'],
  'screen-normal': ['minimize', 'fullscreen-exit', 'arrows-minimize', 'collapse', 'close-fullscreen', 'arrows-pointing-in', 'arrows-angle-contract', 'full-screen-minimize', 'arrow-minimize'],
  'git-commit': ['git-commit', 'commit', 'git-commit-2'], 'git-pull-request': ['git-pull-request', 'pull-request', 'git-pull-request-2'],
  'git-compare': ['git-compare', 'compare', 'arrows-diff', 'git-compare-2', 'file-diff', 'diff', 'branch-compare'], 'git-merge': ['git-merge', 'merge'],
  'repo-forked': ['git-fork', 'fork', 'git-fork-2', 'branch-fork', 'fork-right', 'fork-left'], 'git-branch': ['git-branch', 'branch', 'git', 'fork-right'],
  check: ['check', 'checkmark', 'done', 'check-lg', 'tick'], 'check-all': ['checks', 'check-double', 'done-all', 'checkmark-2', 'check-all', 'double-check', 'check-2-all'],
  error: ['circle-x', 'close-circle', 'x-circle', 'dismiss-circle', 'error', 'cancel', 'error-outline', 'xmark-circle', 'misuse'],
  warning: ['alert-triangle', 'error-warning', 'warning', 'warning-triangle', 'exclamation-triangle', 'warning-alt', 'triangle-alert'],
  info: ['info-circle', 'information', 'info', 'information-circle'],
  pass: ['circle-check', 'checkbox-circle', 'check-circle', 'checkmark-circle', 'checkmark-outline'],
  'pass-filled': ['circle-check', 'checkbox-circle', 'check-circle', 'checkmark-circle', 'checkmark-filled'],
  bell: ['bell', 'notification', 'notifications', 'alert', 'notification-3'], 'bell-dot': ['bell-ringing', 'bell-notification', 'notification-badge', 'notifications-unread', 'notification-new', 'alert-urgent', 'bell'],
  play: ['player-play', 'play', 'play-arrow', 'play-circle'], 'debug-start': ['player-play', 'play', 'play-arrow'], 'run-all': ['player-play', 'play', 'play-arrow'],
  'debug-pause': ['player-pause', 'pause'], 'debug-stop': ['player-stop', 'stop', 'stop-circle', 'square'],
  'debug-restart': ['refresh', 'reload', 'restart', 'arrow-clockwise', 'renew', 'replay'],
  'debug-continue': ['player-track-next', 'skip-forward', 'next', 'skip-next', 'forward', 'fast-forward'],
  comment: ['message', 'message-2', 'chat', 'comment', 'chat-bubble', 'chat-1', 'chat-left', 'chat-bubble-left'],
  'comment-discussion': ['messages', 'chat-multiple', 'forum', 'chat-bubble-left-right', 'chat-3', 'question-answer', 'chats', 'chat-left-text', 'multi-bubble'],
  history: ['history', 'clock-history', 'time', 'recent', 'clock-rotate-left', 'schedule', 'clock'],
  eye: ['eye', 'visibility', 'view', 'eye-open', 'show'], 'eye-closed': ['eye-off', 'eye-slash', 'visibility-off', 'eye-closed', 'view-off', 'eye-close', 'hide'],
  pin: ['pin', 'pushpin', 'push-pin', 'pin-2'], pinned: ['pinned', 'pin', 'pushpin', 'push-pin', 'pin-2'],
  edit: ['pencil', 'edit', 'edit-2', 'pen', 'edit-pencil', 'pencil-square', 'edit-box'],
  save: ['device-floppy', 'save', 'floppy-disk', 'floppy', 'save-3'], 'save-all': ['device-floppy', 'save-multiple', 'save-copy', 'save-all', 'save', 'floppy', 'floppy-disk'],
  home: ['home', 'house', 'home-2', 'home-simple'], globe: ['world', 'globe', 'earth', 'language', 'public', 'global'],
  link: ['link', 'link-2', 'link-m', 'attachment'], 'link-external': ['external-link', 'open-in-new', 'share-box', 'box-arrow-up-right', 'arrow-top-right-on-square', 'open-new-window', 'launch', 'open'],
  lock: ['lock', 'lock-closed', 'padlock', 'locked'], unlock: ['lock-open', 'unlock', 'lock-unlock', 'unlocked', 'lock-open-variant'],
  menu: ['menu', 'menu-2', 'list', 'bars-3', 'hamburger', 'menu-line', 'navigation', 'menu-scale'],
  replace: ['replace', 'find-replace', 'swap', 'arrows-exchange', 'arrow-left-right', 'switch', 'arrows-right-left', 'repeat', 'arrow-swap'],
  'replace-all': ['replace', 'find-replace', 'swap', 'arrows-exchange', 'arrow-left-right', 'switch', 'arrows-right-left', 'arrow-swap'],
  sparkle: ['sparkles', 'sparkle', 'star-shine', 'magic', 'auto-awesome', 'stars', 'ai', 'shine', 'sparks'],
  'chat-sparkle': ['message-chatbot', 'robot', 'bot', 'chat-sparkle', 'sparkles', 'sparkle', 'chat-smile', 'smart-toy', 'magic', 'sparks'],
  'go-to-file': ['file-search', 'search-file', 'document-search', 'file-search-2', 'find-in-page', 'search', 'magnifying-glass'],
  cloud: ['cloud'], 'cloud-download': ['cloud-download', 'cloud-arrow-down', 'download-cloud'], 'cloud-upload': ['cloud-upload', 'cloud-arrow-up', 'upload-cloud', 'upload'],
  book: ['book', 'book-open', 'book-2', 'menu-book', 'open-book', 'journal'], folder: ['folder'], 'folder-opened': ['folder-open', 'folder-2-open', 'folder-opened', 'open-folder', 'folder'],
  file: ['file', 'document', 'description', 'page'], star: ['star'], 'star-empty': ['star'], tag: ['tag', 'price-tag', 'label', 'bookmark'],
  key: ['key', 'key-2', 'vpn-key'], person: ['user', 'person', 'account', 'user-3'],
  beaker: ['flask', 'flask-2', 'test-tube', 'beaker', 'science', 'chemistry', 'experiment'],
  rocket: ['rocket', 'rocket-launch', 'rocket-2', 'launch'], database: ['database', 'data-base', 'database-2', 'db', 'storage'],
  package: ['package', 'box', 'archive-box', 'deployed-code', 'inventory-2', 'cube'], tools: ['tool', 'tools', 'wrench', 'build', 'hammer', 'construction'],
  zap: ['bolt', 'flash', 'zap', 'lightning', 'flash-on', 'flashlight'], wand: ['wand', 'magic', 'magic-wand', 'auto-fix', 'auto-fix-high', 'sparkles', 'magic-button', 'wand-stars'],
  sync: ['refresh', 'arrows-clockwise', 'sync', 'arrow-sync', 'renew', 'loop', 'repeat'],
  'word-wrap': ['text-wrap', 'wrap-text', 'text-wrap-on', 'wrap', 'arrow-return-left'],
  output: ['file-text', 'list-details', 'document-text', 'notes', 'article', 'receipt', 'text-snippet', 'list'],
  'debug-console': ['terminal', 'terminal-2', 'terminal-box', 'command-line', 'console'],
  'list-tree': ['list-tree', 'hierarchy', 'tree', 'account-tree', 'tree-view', 'node-tree', 'diagram', 'sitemap', 'organization'],
  'list-flat': ['list', 'list-unordered', 'format-list-bulleted', 'list-bullet', 'menu'],
  preview: ['eye', 'visibility', 'view', 'show'], 'open-preview': ['eye', 'visibility', 'view', 'show'],
  'clear-all': ['clear-all', 'eraser', 'brush', 'clean', 'broom', 'cleaning-services', 'delete', 'trash'],
  feedback: ['message', 'feedback', 'chat', 'comment', 'chat-bubble'], issues: ['alert-circle', 'error-warning', 'warning-circle', 'error', 'exclamation-circle', 'info'],
};

// Colourise: replace currentColor; give fill-only SVGs (no fill/stroke colour) an explicit fill.
function colorize(svg, color) {
  svg = svg.replace(/<!--[\s\S]*?-->\s*/g, '').replace(/\s+class="[^"]*"/, '');
  if (svg.includes('currentColor')) return svg.replace(/currentColor/g, color);
  return svg.replace(/<svg\b/, `<svg fill="${color}"`);
}
const pickIn = (map, cands) => { for (const c of cands) if (map.has(c)) return map.get(c); return null; };

function writeFileTheme(dir, defsFor) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, 'svg'), { recursive: true });
  const defs = {};
  const add = (id, svg) => { writeFileSync(join(dir, 'svg', `${id}.svg`), svg); defs[id] = { iconPath: `./svg/${id}.svg` }; };
  defsFor(add);
  return defs;
}

const contributes = { iconThemes: [], productIconThemes: [] };
const report = [];

for (const pack of PACKS) {
  // ---- file icons ----
  const fiDir = join(root, `fileicons-${pack.id}`);
  const missingFile = [];
  const defs = writeFileTheme(fiDir, (add) => {
    const resolved = {};
    for (const [id, cands] of Object.entries(FILE)) {
      let f = pickIn(pack.map, cands);
      if (!f) { missingFile.push(id); f = pickIn(pack.map, id === '_folder_open' ? FILE._folder : FILE._file); }
      resolved[id] = f;
      add(id, colorize(readFileSync(f, 'utf8'), fileColors[id]));
    }
    for (const [name, color] of Object.entries(folders)) {
      const id = `folder_${name.replace(/[^a-z0-9]/gi, '_')}`;
      add(id, colorize(readFileSync(resolved._folder, 'utf8'), color));
      add(id + '_open', colorize(readFileSync(resolved._folder_open, 'utf8'), color));
    }
  });
  writeFileSync(join(fiDir, 'icons.json'), JSON.stringify(fileThemeJson(defs), null, 2) + '\n');
  contributes.iconThemes.push({ id: `pigment-${pack.id}`, label: `Pigment ${pack.label}`, path: `./fileicons-${pack.id}/icons.json` });

  // ---- product icons ----
  const piDir = join(root, `producticons-${pack.id}`);
  rmSync(piDir, { recursive: true, force: true });
  mkdirSync(join(piDir, 'svg'), { recursive: true });
  const glyphs = {}, used = new Map(), missingUi = [];
  let cp = 0xe000;
  for (const [id, cands] of Object.entries(UI)) {
    const f = pickIn(pack.map, cands);
    if (!f) { missingUi.push(id); continue; }
    const icon = basename(f, '.svg').replace(/[^a-z0-9_-]/gi, '_');
    if (!used.has(icon)) { used.set(icon, cp++); writeFileSync(join(piDir, 'svg', `${icon}.svg`), colorize(readFileSync(f, 'utf8'), '#000000')); }
    glyphs[id] = { icon, codepoint: used.get(icon) };
  }
  writeFileSync(join(piDir, 'glyphs.json'), JSON.stringify(glyphs, null, 2) + '\n');
  writeFileSync(join(piDir, 'icons.json'), JSON.stringify({
    fonts: [{ id: pack.id, src: [{ path: './icons.woff', format: 'woff' }], weight: 'normal', style: 'normal' }],
    iconDefinitions: Object.fromEntries(Object.entries(glyphs).map(([id, g]) => [id, { fontCharacter: '\\' + g.codepoint.toString(16) }])),
  }, null, 2) + '\n');
  contributes.productIconThemes.push({ id: `pigment-${pack.id}-ui`, label: `Pigment ${pack.label} UI`, path: `./producticons-${pack.id}/icons.json` });
  report.push(`${pack.id}: file ${Object.keys(FILE).length - missingFile.length}/${Object.keys(FILE).length}` +
    (missingFile.length ? ` (generic: ${missingFile.join(',')})` : '') +
    ` | UI ${Object.keys(glyphs).length}/${Object.keys(UI).length}` + (missingUi.length ? ` (default: ${missingUi.join(',')})` : ''));
}

function fileThemeJson(defs, extra = {}) {
  const folderNames = {}, folderNamesExpanded = {};
  for (const name of Object.keys(folders)) {
    const id = `folder_${name.replace(/[^a-z0-9]/gi, '_')}`;
    folderNames[name] = id; folderNamesExpanded[name] = id + '_open';
  }
  return {
    hidesExplorerArrows: false, iconDefinitions: defs,
    file: '_file', folder: '_folder', folderExpanded: '_folder_open', rootFolder: '_folder', rootFolderExpanded: '_folder_open',
    fileExtensions: { ...ext, ...(extra.fileExtensions || {}) }, fileNames: { ...names, ...(extra.fileNames || {}) },
    languageIds: { ...langs, ...(extra.languageIds || {}) }, folderNames, folderNamesExpanded,
  };
}

writeFileSync(join(root, 'packs.contributes.json'), JSON.stringify(contributes, null, 2) + '\n');
console.log(report.join('\n'));
