export type SizeToken =
  | 'target-min'
  | 'button-height'
  | 'form-width'
  | 'reading-width'
  | 'border-attention'
  | 'account-name-width';

/** A size token's value, in pixels, as the page's tokens give it. */
export function tokenPixels(token: SizeToken): number {
  return Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(`--${token}`),
  );
}
