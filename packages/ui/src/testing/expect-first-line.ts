import { expect } from 'storybook/test';

// What rounding the layout to device pixels may leave.
const FIRST_LINE_TOLERANCE = 0.5;

function verticalCenter({ top, height }: DOMRect): number {
  return top + height / 2;
}

// The center of the row's first line box: its content's top, plus half a line.
function firstLineCenter(row: Element): number {
  const style = getComputedStyle(row);
  const contentTop =
    row.getBoundingClientRect().top +
    Number.parseFloat(style.borderTopWidth) +
    Number.parseFloat(style.paddingTop);
  return contentTop + Number.parseFloat(style.lineHeight) / 2;
}

/** How many lines the row's first text runs on: a range gives one rectangle per line. */
export function lineCount(row: Element): number {
  const walker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) =>
      node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP,
  });
  const text = walker.nextNode();
  if (text === null) {
    return 0;
  }
  const range = document.createRange();
  range.selectNodeContents(text);
  return new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size;
}

/** The icon or the box beside a text is centered on the text's first line box. */
export async function expectOnFirstLine(row: Element, mark: Element | null): Promise<void> {
  await expect(mark).not.toBeNull();
  if (mark !== null) {
    const offset = verticalCenter(mark.getBoundingClientRect()) - firstLineCenter(row);
    await expect(Math.abs(offset)).toBeLessThanOrEqual(FIRST_LINE_TOLERANCE);
  }
}
