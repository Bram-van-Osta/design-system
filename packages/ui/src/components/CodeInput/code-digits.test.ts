import { describe, expect, it } from 'vitest';
import { CODE_LENGTH, digitsOf } from './code-digits.ts';

describe('digitsOf', () => {
  it('keeps the digits of a code written with spaces or dashes', () => {
    expect(digitsOf('481 290')).toBe('481290');
    expect(digitsOf('481-290')).toBe('481290');
  });

  it('drops the letters', () => {
    expect(digitsOf('4a8b1')).toBe('481');
  });

  it('keeps as many digits as a code holds', () => {
    expect(digitsOf('48129055')).toHaveLength(CODE_LENGTH);
    expect(digitsOf('48129055')).toBe('481290');
  });

  it('gives nothing for a text without a digit', () => {
    expect(digitsOf('code')).toBe('');
  });
});
