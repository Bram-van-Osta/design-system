export const BRAND_NAME = 'Bram van Osta';

export const LogoVariant = {
  lockup: 'lockup',
  tulip: 'tulip',
} as const;
export type LogoVariant = (typeof LogoVariant)[keyof typeof LogoVariant];

// The lockup's proportions, as factors of its text size: the tulip is 1.4 times as tall, 0.3 times
// apart, and rises by 0.12 times to center on the name's capitals rather than on its line box.
const TULIP_SCALE = 1.4;
const GAP_SCALE = 0.3;
const RISE_SCALE = 0.12;
const NAME_SCALE = 1.06;

// The smallest sizes, in pixels: the tulip alone, and the text of the lockup.
const MIN_SIZES: Readonly<Record<LogoVariant, number>> = { lockup: 13, tulip: 16 };

export const DEFAULT_SIZES: Readonly<Record<LogoVariant, number>> = { lockup: 16, tulip: 32 };

export interface LockupGeometry {
  readonly tulipSize: number;
  readonly gap: number;
  readonly rise: number;
  readonly nameSize: number;
}

export function clampLogoSize(variant: LogoVariant, size: number): number {
  return Math.max(size, MIN_SIZES[variant]);
}

export function lockupGeometry(textSize: number): LockupGeometry {
  return {
    tulipSize: textSize * TULIP_SCALE,
    gap: textSize * GAP_SCALE,
    rise: textSize * RISE_SCALE,
    nameSize: textSize * NAME_SCALE,
  };
}
