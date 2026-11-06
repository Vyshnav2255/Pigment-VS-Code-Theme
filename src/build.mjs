// Pitch Black: a true-black (#000000) VS Code theme. Run: node src/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const a = (h, x) => h + Math.round(x * 255).toString(16).padStart(2, '0');
const N = '#00000000';

const k = {
  bg: '#000000', alt: '#0c0c0c', raised: '#121212', line: '#1a1a1a',
  fg: '#e2e2e2', muted: '#8a8a8a', dim: '#474747', comment: '#5a5a5a', accent: '#ffffff',
};
const s = {
  kw: '#c792ff', fn: '#5eb4ff', type: '#ffd75e', self: '#ff6b9d', prop: '#5ce1f0', param: '#ffab70',
  str: '#8ff27a', num: '#ff8f50', op: '#7fd4ff', punc: '#8a8a8a', esc: '#5ef2c8', err: '#ff4d5e', ok: '#5ef27a', warn: '#ffc94d',
};

const ac = k.accent;
const colors = {
  focusBorder: '#ffffff33', foreground: k.fg, descriptionForeground: k.muted, errorForeground: s.err,
  'icon.foreground': k.muted, 'widget.shadow': '#00000000', 'selection.background': '#ffffff30',
  'textLink.foreground': s.fn, 'textLink.activeForeground': s.fn, 'sash.hoverBorder': '#ffffff40',
  contrastBorder: N,
  // VS Code 1.14x "modern" layout: panels are drawn as surfaces/cards with their own outline
  'surface.background': k.bg, 'surface.border': k.line, 'editor.border': k.line,
  'modernPanel.border': k.line, 'modernActivityBar.border': k.line,
  'agentsPanel.background': k.bg, 'agentsPanel.border': k.line, 'agentsBottomPanel.border': k.line,
  'notificationCenter.border': k.line, 'notificationToast.border': k.line, 'panelInput.border': k.line,
  'welcomePage.tileBorder': k.line, 'multiDiffEditor.border': k.line, 'tree.tableColumnsBorder': k.line,

  'editor.background': k.bg, 'editor.foreground': k.fg,
  'editorLineNumber.foreground': k.dim, 'editorLineNumber.activeForeground': k.fg,
  'editorCursor.foreground': ac,
  'editor.lineHighlightBackground': '#0d0d0d', 'editor.lineHighlightBorder': N,
  'editor.selectionBackground': '#ffffff26', 'editor.inactiveSelectionBackground': '#ffffff14',
  'editor.selectionHighlightBackground': '#ffffff12', 'editor.wordHighlightBackground': '#ffffff12',
  'editor.wordHighlightStrongBackground': '#ffffff1c',
  'editor.findMatchBackground': a(s.warn, 0.35), 'editor.findMatchHighlightBackground': a(s.warn, 0.15), 'editor.findMatchBorder': s.warn,
  'editor.rangeHighlightBackground': '#ffffff0a',
  'editorWhitespace.foreground': '#2a2a2a', 'editorIndentGuide.background1': '#161616', 'editorIndentGuide.activeBackground1': '#333333',
  'editorRuler.foreground': '#161616', 'editorCodeLens.foreground': k.dim,
  'editorInlayHint.foreground': k.muted, 'editorInlayHint.background': '#ffffff0a',
  'editorBracketMatch.background': '#ffffff14', 'editorBracketMatch.border': '#ffffff40',
  'editorBracketHighlight.foreground1': s.type, 'editorBracketHighlight.foreground2': s.kw, 'editorBracketHighlight.foreground3': s.fn,
  'editorBracketHighlight.foreground4': s.type, 'editorBracketHighlight.foreground5': s.kw, 'editorBracketHighlight.foreground6': s.fn,
  'editorBracketHighlight.unexpectedBracket.foreground': s.err,
  'editorError.foreground': s.err, 'editorWarning.foreground': s.warn, 'editorInfo.foreground': s.fn, 'editorHint.foreground': s.prop,
  'editorGutter.background': k.bg,
  'editorGutter.addedBackground': s.ok, 'editorGutter.modifiedBackground': s.fn, 'editorGutter.deletedBackground': s.err,
  'editorOverviewRuler.border': N, 'editorGroup.border': k.line, 'editorGroupHeader.tabsBackground': k.bg, 'editorGroupHeader.tabsBorder': N,
  'editorGroupHeader.noTabsBackground': k.bg,
  'editorWidget.background': k.alt, 'editorWidget.border': k.line,
  'editorSuggestWidget.background': k.alt, 'editorSuggestWidget.border': k.line, 'editorSuggestWidget.selectedBackground': '#ffffff14',
  'editorSuggestWidget.highlightForeground': s.fn, 'editorSuggestWidget.focusHighlightForeground': s.fn,
  'editorHoverWidget.background': k.alt, 'editorHoverWidget.border': k.line,
  'editorStickyScroll.background': k.bg, 'editorStickyScrollHover.background': k.alt,
  'peekView.border': '#333333', 'peekViewEditor.background': k.alt, 'peekViewResult.background': k.bg, 'peekViewTitle.background': k.bg,
  'peekViewEditor.matchHighlightBackground': a(s.warn, 0.3), 'peekViewResult.matchHighlightBackground': a(s.warn, 0.3),
  'peekViewResult.selectionBackground': '#ffffff14',

  'tab.activeBackground': k.bg, 'tab.inactiveBackground': k.bg, 'tab.activeForeground': '#ffffff', 'tab.inactiveForeground': k.dim,
  'tab.border': N, 'tab.activeBorder': ac, 'tab.activeBorderTop': N, 'tab.hoverBackground': k.bg, 'tab.hoverForeground': k.fg,
  'tab.unfocusedActiveBorder': '#ffffff40', 'tab.unfocusedActiveForeground': k.muted, 'tab.unfocusedInactiveForeground': k.dim,
  'tab.activeModifiedBorder': ac,

  'activityBar.background': k.bg, 'activityBar.foreground': '#ffffff', 'activityBar.inactiveForeground': k.dim,
  'activityBar.border': N, 'activityBar.activeBorder': ac, 'activityBar.activeBackground': N,
  'activityBarBadge.background': '#ffffff', 'activityBarBadge.foreground': '#000000',
  'activityBarTop.foreground': '#ffffff', 'activityBarTop.inactiveForeground': k.dim, 'activityBarTop.activeBorder': ac,
  'sideBar.background': k.bg, 'sideBar.foreground': k.muted, 'sideBar.border': k.line,
  'sideBarTitle.foreground': k.muted, 'sideBarSectionHeader.background': k.bg, 'sideBarSectionHeader.foreground': k.fg, 'sideBarSectionHeader.border': N,
  'list.activeSelectionBackground': '#ffffff14', 'list.activeSelectionForeground': '#ffffff',
  'list.inactiveSelectionBackground': '#ffffff0d', 'list.inactiveSelectionForeground': k.fg,
  'list.hoverBackground': '#ffffff0a', 'list.hoverForeground': k.fg, 'list.focusOutline': N, 'list.inactiveFocusOutline': N,
  'list.focusBackground': '#ffffff14', 'list.highlightForeground': '#ffffff', 'list.focusHighlightForeground': '#ffffff',
  'list.errorForeground': s.err, 'list.warningForeground': s.warn, 'list.deemphasizedForeground': k.dim,
  'tree.indentGuidesStroke': '#222222', 'tree.inactiveIndentGuidesStroke': '#141414',
  'gitDecoration.modifiedResourceForeground': s.fn, 'gitDecoration.untrackedResourceForeground': s.ok,
  'gitDecoration.addedResourceForeground': s.ok, 'gitDecoration.deletedResourceForeground': s.err,
  'gitDecoration.ignoredResourceForeground': k.dim, 'gitDecoration.conflictingResourceForeground': s.num,
  'gitDecoration.submoduleResourceForeground': s.prop,

  'titleBar.activeBackground': k.bg, 'titleBar.activeForeground': k.muted, 'titleBar.inactiveBackground': k.bg,
  'titleBar.inactiveForeground': k.dim, 'titleBar.border': k.line,
  'commandCenter.background': k.alt, 'commandCenter.foreground': k.muted, 'commandCenter.border': k.line,
  'commandCenter.activeBackground': k.raised, 'commandCenter.activeBorder': '#262626',
  'statusBar.background': k.bg, 'statusBar.foreground': k.muted, 'statusBar.border': k.line, 'statusBar.noFolderBackground': k.bg,
  'statusBar.debuggingBackground': k.bg, 'statusBar.debuggingForeground': s.num, 'statusBar.focusBorder': N,
  'statusBarItem.hoverBackground': '#ffffff14', 'statusBarItem.remoteBackground': k.bg, 'statusBarItem.remoteForeground': k.fg,
  'statusBarItem.prominentBackground': k.bg, 'statusBarItem.prominentForeground': k.fg,
  'panel.background': k.bg, 'panel.border': k.line, 'panelTitle.activeBorder': ac,
  'panelTitle.activeForeground': '#ffffff', 'panelTitle.inactiveForeground': k.dim, 'panelSectionHeader.background': k.bg,
  'breadcrumb.foreground': k.muted, 'breadcrumb.focusForeground': k.fg, 'breadcrumb.activeSelectionForeground': '#ffffff', 'breadcrumb.background': k.bg,

  'input.background': k.alt, 'input.foreground': k.fg, 'input.border': k.line, 'input.placeholderForeground': k.dim,
  'inputOption.activeBorder': '#ffffff60', 'inputOption.activeBackground': '#ffffff1a', 'inputOption.activeForeground': '#ffffff',
  'inputValidation.errorBorder': s.err, 'inputValidation.errorBackground': k.alt,
  'dropdown.background': k.alt, 'dropdown.border': k.line, 'dropdown.foreground': k.fg, 'dropdown.listBackground': k.alt,
  'button.background': '#ffffff', 'button.foreground': '#000000', 'button.hoverBackground': '#d9d9d9', 'button.border': N,
  'button.secondaryBackground': k.raised, 'button.secondaryForeground': k.fg, 'button.secondaryHoverBackground': '#1c1c1c',
  'badge.background': '#262626', 'badge.foreground': '#ffffff', 'progressBar.background': '#ffffff',
  'scrollbar.shadow': N, 'scrollbarSlider.background': '#ffffff12', 'scrollbarSlider.hoverBackground': '#ffffff20',
  'scrollbarSlider.activeBackground': '#ffffff30',
  'checkbox.background': k.alt, 'checkbox.border': '#262626', 'checkbox.foreground': '#ffffff',
  'toolbar.hoverBackground': '#ffffff14',
  'quickInput.background': k.alt, 'quickInputTitle.background': k.alt, 'quickInputList.focusBackground': '#ffffff14',
  'quickInputList.focusForeground': '#ffffff', 'pickerGroup.foreground': k.muted, 'pickerGroup.border': k.line,
  'menu.background': k.alt, 'menu.foreground': k.fg, 'menu.selectionBackground': '#ffffff14', 'menu.selectionForeground': '#ffffff',
  'menu.separatorBackground': k.line, 'menu.border': k.line,
  'notifications.background': k.alt, 'notifications.border': k.line, 'notificationCenterHeader.background': k.alt,
  'notificationLink.foreground': s.fn, 'notificationsInfoIcon.foreground': s.fn, 'notificationsWarningIcon.foreground': s.warn,
  'notificationsErrorIcon.foreground': s.err, 'debugToolBar.background': k.alt,
  'chat.requestBackground': k.bg, 'chat.avatarBackground': k.alt,

  'terminal.background': k.bg, 'terminal.foreground': k.fg, 'terminalCursor.foreground': ac, 'terminal.selectionBackground': '#ffffff30',
  'terminal.border': k.line, 'terminal.tab.activeBorder': ac,
  'terminal.ansiBlack': '#1a1a1a', 'terminal.ansiBrightBlack': '#5a5a5a',
  'terminal.ansiRed': '#ff5c72', 'terminal.ansiBrightRed': '#ff8597',
  'terminal.ansiGreen': '#7ef27a', 'terminal.ansiBrightGreen': '#a3f7a0',
  'terminal.ansiYellow': '#ffd75e', 'terminal.ansiBrightYellow': '#ffe38a',
  'terminal.ansiBlue': '#5eb4ff', 'terminal.ansiBrightBlue': '#8ccaff',
  'terminal.ansiMagenta': '#c792ff', 'terminal.ansiBrightMagenta': '#d9b3ff',
  'terminal.ansiCyan': '#5ce1f0', 'terminal.ansiBrightCyan': '#8deaf5',
  'terminal.ansiWhite': '#d0d0d0', 'terminal.ansiBrightWhite': '#ffffff',

  'diffEditor.insertedTextBackground': a(s.ok, 0.14), 'diffEditor.removedTextBackground': a(s.err, 0.14),
  'diffEditor.insertedLineBackground': a(s.ok, 0.07), 'diffEditor.removedLineBackground': a(s.err, 0.07),
  'merge.currentHeaderBackground': a(s.ok, 0.25), 'merge.incomingHeaderBackground': a(s.fn, 0.25),
  'minimap.background': k.bg, 'minimap.selectionHighlight': '#ffffff40', 'minimapGutter.addedBackground': s.ok,
  'minimapGutter.modifiedBackground': s.fn, 'minimapGutter.deletedBackground': s.err,
  'welcomePage.tileBackground': k.alt, 'welcomePage.tileHoverBackground': k.raised, 'walkThrough.embeddedEditorBackground': k.alt,
  'textCodeBlock.background': k.alt, 'textBlockQuote.background': k.alt, 'textBlockQuote.border': '#333333', 'textPreformat.foreground': s.str,
};

