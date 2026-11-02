// The outline of a text control: as tall as the primary button, a hair in the field color.
export const CONTROL_CLASSES =
  'w-full min-h-button-height px-space-4 border-hair border-field bg-bg font-normal text-ink placeholder:text-ink-muted data-invalid:border-ink data-disabled:cursor-not-allowed data-disabled:bg-surface data-disabled:text-ink-muted';

// A control of one line: its text as large as a choice's label.
export const LINE_CONTROL_CLASSES = `${CONTROL_CLASSES} text-label`;
