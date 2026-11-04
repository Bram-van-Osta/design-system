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
  | 'text-label'
  | 'icon-button-compact'
  | 'button-height'
  | 'form-width'
  | 'reading-width'
  | 'border-hair'
  | 'border-select'
  | 'border-attention'
  | 'account-name-width'
  | 'progress-height'
  | 'progress-bar-height'
  | 'drop-zone-height'
  | 'drop-zone-compact-height'
  | 'drop-zone-compact-phone-height'
  | 'switch-width'
  | 'switch-height'
  | 'switch-knob'
  | 'toast-width'
  | 'image-viewer-width'
  | 'image-viewer-height';

/** A size token's value, in pixels, as the page's tokens give it. */
export function tokenPixels(token: SizeToken): number {
  return pixelsOf(token);
}