const t = (name, scope, fg, fontStyle) => ({ name, scope, settings: { ...(fg && { foreground: fg }), ...(fontStyle !== undefined && { fontStyle }) } });
const tokenColors = [
  t('Comments', ['comment', 'punctuation.definition.comment', 'string.comment'], k.comment, 'italic'),
  t('Variables', ['variable', 'variable.other.readwrite', 'meta.definition.variable', 'support.variable'], k.fg),
  t('Parameters', ['variable.parameter', 'meta.function.parameters variable'], s.param, 'italic'),
  t('this / self', ['variable.language', 'variable.language.this', 'variable.language.self', 'variable.language.super'], s.self, 'italic'),
  t('Keywords', ['keyword', 'keyword.control', 'keyword.other', 'storage.modifier', 'storage.type', 'keyword.declaration'], s.kw),
  t('Operators', ['keyword.operator', 'storage.type.function.arrow', 'punctuation.accessor', 'punctuation.separator.key-value'], s.op),
  t('Punctuation', ['punctuation', 'meta.brace', 'punctuation.terminator', 'punctuation.separator'], s.punc),
  t('Functions', ['entity.name.function', 'support.function', 'variable.function', 'entity.name.method', 'meta.function-call entity.name.function'], s.fn),
  t('Types', ['entity.name.type', 'entity.name.class', 'support.class', 'support.type', 'entity.other.inherited-class', 'entity.name.namespace', 'meta.type.annotation entity.name.type', 'storage.type.primitive', 'storage.type.java', 'storage.type.cs'], s.type),
  t('Strings', ['string', 'string.quoted', 'string.template', 'punctuation.definition.string'], s.str),
  t('Template expressions', ['punctuation.definition.template-expression', 'punctuation.section.embedded'], s.kw),
  t('Escapes & regex', ['constant.character.escape', 'string.regexp', 'constant.other.character-class.regexp'], s.esc),
  t('Numbers & constants', ['constant.numeric', 'constant.language', 'constant.other', 'support.constant', 'variable.other.constant', 'variable.other.enummember'], s.num),
  t('Properties', ['variable.other.property', 'variable.other.object.property', 'meta.object-literal.key', 'support.type.property-name', 'entity.name.tag.yaml'], s.prop),
  t('Tags', ['entity.name.tag', 'meta.tag.sgml'], s.self),
  t('Tag punctuation', ['punctuation.definition.tag'], s.punc),
  t('Components', ['support.class.component'], s.type),
  t('Attributes', ['entity.other.attribute-name'], s.param, 'italic'),
  t('CSS selectors', ['entity.other.attribute-name.class.css', 'entity.other.attribute-name.id.css', 'entity.name.tag.css', 'entity.other.attribute-name.pseudo-class.css'], s.type, ''),
  t('CSS properties', ['support.type.property-name.css'], s.prop),
  t('CSS values', ['support.constant.property-value.css', 'keyword.other.unit', 'constant.other.color'], s.num),
  t('Decorators', ['meta.decorator', 'punctuation.decorator', 'entity.name.function.decorator', 'storage.type.annotation', 'meta.annotation'], s.type),
  t('Markdown headings', ['markup.heading', 'entity.name.section.markdown', 'punctuation.definition.heading.markdown'], s.fn, 'bold'),
  t('Markdown bold', ['markup.bold'], s.type, 'bold'),
  t('Markdown italic', ['markup.italic'], s.kw, 'italic'),
  t('Markdown code', ['markup.inline.raw', 'markup.fenced_code', 'markup.raw'], s.str),
  t('Markdown links', ['markup.underline.link', 'string.other.link'], s.prop),
  t('Markdown quote', ['markup.quote'], k.comment, 'italic'),
  t('Diff inserted', ['markup.inserted'], s.ok), t('Diff deleted', ['markup.deleted'], s.err), t('Diff changed', ['markup.changed'], s.fn),
  // ---- Language-specific accents (kept light-handed) ----
  // HTML / JSX
  t('HTML tags', ['entity.name.tag.html', 'entity.name.tag.js', 'entity.name.tag.tsx', 'entity.name.tag.jsx', 'entity.name.tag.vue', 'entity.name.tag.svelte'], s.self),
  t('JSX components', ['support.class.component.js', 'support.class.component.tsx', 'support.class.component.jsx', 'entity.name.tag.custom'], s.type),
  t('HTML attributes', ['entity.other.attribute-name.html', 'entity.other.attribute-name.js', 'entity.other.attribute-name.tsx', 'entity.other.attribute-name.jsx'], s.param, 'italic'),
  t('HTML entities', ['constant.character.entity.html', 'punctuation.definition.entity.html'], s.esc),
  t('HTML doctype', ['meta.tag.metadata.doctype.html', 'entity.name.tag.doctype.html'], k.muted),
  // CSS / SCSS
  t('CSS property names', ['support.type.property-name.css', 'support.type.property-name.scss', 'support.type.vendored.property-name.css', 'meta.property-name.scss'], s.prop),
  t('CSS class selectors', ['entity.other.attribute-name.class.css', 'entity.other.attribute-name.class.scss'], s.type, ''),
  t('CSS id selectors', ['entity.other.attribute-name.id.css', 'entity.other.attribute-name.id.scss'], s.num, ''),
  t('CSS element selectors', ['entity.name.tag.css', 'entity.name.tag.scss', 'entity.name.tag.reference.scss'], s.self),
  t('CSS pseudo', ['entity.other.attribute-name.pseudo-class.css', 'entity.other.attribute-name.pseudo-element.css'], s.kw, 'italic'),
  t('CSS functions', ['support.function.misc.css', 'support.function.transform.css', 'support.function.gradient.css', 'support.function.url.css'], s.fn),
  t('CSS variables', ['variable.css', 'variable.argument.css', 'variable.scss', 'support.type.custom-property.css', 'variable.other.less'], s.esc),
  t('CSS at-rules', ['keyword.control.at-rule', 'punctuation.definition.keyword.css'], s.kw),
  // JSON
  t('JSON keys', ['support.type.property-name.json', 'support.type.property-name.json.comments'], s.fn),
  t('JSON nested keys', ['meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'], s.prop),
  // YAML / TOML / INI
  t('YAML keys', ['entity.name.tag.yaml'], s.self),
  t('YAML anchors', ['entity.name.type.anchor.yaml', 'variable.other.alias.yaml', 'punctuation.definition.anchor.yaml'], s.type),
  t('TOML keys', ['support.type.property-name.table.toml', 'support.type.property-name.toml', 'keyword.key.toml'], s.self),
  t('TOML tables', ['support.type.property-name.table.toml', 'entity.other.attribute-name.table.toml'], s.type),
  t('INI sections', ['entity.name.section.group-title.ini'], s.type),
  t('INI keys', ['keyword.other.definition.ini'], s.self),
  // Python
  t('Python self/cls', ['variable.parameter.function.language.special.self.python', 'variable.language.special.self.python', 'variable.parameter.function.language.special.cls.python'], s.self, 'italic'),
  t('Python builtins', ['support.function.builtin.python', 'support.type.python'], s.esc),
  t('Python decorators', ['meta.function.decorator.python', 'entity.name.function.decorator.python', 'punctuation.definition.decorator.python'], s.type),
  t('Python f-string braces', ['constant.character.format.placeholder.other.python', 'storage.type.format.python'], s.num),
  t('Python magic methods', ['support.function.magic.python', 'support.variable.magic.python'], s.esc, 'italic'),
  // JS / TS
  t('JS/TS imports', ['variable.other.readwrite.alias', 'meta.import variable.other.readwrite'], k.fg),
  t('JS/TS builtins', ['support.variable.dom', 'support.variable.object.process', 'support.variable.object.node', 'support.class.builtin'], s.esc),
  t('TS type parameters', ['entity.name.type.parameter'], s.type, 'italic'),
  t('TS primitive types', ['support.type.primitive', 'support.type.builtin'], s.esc),
  // Go / Rust / C-family
  t('Go packages', ['entity.name.package.go', 'entity.name.import.go'], s.type),
  t('Rust macros & lifetimes', ['entity.name.function.macro.rust', 'support.macro.rust'], s.esc),
  t('Rust lifetimes', ['entity.name.type.lifetime.rust', 'punctuation.definition.lifetime.rust', 'storage.modifier.lifetime.rust'], s.self, 'italic'),
  t('Preprocessor', ['meta.preprocessor', 'keyword.control.directive', 'punctuation.definition.directive'], s.self),
  // Shell
  t('Shell variables', ['variable.other.normal.shell', 'variable.other.special.shell', 'variable.other.positional.shell', 'punctuation.definition.variable.shell'], s.esc),
  t('Shell commands', ['entity.name.command.shell', 'support.function.builtin.shell'], s.fn),
  t('Shell flags', ['constant.other.option', 'string.unquoted.argument.shell constant.other.option'], s.num),
  // SQL
  t('SQL keywords', ['keyword.other.DML.sql', 'keyword.other.DDL.create.II.sql', 'keyword.other.create.sql', 'keyword.other.sql'], s.kw),
  t('SQL types', ['storage.type.sql'], s.type),
  // Markdown
  t('Markdown h1', ['heading.1.markdown entity.name.section.markdown', 'heading.1.markdown punctuation.definition.heading.markdown'], s.fn, 'bold'),
  t('Markdown h2', ['heading.2.markdown entity.name.section.markdown', 'heading.2.markdown punctuation.definition.heading.markdown'], s.kw, 'bold'),
  t('Markdown h3+', ['heading.3.markdown entity.name.section.markdown', 'heading.4.markdown entity.name.section.markdown', 'heading.5.markdown entity.name.section.markdown', 'heading.6.markdown entity.name.section.markdown'], s.prop, 'bold'),
  t('Markdown list markers', ['punctuation.definition.list.begin.markdown', 'beginning.punctuation.definition.list.markdown'], s.num),
  t('Markdown link text', ['string.other.link.title.markdown', 'string.other.link.description.markdown'], s.fn),
  t('Markdown link URL', ['markup.underline.link.markdown', 'markup.underline.link.image.markdown'], s.prop),
  t('Markdown fence language', ['fenced_code.block.language.markdown'], s.type, 'italic'),
  // Diff / git
  t('Git commit subject', ['meta.scope.message.git-commit', 'meta.subject.git-commit'], k.fg),
  t('Diff header', ['meta.diff.header', 'meta.diff.range'], s.kw),
  // Regex detail
  t('Regex groups', ['punctuation.definition.group.regexp', 'punctuation.definition.character-class.regexp'], s.type),
  t('Regex quantifiers', ['keyword.operator.quantifier.regexp', 'keyword.control.anchor.regexp'], s.num),
  t('Invalid', ['invalid', 'invalid.illegal'], s.err),
];
const semanticTokenColors = {
  variable: k.fg, 'variable.defaultLibrary': s.self, 'variable.readonly.defaultLibrary': s.num,
  parameter: { foreground: s.param, italic: true }, property: s.prop,
  function: s.fn, method: s.fn, class: s.type, interface: s.type, type: s.type, typeParameter: s.type,
  enum: s.type, struct: s.type, namespace: s.type, enumMember: s.num, keyword: s.kw, decorator: s.type, macro: s.fn,
  selfKeyword: { foreground: s.self, italic: true },
};

