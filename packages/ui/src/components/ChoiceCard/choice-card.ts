import type { ReactNode } from 'react';

export interface ChoiceCardOption {
  readonly value: string;
  readonly label: ReactNode;
  /** An example under the label, which makes the card a large one. */
  readonly description?: ReactNode;
  /** An answer outside the usual path: dashed, on surface, across the grid. */
  readonly isSetApart?: boolean;
  readonly disabled?: boolean;
}

/** Where the text field of a detailed answer stands. */
export const ChoiceDetailPlacement = {
  /** In the grid, after the last card: place the detailed answer last. */
  beside: 'beside',
  /** Across the grid, under the cards. */
  below: 'below',
} as const;
export type ChoiceDetailPlacement =
  (typeof ChoiceDetailPlacement)[keyof typeof ChoiceDetailPlacement];

/** The text field that details an answer, "Other…" first: always shown, never a closed question. */
export interface ChoiceDetail {
  /** The answers it details: choosing one with a click or Space moves the focus into the field. */
  readonly forValues: readonly string[];
  readonly label: ReactNode;
  /** Shown above the field; otherwise read by screen readers only, the card naming it on screen. */
  readonly isLabelVisible?: boolean;
  readonly placement?: ChoiceDetailPlacement;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  /** What is wrong with the text, in words, under the field. */
  readonly error?: ReactNode;
  readonly name?: string;
  readonly maxLength?: number;
}
