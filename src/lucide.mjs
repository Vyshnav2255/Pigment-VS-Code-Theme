// Builds the Lucide file icon theme + product icon sources (single stroke style).
// Icons: lucide-static (ISC). Run: node src/lucide.mjs  (then python3 src/font.py producticons-lucide icons.woff "Lucide UI")
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileColors, ext, names, langs, folders } from './filemap.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'node_modules', 'lucide-static', 'icons');
const file = (name) => join(assets, `${name}.svg`);
const pick = (...cands) => {
  for (const n of cands) if (existsSync(file(n))) return n;
  throw new Error(`No Lucide icon among: ${cands.join(', ')}`);
};
const load = (name, color) => readFileSync(file(name), 'utf8')
  .replace(/<!--[\s\S]*?-->\s*/g, '').replace(/\s+class="[^"]*"/, '').replace(/currentColor/g, color);

const fileIconNames = {
  _file: ['file'], _folder: ['folder'], _folder_open: ['folder-open'],
  js: ['file-code'], ts: ['file-code'], react: ['atom'], python: ['file-code'], java: ['coffee'], php: ['file-code'],
  html: ['code-xml'], css: ['palette'], tailwind: ['wind'], json: ['file-braces', 'file-json', 'braces'], yaml: ['file-cog', 'braces'],
  xml: ['code-xml'], code: ['file-code'], markdown: ['file-text'], text: ['file-text'], csv: ['file-spreadsheet'], sql: ['database'],
  database: ['database'], image: ['file-image'], svg: ['pen-tool'], video: ['file-video', 'file-play'], audio: ['file-audio', 'file-music'],
  pdf: ['file-type'], zip: ['file-archive'], font: ['type'], shell: ['file-terminal', 'square-terminal'], git: ['git-branch'],
  npm: ['package'], package: ['package'], lock: ['file-lock', 'lock'], key: ['file-key', 'key'], license: ['scale'],
  readme: ['book-open'], settings: ['file-cog', 'settings'], test: ['flask-conical'], log: ['scroll-text'], vsix: ['puzzle'],
};

const ui = {
  mic: ['mic'], 'case-sensitive': ['case-sensitive'], 'whole-word': ['whole-word'], regex: ['regex'], 'circle-filled': ['circle'], bracket: ['braces'],
  files: ['files'], search: ['search'], 'source-control': ['git-branch'], 'debug-alt': ['bug'], 'debug-alt-small': ['bug'], debug: ['bug'],
  extensions: ['blocks', 'puzzle'], 'remote-explorer': ['monitor'], account: ['circle-user'], 'settings-gear': ['settings'],
  gear: ['settings'], settings: ['settings-2'], close: ['x'], add: ['plus'], plus: ['plus'], remove: ['minus'], trash: ['trash-2'],
  refresh: ['refresh-cw'], copy: ['copy'], filter: ['list-filter', 'funnel'], 'filter-filled': ['list-filter', 'funnel'],
  ellipsis: ['ellipsis'], 'kebab-vertical': ['ellipsis-vertical'], 'new-file': ['file-plus'], 'new-folder': ['folder-plus'],
  'collapse-all': ['chevrons-down-up', 'list-collapse'], 'expand-all': ['chevrons-up-down'],
  'chevron-right': ['chevron-right'], 'chevron-down': ['chevron-down'], 'chevron-left': ['chevron-left'], 'chevron-up': ['chevron-up'],
  'arrow-right': ['arrow-right'], 'arrow-left': ['arrow-left'], 'arrow-up': ['arrow-up'], 'arrow-down': ['arrow-down'],
  terminal: ['square-terminal'], 'terminal-bash': ['terminal'], 'split-horizontal': ['columns-2'], 'split-vertical': ['rows-2'],
  'layout-sidebar-left': ['panel-left'], 'layout-sidebar-left-off': ['panel-left'], 'layout-sidebar-right': ['panel-right'],
  'layout-sidebar-right-off': ['panel-right'], 'layout-panel': ['panel-bottom'], 'layout-panel-off': ['panel-bottom'],
  layout: ['layout-dashboard'], 'screen-full': ['maximize'], 'screen-normal': ['minimize'], 'git-commit': ['git-commit-horizontal'],
  'git-pull-request': ['git-pull-request'], 'git-compare': ['git-compare'], 'git-merge': ['git-merge'], 'repo-forked': ['git-fork'],
  'git-branch': ['git-branch'], check: ['check'], 'check-all': ['check-check'], error: ['circle-x'], warning: ['triangle-alert'],
  info: ['info'], pass: ['circle-check'], 'pass-filled': ['circle-check'], bell: ['bell'], 'bell-dot': ['bell-dot'], play: ['play'],
  'debug-start': ['play'], 'run-all': ['play'], 'debug-pause': ['pause'], 'debug-stop': ['square'], 'debug-restart': ['rotate-cw'],
  'debug-continue': ['step-forward', 'skip-forward'], comment: ['message-square'], 'comment-discussion': ['messages-square'],
  history: ['history'], eye: ['eye'], 'eye-closed': ['eye-off'], pin: ['pin'], pinned: ['pin'], edit: ['pencil'], save: ['save'],
  'save-all': ['save-all'], home: ['house'], globe: ['globe'], link: ['link'], 'link-external': ['external-link'], lock: ['lock'],
  unlock: ['lock-open'], menu: ['menu'], replace: ['replace'], 'replace-all': ['replace-all'], sparkle: ['sparkles'],
  'chat-sparkle': ['bot', 'sparkles'], 'go-to-file': ['file-search'], cloud: ['cloud'], 'cloud-download': ['cloud-download'],
  'cloud-upload': ['cloud-upload'], book: ['book-open'], folder: ['folder'], 'folder-opened': ['folder-open'], file: ['file'],
  star: ['star'], 'star-empty': ['star'], tag: ['tag'], key: ['key'], person: ['user'], beaker: ['flask-conical'], rocket: ['rocket'],
  database: ['database'], package: ['package'], tools: ['wrench'], zap: ['zap'], wand: ['wand-sparkles'], sync: ['refresh-cw'],
  'word-wrap': ['wrap-text'], output: ['scroll-text'], 'debug-console': ['square-terminal'], 'list-tree': ['list-tree'],
  'list-flat': ['list'], preview: ['eye'], 'open-preview': ['eye'], 'clear-all': ['brush-cleaning', 'eraser'],
  feedback: ['message-square'], issues: ['circle-alert'],
};

