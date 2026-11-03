/** A stretch of a meter's scale, named under it: "S, up to 4". */
export interface MeterZone {
  /** Its name under its stretch of the bar. */
  readonly label: string;
  /** Where it ends on the scale; the last zone may leave it out to run to the scale's end. */
  readonly upTo?: number;
}

/** A zone placed on the bar: its share of the bar's width, and how much of it the value fills. */
export interface PlacedMeterZone {
  readonly label: string;
  readonly widthShare: number;
  readonly fillShare: number;
}

interface PlaceMeterZonesOptions {
  readonly zones: readonly MeterZone[];
  readonly value: number;
  readonly max: number;
}

function clampedShare(part: number, whole: number): number {
  return whole <= 0 ? 0 : Math.min(Math.max(part / whole, 0), 1);
}

/**
 * The zones laid on the scale from 0 to `max`, in order: each from the previous one's end to its
 * own, cut at the scale's end, the last running to it; a zone left with no width is dropped. Each
 * is filled as far as the value reaches into it.
 */
export function placeMeterZones({
  zones,
  value,
  max,
}: PlaceMeterZonesOptions): readonly PlacedMeterZone[] {
  const placed: PlacedMeterZone[] = [];
  let start = 0;
  zones.forEach((zone, index) => {
    const isLast = index === zones.length - 1;
    const end = Math.min(isLast ? max : (zone.upTo ?? max), max);
    if (end > start) {
      placed.push({
        label: zone.label,
        widthShare: clampedShare(end - start, max),
        fillShare: clampedShare(value - start, end - start),
      });
    }
    start = Math.max(start, end);
  });
  return placed;
}

/** The columns of the zones, each as wide as its stretch of the scale. */
export function zoneColumnsOf(zones: readonly PlacedMeterZone[]): string {
  return zones.map(({ widthShare }) => `minmax(0, ${widthShare}fr)`).join(' ');
}
