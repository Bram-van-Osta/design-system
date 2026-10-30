import * as z from 'zod';

// tokens.json keeps the shape of the design system artifact (the "Design System" type on
// claude.ai), so that one can be synced from the other: every family is a list of named entries,
// and a color carries one value per theme.

export const ColorScheme = {
  light: 'light',
  dark: 'dark',
} as const;
export type ColorScheme = (typeof ColorScheme)[keyof typeof ColorScheme];

const FontFamily = {
  serif: 'serif',
  display: 'display',
  sans: 'sans',
  mono: 'mono',
} as const;

const TOKEN_NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const ALIAS = /^\{([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\}$/;
const LENGTH = /^(0|\d+(\.\d+)?(px|em|rem|%))$/;
const LETTER_SPACING = /^-?\d+(\.\d+)?em$/;

const tokenName = z
  .string()
  .regex(TOKEN_NAME, 'A token name is in kebab-case: lowercase letters, digits and hyphens.');
const prefixedTokenName = (prefix: string) =>
  tokenName.startsWith(prefix, `A token of this family is named ${prefix}…`);
const usage = z.string().min(1);

const colorValue = z
  .string()
  .refine(
    (value) => HEX_COLOR.test(value) || ALIAS.test(value),
    'A color is a #RRGGBB hex, or the alias of another color: {name}.',
  );

const lengthToken = (name: z.ZodString) =>
  z.strictObject({
    name,
    value: z.string().regex(LENGTH, 'A length is 0, or a number in px, em, rem or %.'),
    usage,
  });

const colorToken = z.strictObject({
  name: tokenName,
  value: z.strictObject({ light: colorValue, dark: colorValue }),
  usage,
});

const typeStyle = z.strictObject({
  name: tokenName,
  fontSize: z.string().regex(LENGTH),
  lineHeight: z.number().positive(),
  fontWeight: z.number().int().min(100).max(900),
  letterSpacing: z.string().regex(LETTER_SPACING, 'A letter spacing is in em.').optional(),
  sample: z.string().min(1),
  usage,
});

const tokensShape = z.strictObject({
  name: z.string().min(1),
  version: z.literal(1),
  color: z.strictObject({
    themes: z.tuple([
      z.strictObject({ id: z.literal(ColorScheme.light), name: z.string().min(1) }),
      z.strictObject({ id: z.literal(ColorScheme.dark), name: z.string().min(1) }),
    ]),
    tokens: z.array(colorToken).min(1),
  }),
  type: z.strictObject({
    // The faces are served by Fontsource (fonts.css): the artifact keeps no font file.
    fonts: z.tuple([]),
    families: z.strictObject({
      serif: z.string().min(1),
      display: z.string().min(1),
      sans: z.string().min(1),
      mono: z.string().min(1),
    }),
    groups: z.array(
      z.strictObject({
        name: z.string().min(1),
        family: z.enum(FontFamily),
        note: z.string().min(1),
        styles: z.array(typeStyle).min(1),
      }),
    ),
  }),
  spacing: z.strictObject({ tokens: z.array(lengthToken(prefixedTokenName('space-'))) }),
  radius: z.strictObject({ tokens: z.array(lengthToken(prefixedTokenName('radius-'))) }),
  size: z.strictObject({ tokens: z.array(lengthToken(tokenName)) }),
  border: z.strictObject({ tokens: z.array(lengthToken(prefixedTokenName('border-'))) }),
});

export type Tokens = z.infer<typeof tokensShape>;
export type TypeStyle = Tokens['type']['groups'][number]['styles'][number];
export type LengthToken = Tokens['spacing']['tokens'][number];

const tokensSchema = tokensShape.superRefine((tokens, context) => {
  for (const issue of [...findDuplicateNames(tokens), ...findInvalidAliases(tokens)]) {
    context.addIssue({ code: 'custom', message: issue });
  }
});

export function parseTokens(source: unknown): Tokens {
  const result = tokensSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Invalid tokens.json:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export function aliasTarget(value: string): string | null {
  return ALIAS.exec(value)?.[1] ?? null;
}

// Colors, spacing, radii, sizes and borders share one namespace, their CSS variables (--name);
// type styles have their own (--text-name).
function findDuplicateNames(tokens: Tokens): string[] {
  const variableNames = [
    ...tokens.color.tokens,
    ...tokens.spacing.tokens,
    ...tokens.radius.tokens,
    ...tokens.size.tokens,
    ...tokens.border.tokens,
  ].map((token) => token.name);
  const styleNames = tokens.type.groups.flatMap((group) => group.styles.map((style) => style.name));
  return [...duplicates(variableNames), ...duplicates(styleNames)].map(
    (name) => `The name "${name}" is used twice.`,
  );
}

// An alias points to a color of its own theme that is not an alias itself, so there is no cycle.
function findInvalidAliases(tokens: Tokens): string[] {
  const colors = new Map(tokens.color.tokens.map((token) => [token.name, token.value]));
  const aliases = tokens.color.tokens.flatMap((token) =>
    Object.values(ColorScheme).map((scheme) => ({
      name: token.name,
      scheme,
      target: aliasTarget(token.value[scheme]),
    })),
  );
  return aliases
    .filter(({ scheme, target }) => target !== null && !isPlainColor(colors.get(target)?.[scheme]))
    .map(
      ({ name, target }) => `The color "${name}" aliases "${target}", which is not a plain color.`,
    );
}

function isPlainColor(value: string | undefined): boolean {
  return value !== undefined && aliasTarget(value) === null;
}

function duplicates(names: readonly string[]): string[] {
  return [...new Set(names.filter((name, index) => names.indexOf(name) !== index))];
}
