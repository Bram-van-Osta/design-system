/** A token's value in pixels, read from the page's variables, so that a product's override holds. */
export function tokenPixels(token: string): number {
  return Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(`--${token}`),
  );
}
