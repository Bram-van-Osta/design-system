import { expect, screen, waitFor } from 'storybook/test';
import { Locale, MESSAGES, type Messages } from '../i18n/messages.ts';
import { isOnAComputer } from './is-on-a-computer.ts';
import { tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

/** The package's texts in the story's language. */
export function messagesOf(locale: unknown): Messages {
  return MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en];
}

export interface ImageViewerParts {
  readonly dialog: HTMLElement;
  readonly image: HTMLImageElement;
  /** The frame the image scrolls in. */
  readonly frame: HTMLElement;
}

/** The open viewer, by its title, the focus in it and its image loaded. */
export async function findImageViewer(title: string, alt: string): Promise<ImageViewerParts> {
  const dialog = await screen.findByRole('dialog', { name: title });
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  const image = screen.getByRole('img', { name: alt });
  if (!(image instanceof HTMLImageElement) || image.parentElement === null) {
    throw new Error(`The viewer ${title} shows no image in a frame.`);
  }
  await image.decode();
  return { dialog, image, frame: image.parentElement };
}

/** The whole image at the frame's width, a tall one scrolling in a frame on a hairline. */
export async function expectWholeImage({ image, frame }: ImageViewerParts): Promise<void> {
  await expect(image.getBoundingClientRect().width).toBe(frame.clientWidth);
  await expect(frame.scrollHeight).toBeGreaterThan(frame.clientHeight);
  const { overflowY, borderTopColor, borderTopWidth, borderRadius } = getComputedStyle(frame);
  await expect({ overflowY, borderTopColor, borderTopWidth, borderRadius }).toEqual({
    overflowY: 'auto',
    borderTopColor: tokenColor('line', frame),
    borderTopWidth: '1px',
    borderRadius: '0px',
  });
}

/**
 * On a computer, a square box on an ink hairline over the page, as wide as its token, its frame
 * as tall as its own; on a phone, the whole screen, Previous and Next under the frame, each half.
 */
export async function expectViewerLayout(parts: ImageViewerParts): Promise<void> {
  const { dialog, frame } = parts;
  const { borderRadius, boxShadow } = getComputedStyle(dialog);
  await expect({ borderRadius, boxShadow }).toEqual({ borderRadius: '0px', boxShadow: 'none' });
  const box = dialog.getBoundingClientRect();
  if (isOnAComputer()) {
    await expect(box.width).toBe(tokenPixels('image-viewer-width'));
    await expect(frame.getBoundingClientRect().height).toBe(tokenPixels('image-viewer-height'));
    await expect(getComputedStyle(dialog).borderTopColor).toBe(tokenColor('ink', dialog));
    return;
  }
  await expect({ left: box.left, top: box.top, width: box.width, height: box.height }).toEqual({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  await expectStepsUnderTheFrame(parts);
}

async function expectStepsUnderTheFrame({ dialog, frame }: ImageViewerParts): Promise<void> {
  const [previous, next] = Array.from(dialog.querySelectorAll('button')).slice(-2);
  if (previous === undefined || next === undefined) {
    throw new Error('The viewer has no Previous and Next.');
  }
  const previousBox = previous.getBoundingClientRect();
  const nextBox = next.getBoundingClientRect();
  await expect(previousBox.top).toBeGreaterThan(frame.getBoundingClientRect().bottom);
  await expect(previousBox.top).toBe(nextBox.top);
  await expect(previousBox.width).toBe(nextBox.width);
  await expect(previousBox.left).toBe(frame.getBoundingClientRect().left);
  await expect(nextBox.right).toBe(frame.getBoundingClientRect().right);
}

/** The frame back at the top of the image, once the new one shows. */
export async function expectScrolledToTop(frame: HTMLElement): Promise<void> {
  await waitFor(() => expect(frame.scrollTop).toBe(0));
}
