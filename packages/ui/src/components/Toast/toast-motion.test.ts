import type { Toast } from '@base-ui/react/toast';
import { describe, expect, it } from 'vitest';
import { ToastMotion, toastContentStyle, toastRootStyle } from './toast-motion.ts';

const AT_REST: Toast.Root.State = {
  transitionStatus: undefined,
  expanded: false,
  limited: false,
  type: undefined,
  swiping: false,
  swipeDirection: undefined,
};

function styleOf(state: Partial<Toast.Root.State>, isReducedMotion = false) {
  return toastRootStyle({ state: { ...AT_REST, ...state }, isReducedMotion });
}

const ENTER_TRANSITION = `transform ${ToastMotion.enterMilliseconds}ms ease-out, opacity ${ToastMotion.enterMilliseconds}ms ease-out`;
const LEAVE_TRANSITION = `transform ${ToastMotion.leaveMilliseconds}ms ease-in, opacity ${ToastMotion.leaveMilliseconds}ms ease-in`;

describe('toastRootStyle', () => {
  describe('at rest', () => {
    it('should stand folded in the stack, smaller and higher by its index, at the front height', () => {
      const style = styleOf({});
      expect(style.transform).toBe(
        'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - var(--toast-index) * var(--space-2) - (1 - max(0, 1 - var(--toast-index) * 0.05)) * var(--toast-frontmost-height, var(--toast-height)))) scale(max(0, 1 - var(--toast-index) * 0.05))',
      );
      expect(style.height).toBe('var(--toast-frontmost-height, var(--toast-height))');
      expect(style.opacity).toBe(1);
      expect(style.transition).toBe(ENTER_TRANSITION);
      expect(style.zIndex).toBe('calc(3 - var(--toast-index))');
    });

    it('should stand unfolded in a column at its own height and size', () => {
      const style = styleOf({ expanded: true });
      expect(style.transform).toBe(
        'translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - var(--toast-offset-y) - var(--toast-index) * var(--space-3))) scale(1)',
      );
      expect(style.height).toBe('var(--toast-height)');
    });

    it('should be hidden once past the limit', () => {
      expect(styleOf({ limited: true }).opacity).toBe(0);
    });
  });

  describe('entering', () => {
    it('should come up from below by its height, faded out', () => {
      const style = styleOf({ transitionStatus: 'starting' });
      expect(style.transform).toContain(`+ ${ToastMotion.enterShift})`);
      expect(style.opacity).toBe(0);
      expect(style.transition).toBe(ENTER_TRANSITION);
    });
  });

  describe('leaving', () => {
    it('should go down by 60% and fade, faster and easing in', () => {
      const style = styleOf({ transitionStatus: 'ending' });
      expect(style.transform).toContain(`+ ${ToastMotion.leaveShift})`);
      expect(style.opacity).toBe(0);
      expect(style.transition).toBe(LEAVE_TRANSITION);
    });

    it('should go on to the right when swiped to the right', () => {
      const style = styleOf({ transitionStatus: 'ending', swipeDirection: 'right' });
      expect(style.transform).toContain(
        `translateX(calc(var(--toast-swipe-movement-x) + ${ToastMotion.swipeLeaveShift}))`,
      );
      expect(style.transform).not.toContain(ToastMotion.leaveShift);
    });

    it('should go on down when swiped down', () => {
      const style = styleOf({ transitionStatus: 'ending', swipeDirection: 'down' });
      expect(style.transform).toContain(`+ ${ToastMotion.swipeLeaveShift})) scale`);
      expect(style.transform).toContain('translateX(var(--toast-swipe-movement-x))');
    });
  });

  describe('swiped', () => {
    it('should leave the place and the transition to Base UI while the finger drags it', () => {
      const style = styleOf({ swiping: true });
      expect(style).not.toHaveProperty('transform');
      expect(style).not.toHaveProperty('transition');
    });
  });

  describe('with reduced motion', () => {
    it.each(['starting', 'ending'] as const)(
      'should keep its place and only fade when %s',
      (transitionStatus) => {
        const style = styleOf({ transitionStatus }, true);
        expect(style.transform).toBe(styleOf({}).transform);
        expect(style.opacity).toBe(0);
        expect(style.transition).not.toContain('transform');
        expect(style.transition).toContain('opacity');
      },
    );

    it('should not slide when the stack unfolds', () => {
      const style = styleOf({ expanded: true }, true);
      expect(style.transform).toBe(styleOf({ expanded: true }).transform);
      expect(style.transition).toBe(`opacity ${ToastMotion.enterMilliseconds}ms ease-out`);
    });
  });
});

describe('toastContentStyle', () => {
  it('should hide the text of a toast behind the front one while folded', () => {
    expect(toastContentStyle({ behind: true, expanded: false }).opacity).toBe(0);
  });

  it('should show it again once unfolded', () => {
    expect(toastContentStyle({ behind: true, expanded: true }).opacity).toBe(1);
    expect(toastContentStyle({ behind: false, expanded: false }).opacity).toBe(1);
  });
});
