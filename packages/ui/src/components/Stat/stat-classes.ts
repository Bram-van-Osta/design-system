import type { StatTone } from './stat-tone.ts';

// On a phone, the label and its figure share a line, the note under them; from md, they stack.
export const STAT_TILE_CLASSES =
  'flex min-w-0 flex-wrap content-center items-baseline justify-between gap-x-space-2 gap-y-space-1 border-hair border-line px-space-3 py-space-2 md:flex-col md:flex-nowrap md:content-start md:items-start md:justify-start md:gap-space-1 md:px-space-5 md:py-space-4';

// The vermilion rule is the attention rule of the identity, the action card's and the form alert's.
export const STAT_TONE_CLASSES: Readonly<Record<StatTone, string>> = {
  plain: '',
  attention: 'border-t-attention border-t-vermillion',
};

// On a phone, a long label wraps beside its figure rather than pushing it to the next line.
export const STAT_LABEL_CLASSES = 'min-w-0 flex-1 text-ink-muted text-small md:flex-none';

const FIGURE_BASE_CLASSES = 'font-display text-heading-xs tabular-nums md:text-heading-s';
export const STAT_FIGURE_CLASSES: Readonly<Record<StatTone, string>> = {
  plain: `${FIGURE_BASE_CLASSES} text-ink`,
  attention: `${FIGURE_BASE_CLASSES} text-vermillion`,
};

// A whole line of its own, under the label and the figure.
export const STAT_NOTE_CLASSES = 'w-full text-ink-muted text-small';