// ---- file icons ----
const fiDir = join(root, 'fileicons-lucide');
rmSync(fiDir, { recursive: true, force: true });
mkdirSync(join(fiDir, 'svg'), { recursive: true });
const defs = {};
const add = (id, icon, color) => {
  writeFileSync(join(fiDir, 'svg', `${id}.svg`), load(icon, color));
  defs[id] = { iconPath: `./svg/${id}.svg` };
};
const icons = Object.fromEntries(Object.entries(fileIconNames).map(([id, c]) => [id, pick(...c)]));
for (const [id, icon] of Object.entries(icons)) add(id, icon, fileColors[id]);
const folderNames = {}, folderNamesExpanded = {};
for (const [name, color] of Object.entries(folders)) {
  const id = `folder_${name.replace(/[^a-z0-9]/gi, '_')}`;
  add(id, icons._folder, color); add(id + '_open', icons._folder_open, color);
  folderNames[name] = id; folderNamesExpanded[name] = id + '_open';
}
writeFileSync(join(fiDir, 'icons.json'), JSON.stringify({
  hidesExplorerArrows: false, iconDefinitions: defs,
  file: '_file', folder: '_folder', folderExpanded: '_folder_open', rootFolder: '_folder', rootFolderExpanded: '_folder_open',
  fileExtensions: ext, fileNames: names, languageIds: langs, folderNames, folderNamesExpanded,
}, null, 2) + '\n');

// ---- product icons ----
const piDir = join(root, 'producticons-lucide');
rmSync(join(piDir, 'svg'), { recursive: true, force: true });
mkdirSync(join(piDir, 'svg'), { recursive: true });
const glyphs = {}, used = new Map();
let cp = 0xe000;
for (const [id, cands] of Object.entries(ui)) {
  let icon;
  try { icon = pick(...cands); } catch { console.warn(`[lucide] skip ${id}`); continue; }
  if (!used.has(icon)) { used.set(icon, cp++); writeFileSync(join(piDir, 'svg', `${icon}.svg`), load(icon, '#000000')); }
  glyphs[id] = { icon, codepoint: used.get(icon) };
}
writeFileSync(join(piDir, 'glyphs.json'), JSON.stringify(glyphs, null, 2) + '\n');
writeFileSync(join(piDir, 'icons.json'), JSON.stringify({
  fonts: [{ id: 'lucide-ui', src: [{ path: './icons.woff', format: 'woff' }], weight: 'normal', style: 'normal' }],
  iconDefinitions: Object.fromEntries(Object.entries(glyphs).map(([id, g]) => [id, { fontCharacter: '\\' + g.codepoint.toString(16) }])),
}, null, 2) + '\n');
console.log(`lucide: ${Object.keys(defs).length} file icons, ${Object.keys(glyphs).length} UI ids / ${used.size} glyphs`);
