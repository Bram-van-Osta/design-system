import { describe, expect, it } from 'vitest';
import { parseTokens } from './schema.ts';
import source from './tokens.json' with { type: 'json' };
import { renderTokensCss } from './tokens-css.ts';

const css = renderTokensCss(parseTokens(source));

function block(selector: string): string {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) {
    throw new Error(`No block for ${selector}`);
  }
  return css.slice(start, css.indexOf('}', start));
}

describe('renderTokensCss', () => {
  it('should declare the light colors on the root and on data-theme light', () => {
    const light = block(":root,\n[data-theme='light']");

    expect(light).toContain('color-scheme: light;');
    expect(light).toContain('--delft: #2350A0;');
    expect(light).toContain('--vermillion: #D93B1F;');
  });

  it('should follow a dark system unless the light theme is forced', () => {
    const media = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'));

    expect(
      media.startsWith(
        "@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {",
      ),
    ).toBe(true);
    expect(block(":root:not([data-theme='light'])")).toContain('--delft: #7FA0E0;');
  });

  it('should declare the dark colors on data-theme dark', () => {
    const dark = block("[data-theme='dark']");

    expect(dark).toContain('color-scheme: dark;');
    expect(dark).toContain('--bg: #111111;');
    expect(dark).toContain('--vermillion: #EC5A3C;');
  });

  it('should keep an alias as a reference in every theme block', () => {
    expect(css.match(/--tulip-flower: var\(--vermillion\);/g)).toHaveLength(3);
  });

  it('should declare a text style with its companions', () => {
    const root = css.slice(css.lastIndexOf(':root {'));

    expect(root).toContain('--text-heading-xl: 52px;');
    expect(root).toContain('--text-heading-xl--line-height: 1.08;');
    expect(root).toContain('--text-heading-xl--font-weight: 700;');
    expect(root).toContain('--text-heading-xl--letter-spacing: -0.02em;');
    expect(root).not.toContain('--text-body--letter-spacing');
  });

  it('should declare the families, spacing, radii, sizes and borders once', () => {
    const root = css.slice(css.lastIndexOf(':root {'));

    expect(root).toContain('--font-display: "Inter Tight", Helvetica, Arial, sans-serif;');
    expect(root).toContain('--space-5: 24px;');
    expect(root).toContain('--radius-none: 0;');
    expect(root).toContain('--target-min: 44px;');
    expect(root).toContain('--border-select: 2px;');
  });
});
