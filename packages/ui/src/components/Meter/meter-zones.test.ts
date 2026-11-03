import { describe, expect, it } from 'vitest';
import { placeMeterZones, zoneColumnsOf } from './meter-zones.ts';

const SIZES = [{ label: 'S', upTo: 4 }, { label: 'M', upTo: 10 }, { label: 'L' }] as const;

describe('placeMeterZones', () => {
  it('should lay each zone from the previous end to its own, the last to the scale end', () => {
    const zones = placeMeterZones({ zones: SIZES, value: 3, max: 14 });
    expect(zones.map(({ widthShare }) => widthShare)).toEqual([4 / 14, 6 / 14, 4 / 14]);
  });

  it('should fill the zones as far as the value reaches', () => {
    const zones = placeMeterZones({ zones: SIZES, value: 7, max: 14 });
    expect(zones.map(({ fillShare }) => fillShare)).toEqual([1, 0.5, 0]);
  });

  it('should fill every zone when the value passes the scale', () => {
    const zones = placeMeterZones({ zones: SIZES, value: 30, max: 14 });
    expect(zones.map(({ fillShare }) => fillShare)).toEqual([1, 1, 1]);
  });

  it('should drop a zone left with no width by the scale', () => {
    const zones = placeMeterZones({ zones: SIZES, value: 2, max: 4 });
    expect(zones.map(({ label }) => label)).toEqual(['S']);
  });

  it('should fill nothing on an empty scale', () => {
    expect(placeMeterZones({ zones: SIZES, value: 0, max: 0 })).toEqual([]);
  });
});

describe('zoneColumnsOf', () => {
  it('should give each zone a column as wide as its stretch', () => {
    const zones = placeMeterZones({
      zones: [{ label: 'S', upTo: 1 }, { label: 'L' }],
      value: 0,
      max: 4,
    });
    expect(zoneColumnsOf(zones)).toBe('minmax(0, 0.25fr) minmax(0, 0.75fr)');
  });
});
