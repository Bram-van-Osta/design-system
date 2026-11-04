export const RadioGroupOrientation = {
  /** One answer under the other, the default. */
  vertical: 'vertical',
  /** The answers side by side on one line, wrapping when it is too narrow: two short choices. */
  horizontal: 'horizontal',
} as const;
export type RadioGroupOrientation =
  (typeof RadioGroupOrientation)[keyof typeof RadioGroupOrientation];
