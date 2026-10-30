import type { LengthToken, Tokens } from './schema.ts';
import { textStyleVariables } from './text-style.ts';

type Mapping = readonly [themeKey: string, variable: string];

// Tailwind's own values that the identity replaces: its palette, its families and type scale, its
// rounded corners and its shadows. Without them, a utility outside the identity does not exist.
const RESET_NAMESPACES = [
  'color',
  'font',
  'text',
  'radius',
  'shadow',
  'inset-shadow',
  'drop-shadow',
  'text-shadow',
] as const;

// `inline` makes each utility read the token's own variable (bg-delft: var(--delft)), so that the
// themes and a product's overrides reach it; `reference` keeps Tailwind from declaring variables
// that tokens.css already holds.
export function renderTailwindCss(tokens: Tokens): string {
  const lines = [
    ...RESET_NAMESPACES.map((namespace) => `  --${namespace}-*: initial;`),
    '',
    ...mappings(tokens).map(([themeKey, variable]) => `  --${themeKey}: var(--${variable});`),
  ];
  return [
    `/* ${tokens.name}: the Tailwind 4 theme, generated from tokens.json by @bram-van-osta/tokens. */`,
    "@import './tokens.css';",
    `@theme inline reference {\n${lines.join('\n')}\n}`,
  ].join('\n\n');
}

function mappings(tokens: Tokens): Mapping[] {
  return [
    ['default-font-family', 'font-sans'],
    ['default-mono-font-family', 'font-mono'],
    ...tokens.color.tokens.map((token): Mapping => [`color-${token.name}`, token.name]),
    ...Object.keys(tokens.type.families).map(
      (family): Mapping => [`font-${family}`, `font-${family}`],
    ),
    ...tokens.type.groups
      .flatMap((group) => group.styles.flatMap(textStyleVariables))
      .map(([name]): Mapping => [name, name]),
    ...tokens.spacing.tokens.map(spacingMapping),
    ...tokens.size.tokens.map(spacingMapping),
    ...tokens.radius.tokens.map(
      (token): Mapping => [`radius-${withoutPrefix(token, 'radius-')}`, token.name],
    ),
    ...tokens.border.tokens.map(
      (token): Mapping => [`border-width-${withoutPrefix(token, 'border-')}`, token.name],
    ),
  ];
}

// Spacing keeps its full name (p-space-5), next to Tailwind's numeric scale; sizes join it
// (min-h-target-min, max-w-reading-width).
function spacingMapping(token: LengthToken): Mapping {
  return [`spacing-${token.name}`, token.name];
}

function withoutPrefix(token: LengthToken, prefix: string): string {
  return token.name.slice(prefix.length);
}
