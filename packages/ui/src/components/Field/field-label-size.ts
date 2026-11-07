/** How a field's label is drawn. */
export const FieldLabelSize = {
  /** At the label size, in ink: a form's question. */
  regular: 'regular',
  /** In muted mono, 13 px, close above its control: a search field or a filter beside a heading. */
  small: 'small',
} as const;
export type FieldLabelSize = (typeof FieldLabelSize)[keyof typeof FieldLabelSize];
