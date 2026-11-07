/** The order of a tile's label and figure. */
export const StatLayout = {
  /**
   * The label then its figure, as a pipeline counts its states: on a phone, on one line, the note
   * under them; from md, stacked.
   */
  labelFirst: 'labelFirst',
  /** The large figure then its label and its note, stacked on every screen, as a page's figures. */
  figureFirst: 'figureFirst',
} as const;
export type StatLayout = (typeof StatLayout)[keyof typeof StatLayout];
