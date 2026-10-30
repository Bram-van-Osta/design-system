import { classNames } from '../../utils/class-names.ts';
import {
  BRAND_NAME,
  clampLogoSize,
  DEFAULT_SIZES,
  LogoVariant,
  lockupGeometry,
} from './logo-geometry.ts';
import { Tulip } from './Tulip.tsx';

export interface LogoProps {
  /** `lockup`, the tulip and the name; `tulip` alone where room is short, such as a tab. */
  readonly variant?: LogoVariant;
  /** In pixels: the text size of the lockup (13 at least), or the size of the tulip alone (16 at least). */
  readonly size?: number;
  readonly className?: string;
}

/** The signature: the tulip, with the name in Newsreader beside it. Never recolored. */
export function Logo({ variant = LogoVariant.lockup, size, className }: LogoProps) {
  const clampedSize = clampLogoSize(variant, size ?? DEFAULT_SIZES[variant]);
  if (variant === LogoVariant.tulip) {
    return (
      <Tulip
        size={clampedSize}
        label={BRAND_NAME}
        className={classNames('block shrink-0', className)}
      />
    );
  }
  const { tulipSize, gap, rise, nameSize } = lockupGeometry(clampedSize);
  return (
    <span
      className={classNames('inline-flex items-center whitespace-nowrap', className)}
      style={{ gap }}
    >
      <Tulip
        size={tulipSize}
        className="block shrink-0"
        style={{ transform: `translateY(${-rise}px)` }}
      />
      <span className="font-serif text-wordmark text-ink" style={{ fontSize: nameSize }}>
        {BRAND_NAME}
      </span>
    </span>
  );
}
