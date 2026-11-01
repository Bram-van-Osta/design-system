import { describe, expect, it } from 'vitest';
import { CODE_LENGTH, wholeCodeIn } from './code-digits.ts';

describe('wholeCodeIn', () => {
  it('keeps the digits of a code written with spaces, dashes or words', () => {
    expect(wholeCodeIn('481 290')).toBe('481290');
    expect(wholeCodeIn('Your code: 735-102')).toBe('735102');
  });

  it('takes the code inserted after the digit the slot held', () => {
    expect(wholeCodeIn('0735102')).toBe('735102');
  });

  it('takes the code inserted before the digit the slot held, up to the caret', () => {
    expect(wholeCodeIn('7351020', CODE_LENGTH)).toBe('735102');
  });

  it('gives nothing for fewer digits than a code holds', () => {
    expect(wholeCodeIn('07')).toBeNull();
    expect(wholeCodeIn('code')).toBeNull();
  });
});
