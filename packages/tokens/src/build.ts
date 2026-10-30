import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { parseTokens } from './schema.ts';
import { renderTailwindCss } from './tailwind-css.ts';
import source from './tokens.json' with { type: 'json' };
import { renderTokensCss } from './tokens-css.ts';

const DIST = new URL('../dist/', import.meta.url);

const tokens = parseTokens(source);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST);
await Promise.all([
  writeFile(new URL('tokens.css', DIST), `${renderTokensCss(tokens)}\n`),
  writeFile(new URL('tailwind.css', DIST), `${renderTailwindCss(tokens)}\n`),
  writeFile(new URL('tokens.json', DIST), `${JSON.stringify(tokens, null, 2)}\n`),
  copyFile(new URL('fonts.css', import.meta.url), new URL('fonts.css', DIST)),
]);
