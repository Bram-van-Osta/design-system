import type { StatLayout } from './stat-layout.ts';
import type { StatTone } from './stat-tone.ts';

const TILE_FRAME_CLASSES = 'min-w-0 border-hair border-line md:px-space-5 md:py-space-4';

// labelFirst: on a phone, the label and its figure share a line, the note under them; from md,
// they stack. figureFirst: stacked on every screen, the figure drawn first. titled: the label and
// its figure on one line on every screen, under the rule alone.
export const STAT_TILE_CLASSES: Readonly<Record<StatLayout, string>> = {
  labelFirst: `${TILE_FRAME_CLASSES} flex flex-wrap content-center items-baseline justify-between gap-x-space-2 gap-y-space-1 px-space-3 py-space-2 md:flex-col md:flex-nowrap md:content-start md:items-start md:justify-start md:gap-space-1`,
  figureFirst: `${TILE_FRAME_CLASSES} flex flex-col items-start gap-space-1 px-space-4 py-space-3`,
  titled:
    'flex min-w-0 flex-wrap content-start items-baseline justify-between gap-x-space-2 gap-y-space-1 pt-space-3',
};

// The vermilion rule is the attention rule of the identity, the action card's and the form alert's;
// a titled tile's own rule is a list heading's, in ink.
const FRAMED_TONE_CLASSES: Readonly<Record<StatTone, string>> = {
  plain: '',
  attention: 'border-t-attention border-t-vermillion',
};
export const STAT_TONE_CLASSES: Readonly<Record<StatLayout, Readonly<Record<StatTone, string>>>> = {
  labelFirst: FRAMED_TONE_CLASSES,
  figureFirst: FRAMED_TONE_CLASSES,
  titled: {
    plain: 'border-t-select border-t-ink',
    attention: 'border-t-attention border-t-vermillion',
  },
};

// On a phone, a long label wraps beside its figure rather than pushing it to the next line; a mark
// before it sits on its first line. A titled tile's label is underlined under the pointer, in a link.
const LABEL_BASE_CLASSES = 'inline-flex min-w-0 items-baseline gap-space-2';
const LABEL_MUTED_CLASSES = `${LABEL_BASE_CLASSES} text-ink-muted text-small`;
export const STAT_LABEL_CLASSES: Readonly<Record<StatLayout, string>> = {
  labelFirst: `${LABEL_MUTED_CLASSES} flex-1 md:flex-none`,
  figureFirst: `${LABEL_MUTED_CLASSES} order-1`,
  titled: `${LABEL_BASE_CLASSES} flex-1 text-label text-ink underline-offset-4 group-hover/stat:underline`,
};

const FIGURE_SIZE_CLASSES: Readonly<Record<StatLayout, string>> = {
  labelFirst: 'text-heading-xs md:text-heading-s',
  figureFirst: 'text-heading-xs md:text-heading-s',
  titled: 'text-heading-xs',
};
const FIGURE_TONE_CLASSES: Readonly<Record<StatTone, string>> = {
  plain: 'text-ink',
  attention: 'text-vermillion',
};

/** A tile's figure, in Inter Tight's tabular figures, at its layout's size and in its tone. */
export function statFigureClassesOf(layout: StatLayout, tone: StatTone): string {
  return `font-display tabular-nums ${FIGURE_SIZE_CLASSES[layout]} ${FIGURE_TONE_CLASSES[tone]}`;
}

// A whole line of its own, under the label and the figure.
export const STAT_NOTE_CLASSES = 'order-2 w-full text-ink-muted text-small';
