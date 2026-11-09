/** Where a dialog stands on a phone; on a computer, it is always in the middle of the screen. */
export const DialogPlacement = {
  /** In the middle of the screen, the default: a decision asked of the reader. */
  center: 'center',
  /**
   * Rising from the bottom at the whole width, as a sheet: a few choices asked on what the reader
   * just touched, such as why they like an image.
   */
  sheet: 'sheet',
} as const;
export type DialogPlacement = (typeof DialogPlacement)[keyof typeof DialogPlacement];
