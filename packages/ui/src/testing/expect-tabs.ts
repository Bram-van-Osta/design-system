import { expect, waitFor } from 'storybook/test';
import { lineCount } from './expect-first-line.ts';
import { expectHeightAtLeast } from './expect-height.ts';
import { tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const MEDIUM_WEIGHT = '500';
const SEMIBOLD_WEIGHT = '600';
// The focus ring reaches past its element: 2 px wide, offset by 2 px.
const FOCUS_RING_REACH = 4;
// What rounding a scroll offset to device pixels may leave.
const SCROLL_TOLERANCE = 1;

/**
 * The row of tabs: at their width, aligned left and 24 px apart, each one 44 px high at least, square,
 * its label on one line, and sitting on a 1 px rule in `line` across the row. The row is as wide as
 * its tabs at least: when its box is narrower, the box scrolls, never the page. The pointer's hover
 * cannot be simulated, so its surface is pinned by its class.
 */
export async function expectUnderlinedTabs(
  list: HTMLElement,
  tabs: readonly HTMLElement[],
): Promise<void> {
  const page = list.ownerDocument.documentElement;
  await expect(page.scrollWidth).toBeLessThanOrEqual(page.clientWidth);
  await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  const rule = getComputedStyle(list, '::before');
  await expect(rule.borderBottomWidth).toBe('1px');
  await expect(rule.borderBottomColor).toBe(tokenColor('line', list));
  const row = list.getBoundingClientRect();
  await expect(Number.parseFloat(rule.width)).toBeCloseTo(row.width, 0);
  await expect(tabs[0]?.getBoundingClientRect().left).toBe(row.left);
  for (const [index, tab] of tabs.entries()) {
    await expectHeightAtLeast(tab, 'target-min');
    await expect(lineCount(tab)).toBe(1);
    await expect(tab.getBoundingClientRect().bottom).toBe(row.bottom);
    await expect(getComputedStyle(tab).borderRadius).toBe('0px');
    await expect(getComputedStyle(tab).boxShadow).toBe('none');
    await expect(tab).toHaveClass(
      'hover:not-data-active:bg-surface hover:not-data-active:text-ink',
    );
    const previous = tabs[index - 1];
    if (previous !== undefined) {
      await expect(tab.getBoundingClientRect().left - previous.getBoundingClientRect().right).toBe(
        tokenPixels('space-5'),
      );
    }
  }
}

/**
 * The open tab in ink, semibold, underlined 2 px in Delft over the rule, and its panel shown and
 * named by it; the others in ink-muted, not underlined, their panels hidden.
 */
export async function expectOpenTab(
  open: HTMLElement,
  others: readonly HTMLElement[],
): Promise<void> {
  await expect(open).toHaveAttribute('aria-selected', 'true');
  const openStyle = getComputedStyle(open);
  await expect(openStyle.color).toBe(tokenColor('ink', open));
  await expect(openStyle.fontWeight).toBe(SEMIBOLD_WEIGHT);
  await expect(openStyle.borderBottomWidth).toBe(`${tokenPixels('border-select')}px`);
  await expect(openStyle.borderBottomColor).toBe(tokenColor('delft', open));
  await expect(panelOf(open)).toBeVisible();
  for (const other of others) {
    await expect(other).toHaveAttribute('aria-selected', 'false');
    const otherStyle = getComputedStyle(other);
    await expect(otherStyle.color).toBe(tokenColor('ink-muted', other));
    await expect(otherStyle.fontWeight).toBe(MEDIUM_WEIGHT);
    await expect(otherStyle.borderBottomColor).toBe(TRANSPARENT);
    await expect(otherStyle.backgroundColor).toBe(TRANSPARENT);
    // Base UI hides the panel it closes once its exit has run.
    await waitFor(() => expect(panelOf(other)).not.toBeVisible());
  }
}

/** The box of the row of tabs, which scrolls sideways when the row is wider. */
export function scrollerOf(list: HTMLElement): HTMLElement {
  const scroller = list.parentElement;
  if (scroller === null) {
    throw new Error('The row of tabs has no box.');
  }
  return scroller;
}

/**
 * A row wider than its box, on a phone: the box scrolls sideways, and the row, with its rule, runs
 * from the first tab's start to the last one's end.
 */
export async function expectScrollingRow(
  list: HTMLElement,
  tabs: readonly HTMLElement[],
): Promise<void> {
  const scroller = scrollerOf(list);
  await expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
  await expect(getComputedStyle(scroller).overflowX).toBe('auto');
  await expect(tabs.at(-1)?.getBoundingClientRect().right).toBeCloseTo(
    list.getBoundingClientRect().right,
    0,
  );
}

/** The tab shows whole in its row's box, with room for its focus ring, which the box never cuts. */
export async function expectTabInView(tab: HTMLElement): Promise<void> {
  const list = tab.closest<HTMLElement>('[role="tablist"]');
  await expect(list).not.toBeNull();
  if (list === null) {
    return;
  }
  await waitFor(async () => {
    const box = scrollerOf(list).getBoundingClientRect();
    const reach = tab.getBoundingClientRect();
    await expect(reach.left - FOCUS_RING_REACH).toBeGreaterThanOrEqual(box.left - SCROLL_TOLERANCE);
    await expect(reach.right + FOCUS_RING_REACH).toBeLessThanOrEqual(box.right + SCROLL_TOLERANCE);
    await expect(reach.top - FOCUS_RING_REACH).toBeGreaterThanOrEqual(box.top);
    await expect(reach.bottom + FOCUS_RING_REACH).toBeLessThanOrEqual(box.bottom);
  });
}

/** The panel a tab controls, which it names. */
export function panelOf(tab: HTMLElement): HTMLElement {
  const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
  if (panel === null || panel.getAttribute('aria-labelledby') !== tab.id) {
    throw new Error(`No panel named by the tab "${tab.textContent}"`);
  }
  return panel;
}
