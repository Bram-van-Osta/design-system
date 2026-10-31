import type { CSSProperties } from 'react';

interface TulipProps {
  readonly size: number;
  /** Its accessible name when it stands alone; without one, it is hidden beside the name. */
  readonly label?: string;
  readonly className?: string;
  readonly style?: CSSProperties;
}

/**
 * The tulip, drawn with a ruler on a 32 grid: the flower in vermilion, the stem and the leaf in
 * Delft blue. The stem and the leaf are one outline, without a seam between them, and it starts
 * under the flower, which is drawn last so its round bottom keeps its curve.
 */
export function Tulip({ size, label, className, style }: TulipProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-label={label}
      aria-hidden={label === undefined}
      className={className}
      style={style}
    >
      <path
        className="fill-tulip-stem"
        d="M17 16V29H15C10 28.5 7.5 24.5 7.5 20.5C11.5 21.5 14.5 24.5 15 27V16Z"
      />
      <path
        className="fill-tulip-flower"
        d="M9 4.5L12.75 9L16 3.5L19.25 9L23 4.5V13A7 7 0 0 1 9 13Z"
      />
    </svg>
  );
}
