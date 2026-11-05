export const DisclosureVariant = {
  /** A summary row on the surface, such as a long page's contents on a phone. */
  box: 'box',
  /** A part of a page: its label in capitals over an ink rule, its content below. */
  part: 'part',
} as const;
export type DisclosureVariant = (typeof DisclosureVariant)[keyof typeof DisclosureVariant];
