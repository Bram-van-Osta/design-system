/** How much room a file drop zone takes. */
export const FileDropZoneSize = {
  /**
   * The page's own zone: on a computer a dashed frame, its label over its description; on a
   * phone, where nothing is dragged, a primary button, its label alone.
   */
  large: 'large',
  /** A zone inside a card: one dashed line on a computer and on a phone. */
  compact: 'compact',
} as const;
export type FileDropZoneSize = (typeof FileDropZoneSize)[keyof typeof FileDropZoneSize];

const ZONE_CLASSES =
  'flex w-full cursor-pointer items-center justify-center text-center text-ink disabled:cursor-not-allowed';

// The dashed frame, its hover and its drag-over, on a computer only for the large zone.
const LARGE_ZONE_CLASSES =
  'min-h-button-height px-space-6 bg-delft text-on-delft hover:not-disabled:bg-delft-deep disabled:bg-line disabled:text-ink-muted md:min-h-drop-zone-height md:flex-col md:gap-space-1 md:border-hair md:border-dashed md:border-ink md:bg-bg md:px-space-5 md:py-space-4 md:text-ink md:hover:not-disabled:bg-surface md:data-dragging:border-delft md:data-dragging:bg-surface md:disabled:border-line md:disabled:bg-bg';

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
    description: 'hidden text-small text-ink-muted md:block',
  },
  compact: {
    zone: `${ZONE_CLASSES} ${COMPACT_ZONE_CLASSES}`,
    label: 'text-body-s font-semibold',
    description: 'hidden text-body-s text-ink-muted md:inline',
  },
};
