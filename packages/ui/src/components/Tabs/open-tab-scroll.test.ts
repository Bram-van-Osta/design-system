import { describe, expect, it } from 'vitest';
import { scrollBehaviorOf, scrollLeftShowing } from './open-tab-scroll.ts';

const BOX = { left: 20, right: 380, scrollLeft: 100 };

describe('scrollLeftShowing', () => {
  it('should leave the row as it is when the tab is inside the box', () => {
    expect(scrollLeftShowing(BOX, { left: 20, right: 380 })).toBeNull();
    expect(scrollLeftShowing(BOX, { left: 150, right: 250 })).toBeNull();
  });

  it('should scroll back until the tab starts where the box starts', () => {
    expect(scrollLeftShowing(BOX, { left: -10, right: 60 })).toBe(70);
  });

  it('should scroll on until the tab ends where the box ends', () => {
    expect(scrollLeftShowing(BOX, { left: 340, right: 420 })).toBe(140);
  });

  it('should show the start of a tab wider than the box', () => {
    expect(scrollLeftShowing(BOX, { left: 60, right: 460 })).toBe(140);
    expect(scrollLeftShowing(BOX, { left: -50, right: 460 })).toBe(30);
  });
});

describe('scrollBehaviorOf', () => {
  it('should glide when the system allows motion', () => {
    expect(scrollBehaviorOf(false)).toBe('smooth');
  });

  it('should jump when the system asks for less motion', () => {
    expect(scrollBehaviorOf(true)).toBe('instant');
  });
});
