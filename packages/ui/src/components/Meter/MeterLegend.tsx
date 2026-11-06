import { classNames } from '../../utils/class-names.ts';
import { type MeterPart, MeterPartFill, partFillOf, partFillStyleOf } from './meter-part.ts';
import { METER_TONE_CLASSES, type MeterTone } from './meter-tone.ts';

interface MeterLegendProps {
  /** What the meter's `aria-describedby` names. */
  readonly id: string;
  readonly parts: readonly MeterPart[];
  readonly tone: MeterTone;
}

/**
 * A meter's parts named in a row, each after a swatch filled as its part is, wrapping on a narrow
 * screen: spans, for a meter that stands in a line of text.
 */
export function MeterLegend({ id, parts, tone }: MeterLegendProps) {
  return (
    <span
      id={id}
      className="flex flex-wrap gap-x-space-4 gap-y-space-1 font-mono text-ink-muted text-meta"
    >
      {parts.map((part, index) => {
        const fill = partFillOf(index);
        const { className, style } = partFillStyleOf({ fill, tone });
        const ground = fill === MeterPartFill.hatched ? METER_TONE_CLASSES[tone].track : '';
        return (
          <span key={part.label} className="flex items-center gap-space-2">
            <span
              aria-hidden
              data-swatch
              className={classNames('size-2.5 shrink-0', ground, className)}
              style={style}
            />
            {part.label}
          </span>
        );
      })}
    </span>
  );
}
