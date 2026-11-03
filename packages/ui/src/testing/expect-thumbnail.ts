import { expect } from 'storybook/test';
import { tokenColor } from './token-color.ts';

export interface ThumbnailBoxSize {
  readonly width: number;
  readonly height: number;
}

/** The control is the box, square, on a hairline in the line token, the image's top filling it. */
export async function expectCroppedImage(
  control: HTMLElement,
  { width, height }: ThumbnailBoxSize,
): Promise<void> {
  const image = control.querySelector('img');
  await expect(image).toHaveAttribute('alt', '');
  await expect(image).toHaveAttribute('loading', 'lazy');
  await expect(image).toHaveAttribute('decoding', 'async');
  const { objectFit, objectPosition } = getComputedStyle(image ?? control);
  await expect({ objectFit, objectPosition }).toEqual({
    objectFit: 'cover',
    objectPosition: '50% 0%',
  });
  const rectangle = control.getBoundingClientRect();
  await expect({ width: rectangle.width, height: rectangle.height }).toEqual({ width, height });
  const { borderTopColor, borderTopStyle, borderTopWidth, borderRadius, boxShadow } =
    getComputedStyle(control);
  await expect({ borderTopColor, borderTopStyle, borderTopWidth, borderRadius, boxShadow }).toEqual(
    {
      borderTopColor: tokenColor('line', control),
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none',
    },
  );
}
