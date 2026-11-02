import { expect, screen, waitFor } from 'storybook/test';
import { ToastMotion } from '../components/Toast/toast-motion.ts';
import { isOnAComputer } from './is-on-a-computer.ts';
import { tokenPixels } from './token-pixels.ts';

// Base UI's toasts while they enter or leave.
const MOVING_TOASTS = '[data-starting-style], [data-ending-style]';
const SHOWN = '1';
const HIDDEN = '0';

/** Once every toast has entered or left, and nothing moves any more. */
export async function toastsSettled(): Promise<void> {
  await waitFor(() => {
    expect(document.querySelector(MOVING_TOASTS)).toBeNull();
    expect(document.getAnimations()).toHaveLength(0);
  });
}

interface ToastStack {
  readonly viewport: Element | null;
  readonly toasts: readonly HTMLElement[];
}

/** The toasts' region, and its toasts from the newest, at the front, to the oldest. */
export function toastStack(): ToastStack {
  const toasts = screen.getAllByRole('dialog');
  return { viewport: toasts[0]?.closest('[role="region"]') ?? null, toasts };
}

function textOpacityOf(toast: HTMLElement): string {
  const content = toast.firstElementChild;
  return content === null ? HIDDEN : getComputedStyle(content).opacity;
}

/** At the bottom of the screen: its right corner on a computer, its whole width on a phone. */
export async function expectAtTheBottom(front: HTMLElement): Promise<void> {
  const box = front.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  if (isOnAComputer()) {
    await expect(box.width).toBeCloseTo(tokenPixels('toast-width'), 0);
    await expect(box.right).toBeCloseTo(clientWidth - tokenPixels('space-6'), 0);
    await expect(box.bottom).toBeCloseTo(clientHeight - tokenPixels('space-6'), 0);
    return;
  }
  await expect(box.left).toBeCloseTo(tokenPixels('space-4'), 0);
  await expect(box.right).toBeCloseTo(clientWidth - tokenPixels('space-4'), 0);
  await expect(box.bottom).toBeCloseTo(clientHeight - tokenPixels('space-4'), 0);
}

/** The newest in front; each one before it behind, smaller and higher by a sliver, its text hidden. */
export async function expectFolded({ viewport, toasts }: ToastStack): Promise<void> {
  const [front, ...behind] = toasts;
  await expect(viewport).not.toHaveAttribute('data-expanded');
  await expect(front).toBeDefined();
  if (front === undefined) {
    return;
  }
  const frontBox = front.getBoundingClientRect();
  await expect(textOpacityOf(front)).toBe(SHOWN);
  for (const [position, toast] of behind.entries()) {
    const index = position + 1;
    const box = toast.getBoundingClientRect();
    await expect(box.width).toBeCloseTo(
      frontBox.width * (1 - index * ToastMotion.stackScaleStep),
      0,
    );
    await expect(box.top).toBeCloseTo(frontBox.top - index * tokenPixels('space-2'), 0);
    await expect(box.bottom).toBeLessThan(frontBox.bottom);
    await expect(textOpacityOf(toast)).toBe(HIDDEN);
  }
}

/** A column, the newest at the bottom, each toast at its full width and its text shown. */
export async function expectUnfolded({ viewport, toasts }: ToastStack): Promise<void> {
  await expect(viewport).toHaveAttribute('data-expanded');
  for (const [index, older] of toasts.entries()) {
    await expect(textOpacityOf(older)).toBe(SHOWN);
    const newer = toasts[index - 1];
    if (newer !== undefined) {
      const newerBox = newer.getBoundingClientRect();
      const olderBox = older.getBoundingClientRect();
      await expect(olderBox.width).toBeCloseTo(newerBox.width, 0);
      await expect(olderBox.bottom).toBeCloseTo(newerBox.top - tokenPixels('space-3'), 0);
    }
  }
}
