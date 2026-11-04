/** What a file's upload is doing, by the color of its bar's filled part. */
export const ProgressBarTone = {
  /** Being sent. */
  delft: 'delft',
  /** Paused, waiting to go on. */
  muted: 'muted',
  /** Failed: the bar stops where the sending did. */
  vermilion: 'vermilion',
} as const;
export type ProgressBarTone = (typeof ProgressBarTone)[keyof typeof ProgressBarTone];

export const PROGRESS_BAR_FILL_CLASSES: Readonly<Record<ProgressBarTone, string>> = {
  delft: 'bg-delft',
  muted: 'bg-ink-muted',
  vermilion: 'bg-vermillion',
};
