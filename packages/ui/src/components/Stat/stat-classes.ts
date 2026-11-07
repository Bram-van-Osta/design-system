import type { StatLayout } from './stat-layout.ts';
import type { StatTone } from './stat-tone.ts';

const TILE_FRAME_CLASSES = 'min-w-0 border-hair border-line md:px-space-5 md:py-space-4';

// labelFirst: on a phone, the label and its figure share a line, the note under them; from md,
// they stack. figureFirst: stacked on every screen, the figure drawn first.
export const STAT_TILE_CLASSES: Readonly<Record<StatLayout, string>> = {
  labelFirst: `${TILE_FRAME_CLASSES} flex flex-wrap content-center items-baseline justify-between gap-x-space-2 gap-y-space-1 px-space-3 py-space-2 md:flex-col md:flex-nowrap md:content-start md:items-start md:justify-start md:gap-space-1`,
  figureFirst: `${TILE_FRAME_CLASSES} flex flex-col items-start gap-space-1 px-space-4 py-space-3`,
};

// The vermilion rule is the attention rule of the identity, the action card's and the form alert's.
export const STAT_TONE_CLASSES: Readonly<Record<StatTone, string>> = {
  plain: '',
  attention: 'border-t-attention border-t-vermillion',
};

// On a phone, a long label wraps beside its figure rather than pushing it to the next line; a mark
// before it sits on its first line.
const LABEL_BASE_CLASSES =
  'inline-flex min-w-0 items-baseline gap-space-2 text-ink-muted text-small';
export const STAT_LABEL_CLASSES: Readonly<Record<StatLayout, string>> = {
  labelFirst: `${LABEL_BASE_CLASSES} flex-1 md:flex-none`,
  figureFirst: `${LABEL_BASE_CLASSES} order-1`,
};

const FIGURE_BASE_CLASSES = 'font-display text-heading-xs tabular-nums md:text-heading-s';
export const STAT_FIGURE_CLASSES: Readonly<Record<StatTone, string>> = {
  plain: `${FIGURE_BASE_CLASSES} text-ink`,
  attention: `${FIGURE_BASE_CLASSES} text-vermillion`,
};

// A whole line of its own, under the label and the figure.
export const STAT_NOTE_CLASSES = 'order-2 w-full text-ink-muted text-small';
