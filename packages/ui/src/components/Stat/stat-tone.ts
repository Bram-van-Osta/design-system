export const StatTone = {
  /** A figure among others, in ink. */
  plain: 'plain',
  /** Under a vermilion rule, the figure in vermilion: what awaits the reader. Rarely, on bg only. */
  attention: 'attention',
} as const;
export type StatTone = (typeof StatTone)[keyof typeof StatTone];
