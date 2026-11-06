import { describe, expect, it } from 'vitest';
import { type PlacedMeterZone, placeMeterZones, zoneColumnsOf } from './meter-zones.ts';

const SIZES = [{ label: 'S', upTo: 4 }, { label: 'M', upTo: 10 }, { label: 'L' }] as const;

function sharesOf({ fills }: PlacedMeterZone): readonly number[] {
  return fills.map(({ share }) => share);
}

describe('placeMeterZones', () => {
  it('should lay each zone from the previous end to its own, the last to the scale end', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [3], max: 14 });
    expect(zones.map(({ widthShare }) => widthShare)).toEqual([4 / 14, 6 / 14, 4 / 14]);
  });

  it('should fill the zones as far as the value reaches', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [7], max: 14 });
    expect(zones.map(sharesOf)).toEqual([[1], [0.5], [0]]);
  });

  it('should fill every zone when the value passes the scale', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [30], max: 14 });
    expect(zones.map(sharesOf)).toEqual([[1], [1], [1]]);
  });

  it('should drop a zone left with no width by the scale', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [2], max: 4 });
    expect(zones.map(({ label }) => label)).toEqual(['S']);
  });

  it('should fill each zone with the parts one after the other', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [2, 1], max: 14 });
    expect(zones.map(sharesOf)).toEqual([
      [0.5, 0.25],
      [0, 0],
      [0, 0],
    ]);
  });

  it('should carry a part across a tick into the next zone', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [3, 4], max: 14 });
    expect(zones.map(sharesOf)).toEqual([
      [0.75, 0.25],
      [0, 0.5],
      [0, 0],
    ]);
  });

  it('should start a part where the one before it ends, a negative part holding nothing', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [-2, 2, 2], max: 14 });
    expect(zones.map(sharesOf)).toEqual([
      [0, 0.5, 0.5],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it('should stop the parts at the scale end', () => {
    const zones = placeMeterZones({ zones: SIZES, parts: [12, 6], max: 14 });
    expect(zones.map(sharesOf)).toEqual([
      [1, 0],
      [1, 0],
      [0.5, 0.5],
    ]);
  });

  it('should fill nothing on an empty scale', () => {
    expect(placeMeterZones({ zones: SIZES, parts: [0], max: 0 })).toEqual([]);
  });
});

describe('zoneColumnsOf', () => {
  it('should give each zone a column as wide as its stretch', () => {
    const zones = placeMeterZones({
      zones: [{ label: 'S', upTo: 1 }, { label: 'L' }],
      parts: [0],
      max: 4,
    });
    expect(zoneColumnsOf(zones)).toBe('minmax(0, 0.25fr) minmax(0, 0.75fr)');
  });
});
