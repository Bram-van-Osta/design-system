import { expect, waitFor } from 'storybook/test';
import { expectHeightAtLeast } from './expect-height.ts';
import { tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const MEDIUM_WEIGHT = '500';
const SEMIBOLD_WEIGHT = '600';

/**
 * The row of tabs: at their width, aligned left and 24 px apart, each one 44 px high at least, square
 * and sitting on a 1 px rule in `line` across the row, which never overflows. The pointer's hover
 * cannot be simulated, so its surface is pinned by its class.
 */
export async function expectUnderlinedTabs(
  list: HTMLElement,
  tabs: readonly HTMLElement[],
): Promise<void> {
  await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
  const rule = getComputedStyle(list, '::before');
  await expect(rule.borderBottomWidth).toBe('1px');
  await expect(rule.borderBottomColor).toBe(tokenColor('line', list));
  await expect(Number.parseFloat(rule.width)).toBe(list.clientWidth);
  const row = list.getBoundingClientRect();
  await expect(tabs[0]?.getBoundingClientRect().left).toBe(row.left);
  for (const [index, tab] of tabs.entries()) {
    await expectHeightAtLeast(tab, 'target-min');
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

/** The panel a tab controls, which it names. */
export function panelOf(tab: HTMLElement): HTMLElement {
  const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
  if (panel === null || panel.getAttribute('aria-labelledby') !== tab.id) {
    throw new Error(`No panel named by the tab "${tab.textContent}"`);
  }
  return panel;
}
