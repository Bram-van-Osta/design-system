import { expect, waitFor } from 'storybook/test';
import type { HeadingLevel } from '../components/Heading/Heading.tsx';
import { expectOnFirstLine } from './expect-first-line.ts';
import { expectHeightAtLeast } from './expect-height.ts';
import { expectTransitionOnlyWhenMotionAllowed } from './expect-motion.ts';
import { tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

const NO_BACKGROUND = 'rgba(0, 0, 0, 0)';
const TURNED = '180deg';
const UNTURNED = 'none';

function caretOf(trigger: Element): SVGSVGElement {
  const caret = trigger.querySelector('svg');
  if (caret === null) {
    throw new Error("A part's row ends with its caret.");
  }
  return caret;
}

/** The panel the open trigger controls, by its aria-controls. */
export function panelOf(trigger: Element): HTMLElement {
  const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
  if (panel === null) {
    throw new Error('An open trigger controls its panel.');
  }
  return panel;
}

/**
 * The row is the part's heading, at its level, its button inside: the label over the ink rule, on no
 * surface, a target of 44 px, the caret at its end on the label's first line.
 */
export async function expectPartRow(trigger: Element, level: HeadingLevel): Promise<void> {
  const heading = trigger.parentElement;
  await expect(heading?.tagName).toBe(`H${level}`);
  if (heading === null) {
    return;
  }
  const headingStyle = getComputedStyle(heading);
  await expect(headingStyle.borderTopWidth).toBe(`${tokenPixels('border-select')}px`);
  await expect(headingStyle.borderTopColor).toBe(tokenColor('ink', heading));
  await expect(headingStyle.backgroundColor).toBe(NO_BACKGROUND);
  const triggerStyle = getComputedStyle(trigger);
  await expect(triggerStyle.backgroundColor).toBe(NO_BACKGROUND);
  await expect(triggerStyle.paddingTop).toBe(`${tokenPixels('space-3')}px`);
  await expect(triggerStyle.textTransform).toBe('uppercase');
  await expect(triggerStyle.color).toBe(tokenColor('ink-muted', trigger));
  await expectHeightAtLeast(trigger, 'target-min');
  const caret = caretOf(trigger);
  await expect(caret.getBoundingClientRect().right).toBe(trigger.getBoundingClientRect().right);
  await expectOnFirstLine(trigger, caret);
}

/** Unfolded: the caret turned, the panel shown under the row, with no padding of its own. */
export async function expectPartOpen(trigger: Element): Promise<void> {
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const panel = panelOf(trigger);
  await expect(panel).toBeVisible();
  await waitFor(() => expect(getComputedStyle(caretOf(trigger)).rotate).toBe(TURNED));
  const content = panel.firstElementChild;
  await expect(content?.getBoundingClientRect().left).toBe(trigger.getBoundingClientRect().left);
  await expect(content?.getBoundingClientRect().width).toBe(trigger.getBoundingClientRect().width);
  await waitFor(() =>
    expect(content?.getBoundingClientRect().top).toBe(trigger.getBoundingClientRect().bottom),
  );
}

/** Folded: the row stays, its caret unturned, and the panel is gone. */
export async function expectPartFolded(
  trigger: Element,
  content: () => Element | null,
): Promise<void> {
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).not.toHaveAttribute('aria-controls');
  await expect(trigger).toBeVisible();
  await waitFor(() => expect(content()).toBeNull());
  await waitFor(() => expect(getComputedStyle(caretOf(trigger)).rotate).toBe(UNTURNED));
}

/** The caret's turn and the panel's height move only for a system that allows motion. */
export async function expectPartMotionOnlyWhenAllowed(trigger: Element): Promise<void> {
  await expectTransitionOnlyWhenMotionAllowed(caretOf(trigger));
  await expectTransitionOnlyWhenMotionAllowed(panelOf(trigger));
}

/** A focused control at the content's edge keeps its whole ring inside the clipped panel. */
export async function expectRingInsidePanel(control: Element, trigger: Element): Promise<void> {
  const { outlineWidth, outlineOffset } = getComputedStyle(control);
  const reach = Number.parseFloat(outlineWidth) + Number.parseFloat(outlineOffset);
  const ring = control.getBoundingClientRect();
  const panel = panelOf(trigger).getBoundingClientRect();
  await expect(panel.left).toBeLessThanOrEqual(ring.left - reach);
  await expect(panel.right).toBeGreaterThanOrEqual(ring.right + reach);
  await expect(panel.top).toBeLessThanOrEqual(ring.top - reach);
}

const BODY_WEIGHT = '400';
const PREVIEW_SELECTOR = '[data-part-preview]';

function previewOf(trigger: Element): HTMLElement | null {
  return trigger.querySelector<HTMLElement>(PREVIEW_SELECTOR);
}

/**
 * Folded with a preview: a line of small body text under the label, inside the button and its row,
 * read after the label in the button's name and its heading's.
 */
export async function expectPartPreview({
  trigger,
  label,
  preview,
}: {
  readonly trigger: Element;
  readonly label: string;
  readonly preview: string;
}): Promise<HTMLElement> {
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toHaveAccessibleName(`${label} ${preview}`);
  await expect(trigger.parentElement).toHaveAccessibleName(`${label} ${preview}`);
  const line = previewOf(trigger);
  if (line === null) {
    throw new Error("A folded part's preview is a line of its button.");
  }
  await expect(line).toBeVisible();
  await expect(line).toHaveTextContent(preview);
  const style = getComputedStyle(line);
  await expect(Number.parseFloat(style.fontSize)).toBe(tokenPixels('text-small'));
  await expect(style.fontWeight).toBe(BODY_WEIGHT);
  await expect(style.textTransform).toBe('none');
  await expect(style.color).toBe(tokenColor('ink-muted', trigger));
  const box = line.getBoundingClientRect();
  const caret = caretOf(trigger).getBoundingClientRect();
  await expect(box.top).toBeGreaterThanOrEqual(caret.bottom);
  await expect(box.left).toBe(trigger.getBoundingClientRect().left);
  await expect(trigger.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(box.bottom);
  return line;
}

/** Unfolded, or given none: no preview line on the page, and the label alone names the part. */
export async function expectNoPartPreview(trigger: Element, label: string): Promise<void> {
  const line = previewOf(trigger);
  if (line !== null) {
    await expect(line).not.toBeVisible();
  }
  await expect(trigger).toHaveAccessibleName(label);
  await expect(trigger.parentElement).toHaveAccessibleName(label);
}
