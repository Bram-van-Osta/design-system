export const CODE_LENGTH = 6;

const NOT_A_DIGIT = /\D/g;

/** The digits of a text, as many as a code holds: `481 290` and `481-290` are `481290`. */
export function digitsOf(text: string): string {
  return text.replace(NOT_A_DIGIT, '').slice(0, CODE_LENGTH);
}
