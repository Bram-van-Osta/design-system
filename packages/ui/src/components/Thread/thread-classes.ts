// A line's columns: its time, its text, its chevron. The time column narrows on a phone; what a
// line unfolds is indented under its text, by the time column and the gap after it.
export const LINE_CLASSES =
  'flex min-h-12 w-full items-baseline gap-space-3 py-space-3 text-left text-body-s text-ink md:gap-space-4';
export const TIME_CLASSES = 'w-11 shrink-0 font-mono text-meta text-ink-muted md:w-13';
export const TEXT_CLASSES = 'min-w-0 flex-1';
export const CHEVRON_SLOT_CLASSES = 'flex w-5 shrink-0 self-center text-ink-muted';
export const CONTENT_CLASSES = 'flex flex-col gap-space-4 pb-space-5 pl-14 md:pl-17';
// Each line closes on a rule: the one before a day is that day's, the list's own rule above them all.
export const ITEM_CLASSES = 'border-line border-b-hair';
