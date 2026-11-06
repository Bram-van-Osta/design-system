import type { CSSProperties } from 'react';
import { METER_TONE_CLASSES, type MeterTone } from './meter-tone.ts';

/** A part of a meter's measure, filled after the parts before it: the modules' points. */
export interface MeterPart {
  /** How much of the measure it holds. */
  readonly value: number;
  /**
   * Its name and value beside its swatch, in the legend under the meter that describes it for a
   * screen reader: "Modules · 4 points".
   */
  readonly label: string;
}

/**
 * A meter's measure: one value, or its parts filled in turn on the same track and named in a
 * legend under it.
 */
export interface MeterMeasure {
  /** Where the measure stands on the scale, given whole; past `max`, the meter is full. */
  readonly value?: number;
  /**
   * Or its parts, in order, in place of `value`: the first solid, the next hatched, and so on in
   * turn, each named in the legend.
   */
  readonly parts?: readonly MeterPart[];
}

/** How a part is filled: each differs from its neighbours by its pattern, never by its hue. */
export const MeterPartFill = {
  /** The tone's color, solid: the first part, and every odd one. */
  solid: 'solid',
  /** Stripes of the tone's color over the track: the second part, and every even one. */
  hatched: 'hatched',
} as const;
export type MeterPartFill = (typeof MeterPartFill)[keyof typeof MeterPartFill];

const HATCH_ANGLE = '135deg';
const HATCH_STRIPE = '2px';
const HATCH_PERIOD = '4px';
const HATCHING: CSSProperties = {
  backgroundImage: `repeating-linear-gradient(${HATCH_ANGLE}, currentColor 0 ${HATCH_STRIPE}, transparent ${HATCH_STRIPE} ${HATCH_PERIOD})`,
};

/** The measure's parts: its own, or its single value as one part without a name. */
export function partsOf(measure: MeterMeasure): readonly MeterPart[] {
  return measure.parts ?? [{ value: measure.value ?? 0, label: '' }];
}

/** Where the measure stands: its parts added up, a negative part counting for nothing. */
export function totalOf(parts: readonly MeterPart[]): number {
  return parts.reduce((total, part) => total + Math.max(part.value, 0), 0);
}

export function partFillOf(index: number): MeterPartFill {
  return index % 2 === 0 ? MeterPartFill.solid : MeterPartFill.hatched;
}

/**
 * A part's colors: solid, the tone's fill; hatched, the tone's stripes, on whatever ground the
 * caller lays under them.
 */
export function partFillStyleOf({
  fill,
  tone,
}: {
  readonly fill: MeterPartFill;
  readonly tone: MeterTone;
}) {
  const colors = METER_TONE_CLASSES[tone];
  if (fill === MeterPartFill.solid) {
    return { className: colors.fill, style: undefined };
  }
  return { className: colors.hatch, style: HATCHING };
}
