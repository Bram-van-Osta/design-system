import tokens from '@bram-van-osta/tokens/tokens.json' with { type: 'json' };

export { tokens };
export type ColorToken = (typeof tokens.color.tokens)[number];
export type ColorTheme = (typeof tokens.color.themes)[number];
export type TypeStyle = (typeof tokens.type.groups)[number]['styles'][number];
