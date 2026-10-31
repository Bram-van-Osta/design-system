import { expect } from 'storybook/test';
import { tokenColor } from './token-color.ts';

// Tailwind's @md container: from this width on, the cards stand in two columns.
const TWO_COLUMNS_MIN_WIDTH = 448;

function cardOf(control: Element): HTMLElement {
  const card = control.closest('label');
  if (card === null) {
    throw new Error('A choice card is the label around its control.');
  }
  return card;
}

/** The chosen card is outlined in Delft, 2 px, the resting one in the field color, and neither content moves. */
export async function expectCardStates(chosen: Element, resting: Element): Promise<void> {
  const chosenCard = cardOf(chosen);
  const restingCard = cardOf(resting);
  const delft = tokenColor('delft', chosenCard);
  await expect(getComputedStyle(chosenCard).borderTopColor).toBe(delft);
  await expect(getComputedStyle(chosenCard, '::before').borderTopColor).toBe(delft);
  await expect(getComputedStyle(restingCard).borderTopColor).toBe(tokenColor('field', restingCard));
  await expect(getComputedStyle(restingCard, '::before').content).toBe('none');
  const inset = (control: Element) =>
    control.getBoundingClientRect().left - cardOf(control).getBoundingClientRect().left;
  await expect(inset(chosen)).toBe(inset(resting));
}

/** Two columns where the group is wide enough, one on a phone. */
export async function expectColumns(
  group: Element,
  [first, second]: readonly [Element, Element],
): Promise<void> {
  const isWide = group.getBoundingClientRect().width >= TWO_COLUMNS_MIN_WIDTH;
  const top = (control: Element) => cardOf(control).getBoundingClientRect().top;
  if (isWide) {
    await expect(top(second)).toBe(top(first));
  } else {
    await expect(top(second)).toBeGreaterThan(top(first));
  }
}
