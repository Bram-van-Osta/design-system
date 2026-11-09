/** How much room a file drop zone takes. */
export const FileDropZoneSize = {
  /**
   * The page's own zone, or a question's: a dashed frame, its label over its description, on a
   * computer and on a phone.
   */
  large: 'large',
  /**
   * A zone inside a card, lower: a dashed frame, its label over its description, on a computer and
   * on a phone.
   */
  compact: 'compact',
  /**
   * The page's main gesture: on the surface, its label drawn as the page's primary button with its
   * upload icon, its description under it.
   */
  prominent: 'prominent',
} as const;
export type FileDropZoneSize = (typeof FileDropZoneSize)[keyof typeof FileDropZoneSize];

const ZONE_CLASSES =
  'flex w-full cursor-pointer items-center justify-center text-center text-ink disabled:cursor-not-allowed';

// The dashed frame, its hover and its drag-over.
const LARGE_ZONE_CLASSES =
  'min-h-drop-zone-height flex-col gap-space-1 border-hair border-dashed border-ink bg-bg px-space-5 py-space-4 hover:not-disabled:bg-surface data-dragging:border-delft data-dragging:bg-surface disabled:border-line disabled:text-ink-muted';

const COMPACT_ZONE_CLASSES =
  'min-h-drop-zone-compact-height flex-col gap-space-1 border-hair border-dashed border-ink bg-bg px-space-4 py-space-1 hover:not-disabled:bg-surface data-dragging:border-delft data-dragging:bg-surface disabled:border-line disabled:text-ink-muted';

const PROMINENT_ZONE_CLASSES =
  'group flex-col gap-space-3 border-hair border-dashed border-ink bg-surface px-space-5 py-space-7 hover:not-disabled:border-delft data-dragging:border-delft data-dragging:bg-bg disabled:border-line disabled:text-ink-muted';

export const FILE_DROP_ZONE_CLASSES: Readonly<
  Record<
    FileDropZoneSize,
    { readonly zone: string; readonly label: string; readonly description: string }
  >
> = {
  large: {
    zone: `${ZONE_CLASSES} ${LARGE_ZONE_CLASSES}`,
    label: 'text-label',
    description: 'text-small text-ink-muted',
  },
  compact: {
    zone: `${ZONE_CLASSES} ${COMPACT_ZONE_CLASSES}`,
    label: 'text-body font-semibold',
    description: 'text-small text-ink-muted',
  },
  prominent: {
    zone: `${ZONE_CLASSES} ${PROMINENT_ZONE_CLASSES}`,
    label:
      'inline-flex min-h-target-min items-center gap-space-2 bg-delft px-space-5 py-space-3 text-label text-on-delft group-hover:group-enabled:bg-delft-deep group-disabled:bg-line group-disabled:text-ink-muted',
    description: 'text-small text-ink-muted',
  },
};
