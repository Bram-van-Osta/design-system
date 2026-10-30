import { aliasTarget, ColorScheme, type Tokens } from './schema.ts';
import { textStyleVariables } from './text-style.ts';

type Declaration = readonly [property: string, value: string];

// The light theme by default, the dark one when the system asks for it, and either one forced by
// data-theme, on the root or on any element. Aliases stay var() references, declared again in
// every theme block, so that a dark subtree resolves them with its own colors.
export function renderTokensCss(tokens: Tokens): string {
  const light = colorDeclarations(tokens, ColorScheme.light);
  const dark = colorDeclarations(tokens, ColorScheme.dark);
  return [
    `/* ${tokens.name}: the tokens, generated from tokens.json by @bram-van-osta/tokens. */`,
    block(":root,\n[data-theme='light']", light),
    `@media (prefers-color-scheme: dark) {\n${indent(block(":root:not([data-theme='light'])", dark))}\n}`,
    block("[data-theme='dark']", dark),
    block(':root', themeIndependentDeclarations(tokens)),
  ].join('\n\n');
}

function colorDeclarations(tokens: Tokens, scheme: ColorScheme): Declaration[] {
  return [
    ['color-scheme', scheme],
    ...tokens.color.tokens.map(
      (token): Declaration => [`--${token.name}`, colorValue(token.value[scheme])],
    ),
  ];
}

function colorValue(value: string): string {
  const target = aliasTarget(value);
  return target === null ? value : `var(--${target})`;
}

function themeIndependentDeclarations(tokens: Tokens): Declaration[] {
  return [
    ...Object.entries(tokens.type.families).map(
      ([family, stack]): Declaration => [`--font-${family}`, stack],
    ),
    ...tokens.type.groups
      .flatMap((group) => group.styles.flatMap(textStyleVariables))
      .map(([name, value]): Declaration => [`--${name}`, value]),
    ...[
      ...tokens.spacing.tokens,
      ...tokens.radius.tokens,
      ...tokens.size.tokens,
      ...tokens.border.tokens,
    ].map((token): Declaration => [`--${token.name}`, token.value]),
  ];
}

function block(selector: string, declarations: readonly Declaration[]): string {
  const body = declarations.map(([property, value]) => `  ${property}: ${value};`).join('\n');
  return `${selector} {\n${body}\n}`;
}

function indent(css: string): string {
  return css
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n');
}
