export interface PageCaptureSize {
  readonly width: number;
  readonly height: number;
}

/** The two screens a page is captured on, in CSS pixels, its whole height. */
export const COMPUTER_CAPTURE: PageCaptureSize = { width: 1440, height: 4800 };
export const PHONE_CAPTURE: PageCaptureSize = { width: 390, height: 3200 };

const MARGIN_SHARE = 0.08;
const HEADER_SHARE = 0.06;
const HERO_SHARE = 0.4;
const LINE_HEIGHT_SHARE = 0.014;

/**
 * A made-up full-page capture, much taller than wide, as an SVG data URI that needs no network:
 * a dark header band at its top, a hero block, then lines of text down to its end.
 */
export function pageCapture({ width, height }: PageCaptureSize): string {
  const margin = Math.round(width * MARGIN_SHARE);
  const header = Math.round(width * HEADER_SHARE);
  const hero = Math.round(width * HERO_SHARE);
  const line = Math.max(Math.round(width * LINE_HEIGHT_SHARE), 6);
  const textTop = header + margin * 2 + hero;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs><pattern id="lines" width="${width}" height="${line * 5}" patternUnits="userSpaceOnUse">
<rect x="${margin}" y="${line}" width="${width - margin * 2}" height="${line}" fill="black" fill-opacity="0.2"/>
<rect x="${margin}" y="${line * 3}" width="${Math.round((width - margin * 2) * 0.7)}" height="${line}" fill="black" fill-opacity="0.2"/>
</pattern></defs>
<rect width="${width}" height="${height}" fill="white"/>
<rect width="${width}" height="${header}" fill="black" fill-opacity="0.85"/>
<rect x="${margin}" y="${header + margin}" width="${width - margin * 2}" height="${hero}" fill="black" fill-opacity="0.12"/>
<rect y="${textTop}" width="${width}" height="${height - textTop}" fill="url(#lines)"/>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
