import { describe, expect, it } from 'vitest';
import { parseTokens } from './schema.ts';
import source from './tokens.json' with { type: 'json' };

type Source = typeof source;

function changed(change: (tokens: Source) => void): Source {
  const copy = structuredClone(source);
  change(copy);
  return copy;
}

function colorToken(tokens: Source, name: string): Source['color']['tokens'][number] {
  const token = tokens.color.tokens.find((candidate) => candidate.name === name);
  if (token === undefined) {
    throw new Error(`No color named ${name}`);
  }
  return token;
}

describe('parseTokens', () => {
  it('should accept the tokens of the design system', () => {
    const tokens = parseTokens(source);

    expect(tokens.name).toBe('Bram van Osta');
    expect(colorToken(tokens, 'delft').value).toEqual({ light: '#2350A0', dark: '#7FA0E0' });
  });

  it('should refuse a color that is neither a hex nor an alias', () => {
    const tokens = changed((draft) => {
      colorToken(draft, 'delft').value.light = 'blue';
    });

    expect(() => parseTokens(tokens)).toThrow('A color is a #RRGGBB hex');
  });

  it('should refuse an alias of a missing color', () => {
    const tokens = changed((draft) => {
      colorToken(draft, 'focus').value.dark = '{indigo}';
    });

    expect(() => parseTokens(tokens)).toThrow('The color "focus" aliases "indigo"');
  });

  it('should refuse an alias of another alias', () => {
    const tokens = changed((draft) => {
      colorToken(draft, 'focus').value.light = '{tulip-stem}';
    });

    expect(() => parseTokens(tokens)).toThrow('The color "focus" aliases "tulip-stem"');
  });

  it('should refuse a color without its dark value', () => {
    const tokens = changed((draft) => {
      Reflect.deleteProperty(colorToken(draft, 'ink').value, 'dark');
    });

    expect(() => parseTokens(tokens)).toThrow('dark');
  });

  it('should refuse a name that two families share', () => {
    const tokens = changed((draft) => {
      draft.size.tokens.push({ name: 'line', value: '1px', usage: 'A size named like a color.' });
    });

    expect(() => parseTokens(tokens)).toThrow('The name "line" is used twice.');
  });

  it('should refuse a radius not named radius-…', () => {
    const tokens = changed((draft) => {
      draft.radius.tokens.push({ name: 'corner', value: '4px', usage: 'A badly named radius.' });
    });

    expect(() => parseTokens(tokens)).toThrow('A token of this family is named radius-…');
  });
});
