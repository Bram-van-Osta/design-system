import { describe, expect, it } from 'vitest';
import { clampLogoSize, LogoVariant, lockupGeometry } from './logo-geometry.ts';

describe('lockupGeometry', () => {
  it('should size the tulip, the gap, the rise and the name from the text size', () => {
    const { tulipSize, gap, rise, nameSize } = lockupGeometry(20);
    expect(tulipSize).toBeCloseTo(28);
    expect(gap).toBeCloseTo(6);
    expect(rise).toBeCloseTo(2.4);
    expect(nameSize).toBeCloseTo(21.2);
  });
});

describe('clampLogoSize', () => {
  it('should keep the tulip alone at 16 px at least', () => {
    expect(clampLogoSize(LogoVariant.tulip, 12)).toBe(16);
  });

  it('should keep the text of the lockup at 13 px at least', () => {
    expect(clampLogoSize(LogoVariant.lockup, 10)).toBe(13);
  });

  it('should keep a size above the minimum', () => {
    expect(clampLogoSize(LogoVariant.lockup, 20)).toBe(20);
  });
});
