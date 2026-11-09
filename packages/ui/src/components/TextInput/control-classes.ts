// The frame of a text control without its ground: as tall as the primary button, a hair in the field
// color, its typed text at the body size; in a field that holds the agent's draft, the agent's rule
// at its left. A control drawn over a layer, as the highlighted field, keeps its ground transparent.
export const CONTROL_FRAME_CLASSES =
  'w-full min-h-button-height px-space-4 border-hair border-field text-body font-normal text-ink placeholder:text-ink-muted data-invalid:border-ink data-disabled:cursor-not-allowed data-disabled:text-ink-muted in-data-agent-draft:border-l-3 in-data-agent-draft:border-l-agent';

// The outline of a text control, on the page's ground, on the surface once disabled.
export const CONTROL_CLASSES = `${CONTROL_FRAME_CLASSES} bg-bg data-disabled:bg-surface`;
