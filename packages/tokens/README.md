# @bram-van-osta/tokens

The Bram van Osta tokens, without React: the colors and their roles in light and dark, the type, the spacing, the radii, the sizes and the borders.

| Export | What it holds |
|---|---|
| `@bram-van-osta/tokens/tokens.css` | Every token as a CSS variable: `--delft`, `--space-5`, `--text-body` and its companions |
| `@bram-van-osta/tokens/tailwind.css` | The same variables, and the Tailwind 4 theme that maps them |
| `@bram-van-osta/tokens/fonts.css` | Newsreader, Inter Tight, Inter and IBM Plex Mono, self-hosted, in the weights the identity uses |
| `@bram-van-osta/tokens/tokens.json` | The source, in the shape of the design system artifact |

## Themes

The light theme on `:root`, the dark one when `prefers-color-scheme` is dark, and either one forced with `data-theme="light"` or `data-theme="dark"`, on `<html>` or on any element.

## In Tailwind

```css
@import 'tailwindcss';
@import '@bram-van-osta/tokens/fonts.css';
@import '@bram-van-osta/tokens/tailwind.css';
```

| Tokens | Utilities | Example |
|---|---|---|
| Colors | every color utility | `bg-delft`, `text-ink-muted`, `border-line`, `fill-tulip-flower` |
| Families | `font-*` | `font-display` |
| Text styles | `text-*`: size, line height, weight, letter spacing | `text-heading-xl` |
| Spacing | spacing utilities, by name, next to the numeric scale | `p-space-5`, `gap-space-3` |
| Sizes | spacing and size utilities | `min-h-target-min`, `max-w-reading-width` |
| Radii | `rounded-*` | `rounded-none`, `rounded-round` |
| Borders | border widths | `border-hair`, `border-t-attention` |

Each utility reads its token's variable, so the themes and a product's overrides reach it. Tailwind's palette, type scale, radii and shadows are removed.

## Overriding

```css
:root {
  --delft: #1d3a8a;
}
```

## Source

`src/tokens.json`, validated by `src/schema.ts`, generates the files of `dist/` (`pnpm build`).
