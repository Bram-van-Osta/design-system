/** A stretch of a meter's scale, named under it: "S, up to 4". */
export interface MeterZone {
  /** Its name under its stretch of the bar. */
  readonly label: string;
  /** Where it ends on the scale; the last zone may leave it out to run to the scale's end. */
  readonly upTo?: number;
}

/** How much of a zone's width a part of the measure fills, the part by its place among them. */
export interface MeterZoneFill {
  readonly part: number;
  readonly share: number;
}

/** A zone placed on the bar: its share of the bar's width, and how much of it each part fills. */
export interface PlacedMeterZone {
  readonly label: string;
  readonly widthShare: number;
  readonly fills: readonly MeterZoneFill[];
}

interface PlaceMeterZonesOptions {
  readonly zones: readonly MeterZone[];
  /** The measure's parts, in order, each filled after the ones before it. */
  readonly parts: readonly number[];
  readonly max: number;
}

interface Stretch {
  readonly start: number;
  readonly end: number;
}

function clampedShare(part: number, whole: number): number {
  return whole <= 0 ? 0 : Math.min(Math.max(part / whole, 0), 1);
}

// Each part from the previous one's end, a negative part holding nothing.
function partStretchesOf(parts: readonly number[]): readonly Stretch[] {
  let start = 0;
  return parts.map((value) => {
    const stretch = { start, end: start + Math.max(value, 0) };
    start = stretch.end;
    return stretch;
  });
}

// The share of a zone's width a part covers: as far as its end reaches in, less its start's reach.
function fillsOf(zone: Stretch, parts: readonly Stretch[]): readonly MeterZoneFill[] {
  const width = zone.end - zone.start;
  return parts.map((part, index) => ({
    part: index,
    share:
      clampedShare(part.end - zone.start, width) - clampedShare(part.start - zone.start, width),
  }));
}

/**
 * The zones laid on the scale from 0 to `max`, in order: each from the previous one's end to its
 * own, cut at the scale's end, the last running to it; a zone left with no width is dropped. Each
 * is filled by the parts, one after the other, as far as each reaches into it.
 */
export function placeMeterZones({
  zones,
  parts,
  max,
}: PlaceMeterZonesOptions): readonly PlacedMeterZone[] {
  const stretches = partStretchesOf(parts);
  const placed: PlacedMeterZone[] = [];
  let start = 0;
  zones.forEach((zone, index) => {
    const isLast = index === zones.length - 1;
    const end = Math.min(isLast ? max : (zone.upTo ?? max), max);
    if (end > start) {
      placed.push({
        label: zone.label,
        widthShare: clampedShare(end - start, max),
        fills: fillsOf({ start, end }, stretches),
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
