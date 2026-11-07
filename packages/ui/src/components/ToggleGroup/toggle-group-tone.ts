/** How the group is drawn, by what it stands on. */
export const ToggleGroupTone = {
  /** On a Delft band: the segments in Delft, the pressed one in white with ink text. */
  delft: 'delft',
  /**
   * On the page's own background, such as a dialog: the segments in white with ink text in an ink
   * hair, the pressed one in ink with white text; the whole width on a phone, each segment its
   * share.
   */
  ink: 'ink',
  /**
   * A question's answers on the page, such as a verdict on a sentence: apart, each its equal column
   * on every screen, a primary button high, in white with ink text in an ink hair; none pressed
   * until one is chosen, the pressed one in Delft blue with white text, and its check on a
   * computer.
   */
  answer: 'answer',
  /**
   * Discreet, as a list's filters: plain words in a row, each 44 px high, the pressed one in
   * semibold, underlined in Delft blue, as a navigation's current link.
   */
  plain: 'plain',
  /**
   * A row's answer among two to four, as what to keep of a page: segments side by side in a hair of
   * the field color, each 44 px high, none pressed until one is chosen, the pressed one in Delft
   * blue with white text.
   */
  segments: 'segments',
} as const;
export type ToggleGroupTone = (typeof ToggleGroupTone)[keyof typeof ToggleGroupTone];
