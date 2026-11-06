/** How a meter's bars are drawn. */
export const MeterTone = {
  /** The filled part in Delft blue on its pale track: a data bar, as the identity draws them. */
  delft: 'delft',
  /** The filled part in ink on the line color: beside other measures drawn in ink. */
  ink: 'ink',
} as const;
export type MeterTone = (typeof MeterTone)[keyof typeof MeterTone];

/** The filled part's, a hatched part's stripes' and the track's colors, by tone. */
export const METER_TONE_CLASSES: Readonly<
  Record<MeterTone, { readonly fill: string; readonly hatch: string; readonly track: string }>
> = {
  delft: { fill: 'bg-delft', hatch: 'text-delft', track: 'bg-delft-pale' },
  ink: { fill: 'bg-ink', hatch: 'text-ink', track: 'bg-line' },
};

/**
 * A meter named for a screen reader, or decorative when the words beside it say its value: the
 * same convention as a status mark.
 */
export function meterRoleOf({
  label,
  valueText,
  value,
  max,
  describedBy,
}: {
  readonly label: string | undefined;
  readonly valueText: string | undefined;
  readonly value: number;
  readonly max: number;
  /** The legend that names the measure's parts, which describes the meter. */
  readonly describedBy?: string | undefined;
}) {
  if (label === undefined) {
    return { 'aria-hidden': true } as const;
  }
  return {
    role: 'meter',
    'aria-label': label,
    'aria-valuemin': 0,
    'aria-valuemax': max,
    'aria-valuenow': Math.min(Math.max(value, 0), max),
    'aria-valuetext': valueText,
    'aria-describedby': describedBy,
  } as const;
}
