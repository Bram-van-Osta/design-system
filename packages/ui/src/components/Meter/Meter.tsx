import { useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { MeterLegend } from './MeterLegend.tsx';
import { type MeterMeasure, partFillOf, partFillStyleOf, partsOf, totalOf } from './meter-part.ts';
import { METER_TONE_CLASSES, MeterTone, meterRoleOf } from './meter-tone.ts';
import {
  type MeterZone,
  type MeterZoneFill,
  placeMeterZones,
  zoneColumnsOf,
} from './meter-zones.ts';

export type { MeterMeasure, MeterPart } from './meter-part.ts';
export type { MeterZone } from './meter-zones.ts';

interface MeterScaleProps {
  /** The scale's end. */
  readonly max: number;
  /**
   * The stretches of the scale, in order, each named under the bar and parted from the next by a
   * dashed tick: a size's limits. Without them, one stretch without a name.
   */
  readonly zones?: readonly MeterZone[];
  /** What the meter measures, for a screen reader: "Module points". Without it, decorative. */
  readonly label?: string;
  /** Its value in words, for a screen reader: "3 points, up to 4 in S". */
  readonly valueText?: string;
  /** `delft` by default, a data bar; `ink` beside measures drawn in ink. */
  readonly tone?: MeterTone;
  readonly className?: string;
}

/** The scale, its zones and its words, then the measure: one `value`, or its `parts`. */
export type MeterProps = MeterScaleProps & MeterMeasure;

const WHOLE_SCALE: readonly MeterZone[] = [{ label: '' }];
const PERCENT = 100;

interface MeterFillProps {
  readonly fill: MeterZoneFill;
  readonly tone: MeterTone;
}

// A part after the first is cut from the one before it by a hairline of the page's color.
function MeterFill({ fill, tone }: MeterFillProps) {
  const { className, style } = partFillStyleOf({ fill: partFillOf(fill.part), tone });
  return (
    <span
      data-fill
      data-part={fill.part}
      className={classNames(
        'block h-full',
        className,
        fill.part > 0 && fill.share > 0 && 'border-bg border-s-hair',
      )}
      style={{ ...style, width: `${fill.share * PERCENT}%` }}
    />
  );
}

/**
 * A measure on a scale in a bar, filled as far as it reaches, its scale cut into named zones
 * parted by dashed ticks, the bars on both sides stopping the same distance short of a tick, and
 * each zone's name under it starting on its tick, wrapping short of the next one: a project's size
 * against its limits. Its measure may come in parts, filled one after the other, the first solid
 * and the next hatched, each named in a legend under the zones.
 */
export function Meter(props: MeterProps) {
  const { max, zones = WHOLE_SCALE, label, valueText, tone = MeterTone.delft, className } = props;
  const legendId = useId();
  const parts = partsOf(props);
  const hasLegend = props.parts !== undefined;
  const placed = placeMeterZones({ zones, parts: parts.map((part) => part.value), max });
  const columns = { gridTemplateColumns: zoneColumnsOf(placed) };
  const hasNames = placed.some((zone) => zone.label !== '');
  const role = meterRoleOf({
    label,
    valueText,
    value: totalOf(parts),
    max,
    describedBy: hasLegend ? legendId : undefined,
  });
  return (
    <div className={classNames('flex w-full flex-col gap-space-2', className)}>
      <div {...role} className="flex flex-col gap-space-1">
        <div className="grid" style={columns}>
          {placed.map((zone, index) => (
            <span
              key={zone.label === '' ? index : zone.label}
              data-zone
              className={classNames(
                'flex h-6 items-center',
                index > 0 && 'border-ink-muted border-s-hair border-dashed ps-0.5',
                index < placed.length - 1 && 'pe-0.5',
              )}
            >
              <span className={classNames('flex h-2.5 w-full', METER_TONE_CLASSES[tone].track)}>
                {zone.fills.map((fill) => (
                  <MeterFill key={fill.part} fill={fill} tone={tone} />
                ))}
              </span>
            </span>
          ))}
        </div>
        {hasNames && (
          <div className="grid font-mono text-ink-muted text-meta" style={columns}>
            {placed.map((zone, index) => (
              <span
                key={zone.label === '' ? index : zone.label}
                data-zone-name
                className="min-w-0 text-balance wrap-break-word pe-space-2"
              >
                {zone.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {hasLegend && <MeterLegend id={legendId} parts={parts} tone={tone} />}
    </div>
  );
}
