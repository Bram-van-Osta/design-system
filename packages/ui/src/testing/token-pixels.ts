export type SizeToken = 'target-min' | 'button-height' | 'form-width' | 'border-attention';

/** A size token's value, in pixels, as the page's tokens give it. */
export function tokenPixels(token: SizeToken): number {
  return Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(`--${token}`),
  );
}
