/** How many tiles a row of the grid holds, by what is under each image. */
export const ThumbnailGridColumns = {
  /** Four on a computer, two on a phone: images with their name under them. */
  four: 'four',
  /** Two on a computer, one on a phone: images with a field under each. */
  two: 'two',
} as const;
export type ThumbnailGridColumns = (typeof ThumbnailGridColumns)[keyof typeof ThumbnailGridColumns];
