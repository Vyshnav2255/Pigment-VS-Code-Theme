// Builds the Hugeicons-based file icon theme and the SVG sources for the product (UI) icon font.
// Icons: @hugeicons/core-free-icons (MIT). Run: node src/icons.mjs  (then python3 src/font.py)
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const HI = require('@hugeicons/core-free-icons');

const kebab = (s) => s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
const pick = (...names) => {
  for (const n of names) if (HI[n]) return n;
  throw new Error('No Hugeicon found among: ' + names.join(', '));
};
function svg(name, color) {
  const body = HI[name].map(([tag, attrs]) => {
    const a = Object.entries(attrs).filter(([k]) => k !== 'key')
      .map(([k, v]) => `${kebab(k)}="${String(v).replace(/currentColor/g, color)}"`).join(' ');
    return `<${tag} ${a}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">${body}</svg>\n`;
}

// ---------- File icon theme ----------
import { C, fileColors, hugeFileIcons, ext, names, langs, folders } from './filemap.mjs';
const fileIcons = Object.fromEntries(Object.entries(hugeFileIcons).map(([id, c]) => [id, [pick(...c), fileColors[id]]]));

const fiDir = join(root, 'fileicons');
rmSync(fiDir, { recursive: true, force: true });
mkdirSync(join(fiDir, 'svg'), { recursive: true });
const defs = {};
const addDef = (id, icon, color) => {
  writeFileSync(join(fiDir, 'svg', `${id}.svg`), svg(icon, color));
  defs[id] = { iconPath: `./svg/${id}.svg` };
};
for (const [id, [icon, color]] of Object.entries(fileIcons)) addDef(id, icon, color);
const folderNames = {}, folderNamesExpanded = {};
for (const [name, color] of Object.entries(folders)) {
  const id = `folder_${name.replace(/[^a-z0-9]/gi, '_')}`;
  addDef(id, fileIcons._folder[0], color);
  addDef(id + '_open', fileIcons._folder_open[0], color);
  folderNames[name] = id; folderNamesExpanded[name] = id + '_open';
}
const iconTheme = {
  hidesExplorerArrows: false,
  iconDefinitions: defs,
  file: '_file', folder: '_folder', folderExpanded: '_folder_open', rootFolder: '_folder', rootFolderExpanded: '_folder_open',
  fileExtensions: ext, fileNames: names, languageIds: langs, folderNames, folderNamesExpanded,
};
writeFileSync(join(fiDir, 'pitch-black-icons.json'), JSON.stringify(iconTheme, null, 2) + '\n');

// ---------- Product (UI) icons: codicon id -> Hugeicon ----------
const ui = {
  mic: ['Mic01Icon', 'MicIcon'], 'case-sensitive': ['TextFontIcon', 'TextIcon'], 'whole-word': ['TextIcon', 'TextFontIcon'], regex: ['AsteriskIcon', 'CodeIcon'], 'circle-filled': ['CircleIcon'], bracket: ['BracesIcon', 'CodeIcon'],
  files: ['Files02Icon', 'Files01Icon', 'File02Icon'], search: ['Search01Icon', 'SearchIcon'],
  'source-control': ['GitBranchIcon'], 'debug-alt': ['Bug01Icon', 'BugIcon'], 'debug-alt-small': ['Bug01Icon'], debug: ['Bug01Icon'],
  extensions: ['PuzzleIcon'], 'remote-explorer': ['ComputerIcon', 'LaptopIcon'], account: ['UserCircleIcon'],
  'settings-gear': ['Settings01Icon', 'Settings02Icon'], gear: ['Settings01Icon'], settings: ['Settings02Icon'],
  close: ['Cancel01Icon'], add: ['Add01Icon'], plus: ['Add01Icon'], remove: ['Remove01Icon', 'MinusSignIcon'],
  trash: ['Delete02Icon'], refresh: ['Refresh01Icon', 'RefreshIcon'], copy: ['Copy01Icon'], filter: ['FilterHorizontalIcon', 'FilterIcon'],
  'filter-filled': ['FilterHorizontalIcon'], ellipsis: ['MoreHorizontalIcon'], 'kebab-vertical': ['MoreVerticalIcon'],
  'new-file': ['FileAddIcon', 'File01Icon'], 'new-folder': ['FolderAddIcon'], 'collapse-all': ['ListCollapseIcon', 'CollapseIcon'],
  'expand-all': ['ExpandIcon'],
  'chevron-right': ['ArrowRight01Icon'], 'chevron-down': ['ArrowDown01Icon'], 'chevron-left': ['ArrowLeft01Icon'], 'chevron-up': ['ArrowUp01Icon'],
  'arrow-right': ['ArrowRight02Icon'], 'arrow-left': ['ArrowLeft02Icon'], 'arrow-up': ['ArrowUp02Icon'], 'arrow-down': ['ArrowDown02Icon'],
  terminal: ['ComputerTerminal01Icon', 'TerminalIcon'], 'terminal-bash': ['ComputerTerminal01Icon'],
  'split-horizontal': ['Layout2ColumnIcon', 'SquareSplitHorizontalIcon'], 'split-vertical': ['Layout2RowIcon', 'SquareSplitVerticalIcon'],
  'layout-sidebar-left': ['SidebarLeftIcon'], 'layout-sidebar-left-off': ['SidebarLeftIcon'],
  'layout-sidebar-right': ['SidebarRightIcon'], 'layout-sidebar-right-off': ['SidebarRightIcon'],
  'layout-panel': ['SidebarBottomIcon', 'PanelBottomIcon'], 'layout-panel-off': ['SidebarBottomIcon', 'PanelBottomIcon'],
  layout: ['Layout01Icon', 'LayoutIcon'], 'screen-full': ['ArrowExpand01Icon', 'FullScreenIcon'], 'screen-normal': ['ArrowShrink01Icon', 'MinimizeScreenIcon'],
  'git-commit': ['GitCommitIcon'], 'git-pull-request': ['GitPullRequestIcon'], 'git-compare': ['GitCompareIcon'], 'git-merge': ['GitMergeIcon'],
  'repo-forked': ['GitForkIcon'], 'git-branch': ['GitBranchIcon'], 'source-control-view-icon': ['GitBranchIcon'],
  check: ['Tick02Icon', 'CheckIcon'], 'check-all': ['CheckCheckIcon', 'TickDouble02Icon'],
  error: ['CancelCircleIcon'], warning: ['Alert02Icon', 'AlertIcon'], info: ['InformationCircleIcon', 'InfoIcon'],
  pass: ['CheckmarkCircle02Icon'], 'pass-filled': ['CheckmarkCircle02Icon'],
  bell: ['Notification01Icon', 'BellIcon'], 'bell-dot': ['BellDotIcon', 'Notification02Icon'],
  play: ['PlayIcon'], 'debug-start': ['PlayIcon'], 'run-all': ['PlayIcon'], 'debug-pause': ['PauseIcon'], 'debug-stop': ['StopIcon', 'SquareStopIcon'],
  'debug-restart': ['Refresh01Icon'], 'debug-continue': ['NextIcon', 'PlayIcon'],
  comment: ['Comment01Icon', 'CommentIcon'], 'comment-discussion': ['BubbleChatIcon'],
  history: ['HistoryIcon'], eye: ['EyeIcon', 'ViewIcon'], 'eye-closed': ['ViewOffIcon', 'EyeOffIcon'],
  pin: ['PinIcon', 'Pin02Icon'], pinned: ['PinIcon', 'Pin02Icon'], edit: ['PencilEdit02Icon', 'PenIcon'], save: ['FloppyDiskIcon', 'SaveIcon'],
  'save-all': ['SaveAllIcon', 'FloppyDiskIcon'], home: ['Home01Icon'], globe: ['Globe02Icon', 'GlobeIcon'], link: ['Link01Icon'],
  'link-external': ['LinkSquare02Icon', 'ExternalLinkIcon'], lock: ['SquareLock02Icon', 'LockIcon'], unlock: ['SquareUnlock02Icon', 'LockOpenIcon'],
  menu: ['Menu01Icon'], replace: ['ReplaceIcon'], 'replace-all': ['ReplaceAllIcon'], sparkle: ['SparklesIcon'], 'chat-sparkle': ['AiChat02Icon'],
  'go-to-file': ['FileSearchIcon', 'Search01Icon'], cloud: ['CloudIcon'], 'cloud-download': ['CloudDownloadIcon'], 'cloud-upload': ['CloudUploadIcon'],
  book: ['Book02Icon', 'BookOpen01Icon'], folder: ['Folder01Icon'], 'folder-opened': ['FolderOpenIcon'], file: ['File02Icon'],
  star: ['StarIcon'], 'star-empty': ['StarIcon'], tag: ['Tag01Icon'], key: ['Key01Icon'], person: ['UserIcon'],
  beaker: ['TestTube01Icon'], rocket: ['Rocket01Icon', 'RocketIcon'], database: ['Database01Icon'], package: ['Package01Icon'],
  tools: ['Wrench01Icon', 'WrenchIcon'], zap: ['ZapIcon'], wand: ['MagicWand01Icon'], sync: ['Refresh01Icon'],
  'word-wrap': ['TextWrapIcon'], output: ['TaskDone01Icon', 'FileTextIcon'], 'debug-console': ['ComputerTerminal02Icon'],
  'list-tree': ['FlowConnectionIcon', 'ListViewIcon'], 'list-flat': ['ListViewIcon', 'Menu01Icon'], preview: ['ViewIcon', 'EyeIcon'],
  'open-preview': ['ViewIcon', 'EyeIcon'], 'clear-all': ['Clean', 'Delete02Icon'], feedback: ['Comment01Icon'], 'issues': ['AlertCircleIcon'],
};
const piDir = join(root, 'producticons');
rmSync(piDir, { recursive: true, force: true });
mkdirSync(join(piDir, 'svg'), { recursive: true });
const glyphs = {};
let cp = 0xe000;
const used = new Map();
for (const [id, candidates] of Object.entries(ui)) {
  let icon;
  try { icon = pick(...candidates); } catch { console.warn('skip ' + id); continue; }
  if (!used.has(icon)) {
    used.set(icon, cp++);
    writeFileSync(join(piDir, 'svg', `${icon}.svg`), svg(icon, '#000000'));
  }
  glyphs[id] = { icon, codepoint: used.get(icon) };
}
writeFileSync(join(piDir, 'glyphs.json'), JSON.stringify(glyphs, null, 2) + '\n');
const productTheme = {
  fonts: [{ id: 'hugeicons-ui', src: [{ path: './hugeicons-ui.woff', format: 'woff' }], weight: 'normal', style: 'normal' }],
  iconDefinitions: Object.fromEntries(Object.entries(glyphs).map(([id, g]) => [id, { fontCharacter: '\\' + g.codepoint.toString(16) }])),
};
writeFileSync(join(piDir, 'hugeicons-ui.json'), JSON.stringify(productTheme, null, 2) + '\n');
console.log(`file icons: ${Object.keys(defs).length}, UI icons: ${Object.keys(glyphs).length} ids / ${used.size} glyphs`);