// Borderless variant: every divider between panels/bars is removed (black on black, no seams).
const borderless = { ...colors };
for (const key of [
  'editorGroup.border', 'editorGroupHeader.tabsBorder', 'editorGroupHeader.border', 'sideBar.border', 'sideBarSectionHeader.border',
  'activityBar.border', 'panel.border', 'titleBar.border', 'statusBar.border', 'terminal.border', 'tab.border',
  'panelSectionHeader.border', 'panelSection.border', 'sideBarActivityBarTop.border', 'auxiliaryBar.border',
  'editorStickyScroll.border', 'pickerGroup.border', 'window.activeBorder', 'window.inactiveBorder',
  // also every outline, indicator line and shadow that reads as a border
  'contrastBorder', 'contrastActiveBorder', 'focusBorder', 'sash.hoverBorder', 'sideBarStickyScroll.border', 'sideBarTitle.border',
  'activityBarTop.border', 'tab.lastPinnedBorder', 'panelTitle.border', 'panelStickyScroll.border', 'statusBar.focusBorder',
  'statusBarItem.focusBorder', 'editorOverviewRuler.border', 'chat.requestBorder', 'commandCenter.border', 'commandCenter.activeBorder',
  'editorWidget.border', 'editorSuggestWidget.border', 'editorHoverWidget.border', 'notifications.border', 'menu.border', 'menu.separatorBackground',
  'input.border', 'dropdown.border', 'checkbox.border', 'peekView.border', 'diffEditor.border', 'sideBySideEditor.horizontalBorder',
  'sideBySideEditor.verticalBorder', 'notebook.cellBorderColor', 'editorGroup.focusedEmptyBorder', 'quickInput.border', 'keybindingLabel.border',
  'tab.activeBorder', 'tab.activeBorderTop', 'tab.unfocusedActiveBorder', 'tab.unfocusedActiveBorderTop', 'tab.activeModifiedBorder',
  'tab.inactiveModifiedBorder', 'activityBar.activeBorder', 'activityBarTop.activeBorder', 'panelTitle.activeBorder', 'terminal.tab.activeBorder',
  'tree.indentGuidesStroke', 'tree.inactiveIndentGuidesStroke', 'widget.shadow', 'scrollbar.shadow', 'editorStickyScroll.shadow',
  'sideBarStickyScroll.shadow', 'panelStickyScroll.shadow', 'list.focusOutline', 'list.inactiveFocusOutline', 'list.focusAndSelectionOutline',
  'surface.border', 'editor.border', 'modernPanel.border', 'modernActivityBar.border', 'agentsPanel.border', 'agentsBottomPanel.border',
  'notificationCenter.border', 'notificationToast.border', 'panelInput.border', 'welcomePage.tileBorder', 'multiDiffEditor.border',
  'tree.tableColumnsBorder', 'button.secondaryBorder', 'extensionButton.border', 'simpleFindWidget.sashBorder', 'listFilterWidget.outline',
  'keybindingLabel.bottomBorder', 'activityBar.dropBorder', 'tab.dragAndDropBorder', 'tab.selectedBorderTop', 'tab.unfocusedHoverBorder',
  'tab.unfocusedActiveModifiedBorder', 'tab.unfocusedInactiveModifiedBorder', 'notebook.cellToolbarSeparator', 'chat.checkpointSeparator',
  'interactive.activeCodeBorder', 'interactive.inactiveCodeBorder', 'chat.requestCodeBorder', 'diffEditor.unchangedRegionShadow',
]) borderless[key] = N;
// Without edges, popups need a slightly lifted fill to stay readable.
for (const key of ['editorWidget.background', 'editorSuggestWidget.background', 'editorHoverWidget.background', 'quickInput.background',
  'quickInputTitle.background', 'menu.background', 'notifications.background', 'notificationCenterHeader.background', 'debugToolBar.background'])
  borderless[key] = '#141414';

const variants = [['pitch-black.json', 'Pitch Black', colors], ['pitch-black-borderless.json', 'Pitch Black Borderless', borderless]];
mkdirSync(join(root, 'themes'), { recursive: true });
for (const [file, name, c] of variants) {
  writeFileSync(join(root, 'themes', file), JSON.stringify({
    $schema: 'vscode://schemas/color-theme', name, type: 'dark', semanticHighlighting: true,
    colors: c, tokenColors, semanticTokenColors,
  }, null, 2) + '\n');
  console.log(file);
}
