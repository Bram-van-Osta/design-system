// A thumbnail's box: square, on a hairline, its size from the thumbnail's props.
export const THUMBNAIL_BOX_CLASSES = 'w-full overflow-hidden border-hair';

// What opens its content: its hairline turns to ink on hover.
export const OPENING_HAIRLINE_CLASSES = 'cursor-pointer border-line hover:border-ink';

// What opens the image.
export const OPENING_BOX_CLASSES = `block ${OPENING_HAIRLINE_CLASSES}`;
