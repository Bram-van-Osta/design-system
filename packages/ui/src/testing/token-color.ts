export type ColorToken = 'ink' | 'surface' | 'vermillion';

/** A color token's value as the page computes it, in the theme around the element. */
export function tokenColor(token: ColorToken, around: Element): string {
  const probe = document.createElement('span');
  probe.style.color = `var(--${token})`;
  around.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}
