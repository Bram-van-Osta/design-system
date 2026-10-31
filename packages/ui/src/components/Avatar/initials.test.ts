import { describe, expect, it } from 'vitest';
import { initialsOf } from './initials.ts';

describe('initialsOf', () => {
  it('should take the first letter of the first two words', () => {
    expect(initialsOf('Jeanne Martin')).toBe('JM');
    expect(initialsOf('Bram van Osta')).toBe('BV');
  });

  it('should take one letter of a single word, in capitals', () => {
    expect(initialsOf('jeanne')).toBe('J');
  });

  it('should ignore the spaces around and between the words', () => {
    expect(initialsOf('  Jeanne   Martin ')).toBe('JM');
  });

  it('should give nothing for a name without a word', () => {
    expect(initialsOf(' ')).toBe('');
  });
});
