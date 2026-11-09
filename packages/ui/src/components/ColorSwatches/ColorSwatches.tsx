import { classNames } from '../../utils/class-names.ts';

export interface ColorSwatchesProps {
  /**
   * The colors shown, in their order, as CSS colors: data the app gives, such as a site's own
   * colors, never the identity's, which go through the tokens.
   */
  readonly colors: readonly string[];
  /** What the row shows, which screen readers read: "The colors most present on your pages". */
  readonly label: string;
  /**
   * The row's places, the colors' count by default: a row that holds fewer colors than it may keeps
   * its swatches' size.
   */
  readonly columns?: number;
  readonly className?: string;
}

type Swatch = { readonly key: string; readonly color: string };

// The same color may come twice: a swatch is named by its place.
function swatchesOf(colors: readonly string[]): readonly Swatch[] {
  return colors.map((color, place) => ({ key: `${place}-${color}`, color }));
}

/** Colors side by side, equal squares in a hairline frame, without their codes. */
export function ColorSwatches({ colors, label, columns, className }: ColorSwatchesProps) {
  const places = Math.max(columns ?? colors.length, 1);
  return (
    <div
      role="img"
      aria-label={label}
      className={classNames('grid gap-space-2', className)}
      style={{ gridTemplateColumns: `repeat(${places}, minmax(0, 1fr))` }}
    >
      {swatchesOf(colors).map(({ key, color }) => (
        <span
          key={key}
          aria-hidden="true"
          className="aspect-square border-hair border-line"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
