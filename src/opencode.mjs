// Generates the OpenCode (terminal UI) version of Pigment Lampblack in OpenCode's V2 theme format.
// Output: opencode/pigment-lampblack.json. Install: copy to ~/.config/opencode/themes/
// Run: node src/opencode.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Same palette as the VS Code theme (src/build.mjs)
const k = { bg: '#000000', alt: '#0c0c0c', raised: '#121212', line: '#1a1a1a', fg: '#e2e2e2', muted: '#8a8a8a', dim: '#474747', comment: '#5a5a5a' };
const s = {
  kw: '#c792ff', fn: '#5eb4ff', type: '#ffd75e', self: '#ff6b9d', prop: '#5ce1f0', param: '#ffab70',
  str: '#8ff27a', num: '#ff8f50', op: '#7fd4ff', punc: '#8a8a8a', esc: '#5ef2c8', err: '#ff4d5e', ok: '#5ef27a', warn: '#ffc94d',
};

// Build a 9-step dark-mode hue scale: 100 = lightest ... 900 = darkest, 200 = the palette colour itself.
const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const scale = (c) => ({
  100: mix(c, '#ffffff', 0.35), 200: c, 300: mix(c, '#000000', 0.15), 400: mix(c, '#000000', 0.3), 500: mix(c, '#000000', 0.45),
  600: mix(c, '#000000', 0.6), 700: mix(c, '#000000', 0.72), 800: mix(c, '#000000', 0.84), 900: mix(c, '#000000', 0.92),
});

const theme = {
  $schema: 'https://opencode.ai/theme.json',
  base: {
    categorical: ['purple', 'blue', 'green', 'orange', 'cyan', 'red'],
    text: {
      base: k.fg,
      muted: k.muted,
      action: {
        primary: { base: '$text.base', $disabled: k.dim, $focused: '#000000', $selected: '#ffffff' },
        secondary: { base: '$text.muted', $hovered: '$text.base' },
        destructive: { base: '#000000', $disabled: k.dim },
      },
      formfield: { base: k.fg, $hovered: '#ffffff', $focused: '#ffffff', $pressed: '#ffffff', $disabled: k.dim, $selected: '#ffffff' },
      feedback: { error: { base: s.err }, warning: { base: s.warn }, success: { base: s.ok }, info: { base: s.fn } },
    },
    background: {
      base: k.bg,
      raised: { base: k.alt, high: k.raised, max: '#1c1c1c' },
      action: {
        primary: { base: 'transparent', $hovered: k.raised, $focused: '#ffffff', $selected: 'transparent' },
        secondary: { base: 'transparent' },
        destructive: { base: s.err },
      },
      formfield: { base: '$background.base' },
      feedback: { error: { base: '$background.base' }, warning: { base: '$background.base' }, success: { base: '$background.base' }, info: { base: '$background.base' } },
    },
    border: { base: '#262626' },
    scrollbar: { base: '#333333' },
    diff: {
      text: { added: s.ok, removed: s.err, context: k.muted, hunkHeader: s.kw },
      background: { added: '#0d2410', removed: '#2a0c10', context: k.alt },
      highlight: { added: '#a3f7a0', removed: '#ff8597' },
      lineNumber: { text: k.dim, background: { added: '#0a1c0c', removed: '#21090c' } },
    },
    syntax: {
      comment: k.comment, keyword: s.kw, function: s.fn, variable: k.fg, string: s.str,
      number: s.num, type: s.type, operator: s.op, punctuation: s.punc,
    },
    markdown: {
      text: k.fg, heading: s.fn, link: s.prop, linkText: s.fn, code: s.str, blockQuote: k.comment, emphasis: s.kw,
      strong: s.type, horizontalRule: k.dim, listItem: s.num, listEnumeration: s.num, image: s.prop, imageText: s.fn, codeBlock: k.fg,
    },
    '@dialog': {
      background: { base: '$background.raised.base', action: { primary: { $hovered: '$background.raised.high' } } },
    },
  },
  dark: {
    hue: {
      gray: { 100: '#ffffff', 200: '#e2e2e2', 300: '#b5b5b5', 400: '#8a8a8a', 500: '#474747', 600: '#1c1c1c', 700: '#121212', 800: '#0c0c0c', 900: '#000000' },
      red: scale(s.err), orange: scale(s.num), yellow: scale(s.type), green: scale(s.str),
      cyan: scale(s.prop), blue: scale(s.fn), purple: scale(s.kw),
      accent: '$hue.purple', interactive: '$hue.blue', neutral: '$hue.gray',
    },
  },
};

mkdirSync(join(root, 'opencode'), { recursive: true });
writeFileSync(join(root, 'opencode', 'pigment-lampblack.json'), JSON.stringify(theme, null, 2) + '\n');
console.log('opencode/pigment-lampblack.json');
