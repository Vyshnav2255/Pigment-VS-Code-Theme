// Builds Phosphor file icon themes + product icon sources in two styles: outline (regular) and fill.
// Icons: @phosphor-icons/core (MIT). Run: node src/phosphor.mjs  (then python3 src/font.py for each producticons-phosphor-* dir)
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileColors, ext, names, langs, folders } from './filemap.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assets = join(root, 'node_modules', '@phosphor-icons', 'core', 'assets');

const STYLES = [
  { id: 'outline', label: 'Outline', dir: 'regular', suffix: '' },
  { id: 'filled', label: 'Filled', dir: 'fill', suffix: '-fill' },
];
const file = (style, name) => join(assets, style.dir, `${name}${style.suffix}.svg`);
const pick = (style, ...cands) => {
  for (const n of cands) if (existsSync(file(style, n))) return n;
  throw new Error(`No Phosphor ${style.id} icon among: ${cands.join(', ')}`);
};
const load = (style, name, color) => readFileSync(file(style, name), 'utf8').replace(/currentColor/g, color);

const fileIconNames = {
  _file: ['file'], _folder: ['folder'], _folder_open: ['folder-open'],
  js: ['file-js'], ts: ['file-ts'], react: ['file-jsx', 'atom'], python: ['file-py'], java: ['coffee', 'file-code'],
  php: ['file-code'], html: ['file-html'], css: ['file-css'], tailwind: ['wind', 'file-css'], json: ['brackets-curly'],
  yaml: ['file-ini', 'brackets-curly'], xml: ['code', 'file-code'], code: ['file-code'], markdown: ['file-md'], text: ['file-txt', 'file-text'],
  csv: ['file-csv'], sql: ['file-sql'], database: ['database'], image: ['file-image'], svg: ['file-svg'], video: ['file-video'],
  audio: ['file-audio'], pdf: ['file-pdf'], zip: ['file-zip'], font: ['text-aa'], shell: ['terminal'], git: ['git-branch'],
  npm: ['npm-logo', 'package'], package: ['package'], lock: ['lock-simple', 'lock'], key: ['key'], license: ['certificate'],
  readme: ['book-open'], settings: ['gear-six'], test: ['flask'], log: ['scroll', 'file-text'], vsix: ['puzzle-piece'],
};

const ui = {
  mic: ['microphone'], 'case-sensitive': ['text-aa'], 'whole-word': ['text-t'], regex: ['asterisk'], 'circle-filled': ['circle'], bracket: ['brackets-curly'],
  files: ['files'], search: ['magnifying-glass'], 'source-control': ['git-branch'], 'debug-alt': ['bug'], 'debug-alt-small': ['bug'],
  debug: ['bug'], extensions: ['puzzle-piece'], 'remote-explorer': ['desktop'], account: ['user-circle'],
  'settings-gear': ['gear'], gear: ['gear'], settings: ['gear-six'], close: ['x'], add: ['plus'], plus: ['plus'], remove: ['minus'],
  trash: ['trash'], refresh: ['arrow-clockwise'], copy: ['copy'], filter: ['funnel'], 'filter-filled': ['funnel'],
  ellipsis: ['dots-three'], 'kebab-vertical': ['dots-three-vertical'], 'new-file': ['file-plus'], 'new-folder': ['folder-plus'],
  'collapse-all': ['arrows-in-line-vertical', 'arrows-in-simple'], 'expand-all': ['arrows-out-line-vertical', 'arrows-out-simple'],
  'chevron-right': ['caret-right'], 'chevron-down': ['caret-down'], 'chevron-left': ['caret-left'], 'chevron-up': ['caret-up'],
  'arrow-right': ['arrow-right'], 'arrow-left': ['arrow-left'], 'arrow-up': ['arrow-up'], 'arrow-down': ['arrow-down'],
  terminal: ['terminal-window'], 'terminal-bash': ['terminal'], 'split-horizontal': ['square-split-horizontal'],
  'split-vertical': ['square-split-vertical'], 'layout-sidebar-left': ['sidebar-simple'], 'layout-sidebar-left-off': ['sidebar-simple'],
  'layout-sidebar-right': ['sidebar', 'sidebar-simple'], 'layout-sidebar-right-off': ['sidebar', 'sidebar-simple'],
  'layout-panel': ['square-half-bottom', 'rows'], 'layout-panel-off': ['square-half-bottom', 'rows'], layout: ['layout'],
  'screen-full': ['arrows-out'], 'screen-normal': ['arrows-in'], 'git-commit': ['git-commit'], 'git-pull-request': ['git-pull-request'],
  'git-compare': ['git-diff'], 'git-merge': ['git-merge'], 'repo-forked': ['git-fork'], 'git-branch': ['git-branch'],
  check: ['check'], 'check-all': ['checks'], error: ['x-circle'], warning: ['warning'], info: ['info'], pass: ['check-circle'],
  'pass-filled': ['check-circle'], bell: ['bell'], 'bell-dot': ['bell-ringing', 'bell'], play: ['play'], 'debug-start': ['play'],
  'run-all': ['play'], 'debug-pause': ['pause'], 'debug-stop': ['stop'], 'debug-restart': ['arrow-clockwise'],
  'debug-continue': ['skip-forward'], comment: ['chat-text'], 'comment-discussion': ['chats'], history: ['clock-counter-clockwise'],
  eye: ['eye'], 'eye-closed': ['eye-slash'], pin: ['push-pin'], pinned: ['push-pin'], edit: ['pencil-simple'], save: ['floppy-disk'],
  'save-all': ['floppy-disk-back', 'floppy-disk'], home: ['house'], globe: ['globe'], link: ['link'], 'link-external': ['arrow-square-out'],
  lock: ['lock'], unlock: ['lock-open'], menu: ['list'], replace: ['swap'], 'replace-all': ['swap'], sparkle: ['sparkle'],
  'chat-sparkle': ['chat-circle-dots'], 'go-to-file': ['file-magnifying-glass', 'magnifying-glass'], cloud: ['cloud'],
  'cloud-download': ['cloud-arrow-down'], 'cloud-upload': ['cloud-arrow-up'], book: ['book-open'], folder: ['folder'],
  'folder-opened': ['folder-open'], file: ['file'], star: ['star'], 'star-empty': ['star'], tag: ['tag'], key: ['key'], person: ['user'],
  beaker: ['flask'], rocket: ['rocket-launch'], database: ['database'], package: ['package'], tools: ['wrench'], zap: ['lightning'],
  wand: ['magic-wand'], sync: ['arrows-clockwise'], 'word-wrap': ['text-align-left'], output: ['note', 'list-dashes'],
  'debug-console': ['terminal'], 'list-tree': ['tree-structure'], 'list-flat': ['list'], preview: ['eye'], 'open-preview': ['eye'],
  'clear-all': ['broom', 'trash'], feedback: ['chat-text'], issues: ['warning-circle'],
};

