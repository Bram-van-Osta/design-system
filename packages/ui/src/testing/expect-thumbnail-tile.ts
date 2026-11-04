import { expect } from 'storybook/test';
import { type ColorToken, tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

// A tile's box is 4:3 at its column's width: a pixel of rounding either way.
const ASPECT_TOLERANCE = 1;
const ASPECT_RATIO = 3 / 4;
// The columns share the row's width in fractions of a pixel.
const SUBPIXEL_TOLERANCE = 0.5;

export const PHOTO_SIZE = { width: 1600, height: 1200 } as const;

/** The grid's item around an element of a tile. */
export function tileOf(element: Element): HTMLElement {
  const tile = element.closest('li');
  if (tile === null) {
    throw new Error('The element is in a tile of the grid.');
  }
  return tile;
}

/** The box: 4:3 at its column's width, square, on a hairline, in the given color. */
export async function expectTileBox(
  box: HTMLElement,
  border: { readonly color: ColorToken; readonly style: 'solid' | 'dashed' } = {
    color: 'line',
    style: 'solid',
  },
): Promise<void> {
  const { width, height } = box.getBoundingClientRect();
  await expect(width).toBe(tileOf(box).getBoundingClientRect().width);
  await expect(Math.abs(height - width * ASPECT_RATIO)).toBeLessThanOrEqual(ASPECT_TOLERANCE);
  const { borderTopColor, borderTopStyle, borderTopWidth, borderRadius, boxShadow } =
    getComputedStyle(box);
  await expect({ borderTopColor, borderTopStyle, borderTopWidth, borderRadius, boxShadow }).toEqual(
    {
      borderTopColor: tokenColor(border.color, box),
      borderTopStyle: border.style,
      borderTopWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none',
    },
  );
}

/** The photo fills its box, cropped to its middle, decorative: the control is named. */
export async function expectCenteredImage(box: HTMLElement): Promise<void> {
  const image = box.querySelector('img');
  await expect(image).toHaveAttribute('alt', '');
  const { objectFit, objectPosition } = getComputedStyle(image ?? box);
  await expect({ objectFit, objectPosition }).toEqual({
    objectFit: 'cover',
    objectPosition: '50% 50%',
  });
}

/** Under the box, in IBM Plex Mono: the name in ink, wrapping anywhere, the note in Delft blue. */
export async function expectTileCaption(name: HTMLElement, note?: HTMLElement): Promise<void> {
  const { color, fontFamily, overflowWrap } = getComputedStyle(name);
  await expect({ color, overflowWrap }).toEqual({
    color: tokenColor('ink', name),
    overflowWrap: 'anywhere',
  });
  await expect(fontFamily).toContain('IBM Plex Mono');
  if (note !== undefined) {
    await expect(getComputedStyle(note).color).toBe(tokenColor('delft', note));
    await expect(note.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      name.getBoundingClientRect().bottom,
    );
  }
  const box = tileOf(name).firstElementChild;
  const gap = name.getBoundingClientRect().top - (box?.getBoundingClientRect().bottom ?? 0);
  await expect(Math.abs(gap - tokenPixels('space-2'))).toBeLessThanOrEqual(SUBPIXEL_TOLERANCE);
}

/** The tiles of the grid's first row: four on a computer, two on a phone. */
export function firstRowOf(tiles: readonly HTMLElement[]): readonly HTMLElement[] {
  const top = tiles[0]?.getBoundingClientRect().top;
  return tiles.filter((tile) => tile.getBoundingClientRect().top === top);
}
