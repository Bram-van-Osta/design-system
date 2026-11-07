/** How many tiles a row of a stat grid holds on a computer; two on a phone, whatever the count. */
export const StatGridColumns = {
  two: 'two',
  three: 'three',
  four: 'four',
  five: 'five',
  six: 'six',
} as const;
export type StatGridColumns = (typeof StatGridColumns)[keyof typeof StatGridColumns];
