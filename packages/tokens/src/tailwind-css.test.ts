import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { parseTokens } from './schema.ts';
import { renderTailwindCss } from './tailwind-css.ts';
import source from './tokens.json' with { type: 'json' };
import { renderTokensCss } from './tokens-css.ts';

const tokens = parseTokens(source);
const GENERATED = new Map([
  ['./tokens.css', renderTokensCss(tokens)],
  ['./tailwind.css', renderTailwindCss(tokens)],
]);
const TAILWIND_ENTRY = fileURLToPath(import.meta.resolve('tailwindcss/index.css'));

// The generated theme compiled by Tailwind itself, as a product's build would do it.
async function buildCss(candidates: readonly string[]): Promise<string> {
  const compiler = await compile("@import 'tailwindcss';\n@import './tailwind.css';", {
    base: import.meta.dirname,
    loadStylesheet: async (id, base) => {
      const generated = GENERATED.get(id);
      if (generated !== undefined) {
        return { path: id, base, content: generated };
      }
      const path = id === 'tailwindcss' ? TAILWIND_ENTRY : join(base, id);
      return { path, base: dirname(path), content: await readFile(path, 'utf8') };
    },
  });
  return compiler.build([...candidates]);
}

function rule(css: string, className: string): string {
  const start = css.indexOf(`.${className} {`);
  if (start === -1) {
    throw new Error(`No rule for .${className}`);
  }
  return css.slice(start, css.indexOf('}', start));
}

describe('renderTailwindCss', () => {
  it("should make each color utility read its token's variable", async () => {
    const css = await buildCss(['bg-delft', 'text-ink-muted', 'fill-tulip-flower']);

    expect(rule(css, 'bg-delft')).toContain('background-color: var(--delft);');
    expect(rule(css, 'text-ink-muted')).toContain('color: var(--ink-muted);');
    expect(rule(css, 'fill-tulip-flower')).toContain('fill: var(--tulip-flower);');
  });

  it('should give a text style its size, line height, weight and letter spacing', async () => {
    const css = await buildCss(['text-heading-xl', 'font-display']);
    const heading = rule(css, 'text-heading-xl');

    expect(heading).toContain('font-size: var(--text-heading-xl);');
    expect(heading).toContain('var(--text-heading-xl--line-height)');
    expect(heading).toContain('var(--text-heading-xl--font-weight)');
    expect(heading).toContain('var(--text-heading-xl--letter-spacing)');
    expect(rule(css, 'font-display')).toContain('font-family: var(--font-display);');
  });

  it('should name the spacing utilities after their tokens, sizes included', async () => {
    const css = await buildCss(['p-space-5', 'min-h-target-min', 'max-w-reading-width', 'p-4']);

    expect(rule(css, 'p-space-5')).toContain('padding: var(--space-5);');
    expect(rule(css, 'min-h-target-min')).toContain('min-height: var(--target-min);');
    expect(rule(css, 'max-w-reading-width')).toContain('max-width: var(--reading-width);');
    expect(rule(css, 'p-4')).toContain('calc(var(--spacing) * 4)');
  });

  it('should name radii and border widths without their family prefix', async () => {
    const css = await buildCss(['rounded-icon', 'border-select', 'border-t-attention']);

    expect(rule(css, 'rounded-icon')).toContain('border-radius: var(--radius-icon);');
    expect(rule(css, 'border-select')).toContain('border-width: var(--border-select);');
    expect(rule(css, 'border-t-attention')).toContain('border-top-width: var(--border-attention);');
  });

  it("should remove Tailwind's palette, type scale, radii and shadows", async () => {
    const css = await buildCss(['bg-red-500', 'bg-white', 'text-sm', 'rounded-lg', 'shadow-md']);

    for (const className of ['bg-red-500', 'bg-white', 'text-sm', 'rounded-lg', 'shadow-md']) {
      expect(css).not.toContain(`.${className} {`);
    }
  });

  it('should keep the font weights', async () => {
    const css = await buildCss(['font-semibold']);

    expect(rule(css, 'font-semibold')).toContain('font-weight: var(--font-weight-semibold);');
  });

  it('should set the page families to the tokens', async () => {
    const css = await buildCss([]);

    expect(css).toContain('font-family: var(--font-sans,');
    expect(css).toContain('font-family: var(--font-mono,');
  });

  it('should leave the variables to tokens.css', async () => {
    const css = await buildCss(['bg-delft']);

    expect(css).not.toContain('--color-delft');
    expect(css).toContain('--delft: #2350A0;');
  });
});
