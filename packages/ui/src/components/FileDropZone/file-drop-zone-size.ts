/** How much room a file drop zone takes. */
export const FileDropZoneSize = {
  /**
   * The page's own zone, or a question's: a dashed frame, its label over its description, on a
   * computer and on a phone.
   */
  large: 'large',
  /** A zone inside a card: one dashed line on a computer and on a phone. */
  compact: 'compact',
} as const;
export type FileDropZoneSize = (typeof FileDropZoneSize)[keyof typeof FileDropZoneSize];

const ZONE_CLASSES =
  'flex w-full cursor-pointer items-center justify-center text-center text-ink disabled:cursor-not-allowed';

// The dashed frame, its hover and its drag-over.
const LARGE_ZONE_CLASSES =
  'min-h-drop-zone-height flex-col gap-space-1 border-hair border-dashed border-ink bg-bg px-space-5 py-space-4 hover:not-disabled:bg-surface data-dragging:border-delft data-dragging:bg-surface disabled:border-line disabled:text-ink-muted';

const COMPACT_ZONE_CLASSES =
  'min-h-drop-zone-compact-phone-height flex-wrap gap-x-space-2 border-hair border-dashed border-ink bg-bg px-space-4 py-space-2 hover:not-disabled:bg-surface data-dragging:border-delft data-dragging:bg-surface disabled:border-line disabled:text-ink-muted md:min-h-drop-zone-compact-height';

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
    label: 'text-body-s font-semibold',
    description: 'hidden text-body-s text-ink-muted md:inline',
  },
};
