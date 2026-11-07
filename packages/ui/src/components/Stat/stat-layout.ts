/** The order of a tile's label and figure. */
export const StatLayout = {
  /**
   * The label then its figure, as a pipeline counts its states: on a phone, on one line, the note
   * under them; from md, stacked.
   */
  labelFirst: 'labelFirst',
  /** The large figure then its label and its note, stacked on every screen, as a page's figures. */
  figureFirst: 'figureFirst',
  /**
   * The label as the tile's title, in ink, its figure at its right when it has one, the note under
   * them, under a 2 px ink rule and no other frame: a folder's categories, each a link to its files.
   */
  titled: 'titled',
} as const;
export type StatLayout = (typeof StatLayout)[keyof typeof StatLayout];
