import { expect } from 'storybook/test';

// The identity's keyboard focus: the focus token, 2 px solid, offset by 2 px.
export async function expectFocusRing(element: Element): Promise<void> {
  await expect(element).toHaveFocus();
  await expect(element.matches(':focus-visible')).toBe(true);
  const { outlineStyle, outlineWidth, outlineOffset } = getComputedStyle(element);
  await expect({ outlineStyle, outlineWidth, outlineOffset }).toEqual({
    outlineStyle: 'solid',
    outlineWidth: '2px',
    outlineOffset: '2px',
  });
}
