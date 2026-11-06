// Adds aliases to every product icon theme so newer / variant codicon IDs used by VS Code
// (e.g. search-large in the activity bar, git-branch-changes in the status bar) get a glyph
// from the same pack instead of a missing or mismatched icon.
// Run after the generators: node src/aliases.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// codicon id -> list of ids already defined by our themes (first one present wins)
const ALIASES = {
  'toolbar-more': ['ellipsis'], 'drop-down-button': ['chevron-down'], 'extensions-verified-publisher': ['pass'], 'verified': ['pass'],
  'verified-filled': ['pass'], 'mic-filled': ['mic'], 'mic-compact': ['mic'], 'record-small': ['circle-filled'], 'circle-small-filled': ['circle-filled'],
  'circle-small': ['circle-filled'], 'circle': ['circle-filled'], 'primitive-dot': ['circle-filled'], 'agent-compact': ['chat-sparkle', 'sparkle'],
  'settings-compact': ['settings-gear'], 'vm-compact': ['remote-explorer'], 'shield-compact': ['lock'], 'add-compact': ['add'],
  'preserve-case': ['case-sensitive'], 'symbol-string': ['case-sensitive'], 'symbol-key': ['key'], 'json': ['bracket'], 'symbol-namespace': ['bracket'],
  // activity bar / views
  'search-large': ['search'], 'search-fuzzy': ['search'], 'search-sparkle': ['search'], 'search-view-icon': ['search'],
  'explorer-view-icon': ['files'], 'source-control-view-icon': ['source-control'], 'run-view-icon': ['debug-alt'],
  'extensions-view-icon': ['extensions'], 'extensions-large': ['extensions'], 'remote-explorer-view-icon': ['remote-explorer'],
  'test-view-icon': ['beaker'], 'testing-view-icon': ['beaker'], 'timeline-view-icon': ['history'], 'outline-view-icon': ['list-tree'],
  'symbol-class': ['package'], 'symbol-method': ['zap'], 'symbol-field': ['tag'], 'symbol-property': ['tag'], 'symbol-variable': ['tag'],
  'symbol-file': ['file'], 'chat-view-icon': ['chat-sparkle'], 'comments-view-icon': ['comment-discussion'],
  'debug-console-view-icon': ['debug-console'], 'terminal-view-icon': ['terminal'], 'output-view-icon': ['output'],
  'markers-view-icon': ['warning'], 'ports-view-icon': ['globe'], 'open-editors-view-icon': ['book'],
  'accounts-view-bar-icon': ['account'], 'settings-view-bar-icon': ['settings-gear'], 'settings-sync-view-icon': ['sync'],
  'default-view-icon': ['layout'], 'variables-view-icon': ['debug-alt'], 'watch-view-icon': ['eye'], 'callstack-view-icon': ['debug-alt'],
  'breakpoints-view-icon': ['debug-alt'], 'loaded-scripts-view-icon': ['debug-alt'], 'ai-customization-view-icon': ['sparkle'],
  'edit-sessions-view-icon': ['cloud-download'], 'refactor-preview-view-icon': ['sparkle'], 'private-ports-view-icon': ['lock'],
  'voice-transcripts-view-icon': ['history'],
  window: ['layout'], 'empty-window': ['layout'], plug: ['globe'], 'radio-tower': ['globe'], broadcast: ['globe'], remote: ['remote-explorer'],
  'variable-group': ['list-flat'], lightbulb: ['sparkle'], 'light-bulb': ['sparkle'], 'lightbulb-autofix': ['wand'], 'lightbulb-sparkle': ['wand'],
  copilot: ['chat-sparkle', 'sparkle'], 'copilot-compact': ['chat-sparkle', 'sparkle'], agent: ['chat-sparkle', 'sparkle'], mcp: ['extensions'],
  'sparkle-filled': ['sparkle'], 'chat': ['comment'], notebook: ['book'], library: ['book'], 'github': ['git-branch'], 'github-inverted': ['git-branch'],
  // source control / status bar
  'git-branch-changes': ['git-branch'], 'git-branch-staged-changes': ['git-branch'], 'git-branch-conflicts': ['git-branch'],
  'git-fetch': ['sync'], repo: ['source-control'], 'repo-push': ['cloud-upload', 'arrow-up'], 'repo-pull': ['cloud-download', 'arrow-down'],
  'repo-clone': ['cloud-download'], 'repo-sync': ['sync'], 'repo-forked': ['git-merge'], 'sync-ignored': ['sync'], loading: ['sync'],
  'loading-compact': ['sync'], 'tree-item-loading': ['sync'], 'git-stash': ['package'], 'git-stash-apply': ['package'], 'git-stash-pop': ['package'],
  'diff-multiple': ['git-compare'], 'diff-single': ['git-compare'], diff: ['git-compare'], 'compare-changes': ['git-compare'],
  'git-pull-request-done': ['git-pull-request'], 'git-pull-request-create': ['git-pull-request'], 'git-pull-request-draft': ['git-pull-request'],
  'git-pull-request-closed': ['git-pull-request'], 'issue-closed': ['pass'], discard: ['debug-restart', 'refresh'], redo: ['refresh'],
  'debug-disconnect': ['close'], 'debug-alt-small': ['debug-alt'], run: ['play'], 'play-circle': ['play'], 'stop-circle': ['debug-stop'],
  'circle-slash': ['error'], 'error-compact': ['error'], 'warning-compact': ['warning'], 'check-compact': ['check'], 'bell-slash': ['bell'],
  'bell-slash-dot': ['bell'], question: ['info'], 'report-question': ['info'], 'dialog-warning': ['warning'], shield: ['lock'],
  'workspace-trusted': ['lock'], 'workspace-untrusted': ['unlock'], 'lock-small': ['lock'], unverified: ['warning'],
  // generic UI
  'close-small': ['close'], 'close-compact': ['close'], 'close-all': ['close'], x: ['close'], 'remove-close': ['close'], 'close-dirty': ['close'],
  'chevron-right-compact': ['chevron-right'], 'chevron-down-compact': ['chevron-down'], 'arrow-up-compact': ['arrow-up'],
  'tree-item-expanded': ['chevron-down'], more: ['ellipsis'], 'arrow-swap': ['replace'], 'star-full': ['star'], bookmark: ['tag'],
  archive: ['package'], server: ['database'], vm: ['remote-explorer'], 'device-mobile': ['remote-explorer'], wrench: ['tools'],
  'file-code': ['file'], 'file-media': ['file'], 'file-text': ['file'], 'new-line': ['word-wrap'], pencil: ['edit'], trashcan: ['trash'],
  clock: ['history'], calendar: ['history'], target: ['search'], inspect: ['search'], 'layout-centered': ['layout'], fold: ['collapse-all'],
  'terminal-powershell': ['terminal'], 'terminal-tmux': ['terminal'], 'terminal-bash': ['terminal'], code: ['file'], checklist: ['check-all'],
  'circle-large-outline': ['pass'], 'pass-filled': ['pass'], send: ['arrow-right'], reply: ['arrow-left'], move: ['arrow-right'],
  'settings-gear': ['gear'], 'gear': ['settings-gear'], 'person': ['account'], 'account': ['person'], 'organization': ['account'],
  'globe': ['link-external'], 'link-external': ['globe'], 'home': ['folder'], 'record': ['play'], 'record-keys': ['play'], 'thumbsup': ['check'],
  'pin': ['pinned'], 'pinned': ['pin'], 'save-all': ['save'], 'new-file': ['file'], 'new-folder': ['folder'], 'output': ['list-flat'],
  'debug-console': ['terminal'], 'debug': ['debug-alt'], 'debug-alt': ['debug'],
};

const themeFiles = [];
for (const d of readdirSync(root)) {
  if (!d.startsWith('producticons')) continue;
  for (const f of ['icons.json', 'hugeicons-ui.json']) if (existsSync(join(root, d, f))) themeFiles.push(join(root, d, f));
}
for (const f of themeFiles) {
  const t = JSON.parse(readFileSync(f, 'utf8'));
  const defs = t.iconDefinitions;
  let added = 0;
  // two passes so aliases of aliases resolve
  for (let pass = 0; pass < 2; pass++) {
    for (const [id, targets] of Object.entries(ALIASES)) {
      if (defs[id]) continue;
      const tgt = targets.find((x) => defs[x]);
      if (tgt) { defs[id] = { ...defs[tgt] }; added++; }
    }
  }
  // any "<id>-compact" variant VS Code uses gets the same glyph as "<id>"
  for (const id of Object.keys(defs)) if (!defs[`${id}-compact`]) { defs[`${id}-compact`] = { ...defs[id] }; added++; }
  writeFileSync(f, JSON.stringify(t, null, 2) + '\n');
  console.log(`${f.slice(root.length + 1)}: +${added} aliases (${Object.keys(defs).length} ids)`);
}
