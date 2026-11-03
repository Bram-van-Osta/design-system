import { classNames } from '../../utils/class-names.ts';
import { METER_TONE_CLASSES, MeterTone, meterRoleOf } from './meter-tone.ts';
import { type MeterZone, placeMeterZones, zoneColumnsOf } from './meter-zones.ts';

export type { MeterZone } from './meter-zones.ts';

export interface MeterProps {
  /** Where the measure stands on the scale; past `max`, the bar is full. */
  readonly value: number;
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

const WHOLE_SCALE: readonly MeterZone[] = [{ label: '' }];
const PERCENT = 100;

/**
 * A measure on a scale in a bar, filled as far as it reaches, its scale cut into named zones
 * parted by dashed ticks, their names under it: a project's size against its limits.
 */
export function Meter({
  value,
  max,
  zones = WHOLE_SCALE,
  label,
  valueText,
  tone = MeterTone.delft,
  className,
}: MeterProps) {
  const placed = placeMeterZones({ zones, value, max });
  const columns = { gridTemplateColumns: zoneColumnsOf(placed) };
  const colors = METER_TONE_CLASSES[tone];
  const hasNames = placed.some((zone) => zone.label !== '');
  return (
    <div
      {...meterRoleOf({ label, valueText, value, max })}
      className={classNames('flex w-full flex-col gap-space-1', className)}
    >
      <div className="grid" style={columns}>
        {placed.map((zone, index) => (
          <span
            key={zone.label === '' ? index : zone.label}
            data-zone
            className={classNames(
              'flex h-6 items-center',
              index > 0 && 'border-ink-muted border-s-hair border-dashed ps-0.5',
            )}
          >
            <span className={classNames('h-2.5 w-full', colors.track)}>
              <span
                data-fill
                className={classNames('block h-full', colors.fill)}
                style={{ width: `${zone.fillShare * PERCENT}%` }}
              />
            </span>
          </span>
        ))}
      </div>
      {hasNames && (
        <div className="grid font-mono text-ink-muted text-meta" style={columns}>
          {placed.map((zone, index) => (
            <span
              key={zone.label === '' ? index : zone.label}
              className="min-w-0 wrap-break-word ps-1"
            >
              {zone.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
