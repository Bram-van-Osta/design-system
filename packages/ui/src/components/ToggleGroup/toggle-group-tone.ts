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
} as const;
export type ToggleGroupTone = (typeof ToggleGroupTone)[keyof typeof ToggleGroupTone];