const pkgThemes = { iconThemes: [], productIconThemes: [] };
for (const style of STYLES) {
  // ---- file icons ----
  const fiDir = join(root, `fileicons-phosphor-${style.id}`);
  rmSync(fiDir, { recursive: true, force: true });
  mkdirSync(join(fiDir, 'svg'), { recursive: true });
  const defs = {};
  const add = (id, icon, color) => {
    writeFileSync(join(fiDir, 'svg', `${id}.svg`), load(style, icon, color));
    defs[id] = { iconPath: `./svg/${id}.svg` };
  };
  const icons = Object.fromEntries(Object.entries(fileIconNames).map(([id, c]) => [id, pick(style, ...c)]));
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
  pkgThemes.iconThemes.push({ id: `pigment-phosphor-${style.id}`, label: `Pigment Phosphor ${style.label}`,
    path: `./fileicons-phosphor-${style.id}/icons.json` });

  // ---- product icons ----
  const piDir = join(root, `producticons-phosphor-${style.id}`);
  rmSync(piDir, { recursive: true, force: true });
  mkdirSync(join(piDir, 'svg'), { recursive: true });
  const glyphs = {}, used = new Map();
  let cp = 0xe000;
  for (const [id, cands] of Object.entries(ui)) {
    let icon;
    try { icon = pick(style, ...cands); } catch { console.warn(`[${style.id}] skip ${id}`); continue; }
    if (!used.has(icon)) { used.set(icon, cp++); writeFileSync(join(piDir, 'svg', `${icon}.svg`), load(style, icon, '#000000')); }
    glyphs[id] = { icon, codepoint: used.get(icon) };
  }
  writeFileSync(join(piDir, 'glyphs.json'), JSON.stringify(glyphs, null, 2) + '\n');
  writeFileSync(join(piDir, 'icons.json'), JSON.stringify({
    fonts: [{ id: `phosphor-${style.id}`, src: [{ path: './icons.woff', format: 'woff' }], weight: 'normal', style: 'normal' }],
    iconDefinitions: Object.fromEntries(Object.entries(glyphs).map(([id, g]) => [id, { fontCharacter: '\\' + g.codepoint.toString(16) }])),
  }, null, 2) + '\n');
  pkgThemes.productIconThemes.push({ id: `pigment-phosphor-${style.id}-ui`, label: `Pigment Phosphor ${style.label} UI`,
    path: `./producticons-phosphor-${style.id}/icons.json` });
  console.log(`phosphor ${style.id}: ${Object.keys(defs).length} file icons, ${Object.keys(glyphs).length} UI ids / ${used.size} glyphs`);
}
writeFileSync(join(root, 'producticons-phosphor.contributes.json'), JSON.stringify(pkgThemes, null, 2) + '\n');
