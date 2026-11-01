export const CODE_LENGTH = 6;

const NOT_A_DIGIT = /\D/g;

/**
 * The whole code that one input brought, its last six digits before the caret: a suggestion of
 * the keyboard or a drop into a slot that already held a digit. `null` when it brought fewer.
 */
export function wholeCodeIn(text: string, caret = text.length): string | null {
  const digits = text.slice(0, caret).replace(NOT_A_DIGIT, '');
  return digits.length >= CODE_LENGTH ? digits.slice(-CODE_LENGTH) : null;
}
