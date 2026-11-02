import { tokenPixels as pixelsOf } from '../utils/token-pixels.ts';

export type SizeToken =
  | 'space-1'
  | 'space-2'
  | 'space-3'
  | 'space-4'
  | 'space-5'
  | 'space-6'
  | 'target-min'
  | 'text-body'
  | 'icon-button-compact'
  | 'button-height'
  | 'form-width'
  | 'reading-width'
  | 'border-select'
  | 'border-attention'
  | 'account-name-width'
  | 'progress-height'
  | 'toast-width';

/** A size token's value, in pixels, as the page's tokens give it. */
export function tokenPixels(token: SizeToken): number {
  return pixelsOf(token);
}
