/** How large a calm card is drawn. */
export const CalmCardSize = {
  /** Its heading in Inter Tight's heading-xs, the card's own part of the page. */
  regular: 'regular',
  /**
   * Its heading at the label size (17 px, semibold), 24 px inside on every screen: a side note
   * under a page's heading, which says the rest.
   */
  compact: 'compact',
} as const;
export type CalmCardSize = (typeof CalmCardSize)[keyof typeof CalmCardSize];
