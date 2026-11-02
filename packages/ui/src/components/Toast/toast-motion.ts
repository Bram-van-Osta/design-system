import type { Toast } from '@base-ui/react/toast';
import type { CSSProperties } from 'react';

/** At most three toasts at once: a fourth sends the oldest away. */
export const TOAST_LIMIT = 3;

/** Swiped to the right, or down as on a phone: past 40 px, Base UI dismisses it. */
export const TOAST_SWIPE_DIRECTIONS = ['right', 'down'] as const;

// C-19, direction 1. The package has no motion token yet: the durations, easings and distances live here.
export const ToastMotion = {
  // Entering, and each toast of the stack sliding to its new place as the stack moves or unfolds.
  enterMilliseconds: 200,
  leaveMilliseconds: 160,
  enterEasing: 'ease-out',
  leaveEasing: 'ease-in',
  // Up from below by its own height.
  enterShift: '100%',
  leaveShift: '60%',
  // Out by its own width or height, past where the swipe let it go.
  swipeLeaveShift: '100%',
  // How much smaller each toast behind is than the one before it.
  stackScaleStep: 0.05,
  // How much of each toast behind shows above the one before it.
  stackPeek: 'var(--space-2)',
  // Between two toasts of the unfolded stack.
  stackGap: 'var(--space-3)',
} as const;

type SwipeDirection = NonNullable<Toast.Root.State['swipeDirection']>;

const INDEX = 'var(--toast-index)';
const SWIPE_X = 'var(--toast-swipe-movement-x)';
const SWIPE_Y = 'var(--toast-swipe-movement-y)';
const OWN_HEIGHT = 'var(--toast-height)';
// Folded, every toast takes the front one's height, so that the slivers behind are even.
const FOLDED_HEIGHT = `var(--toast-frontmost-height, ${OWN_HEIGHT})`;
const FOLDED_SCALE = `max(0, 1 - ${INDEX} * ${ToastMotion.stackScaleStep})`;
const FOLDED_Y = `calc(${SWIPE_Y} - ${INDEX} * ${ToastMotion.stackPeek} - (1 - ${FOLDED_SCALE}) * ${FOLDED_HEIGHT})`;
const UNFOLDED_Y = `calc(${SWIPE_Y} - var(--toast-offset-y) - ${INDEX} * ${ToastMotion.stackGap})`;

interface Place {
  readonly x: string;
  readonly y: string;
  readonly scale: string;
}

function placeOf(isExpanded: boolean): Place {
  return isExpanded
    ? { x: SWIPE_X, y: UNFOLDED_Y, scale: '1' }
    : { x: SWIPE_X, y: FOLDED_Y, scale: FOLDED_SCALE };
}

function transformOf({ x, y, scale }: Place): string {
  return `translateX(${x}) translateY(${y}) scale(${scale})`;
}

function shifted(length: string, shift: string): string {
  return `calc(${length} + ${shift})`;
}

const SWIPED_AWAY: Readonly<Record<SwipeDirection, (place: Place) => Place>> = {
  right: (place) => ({ ...place, x: shifted(place.x, ToastMotion.swipeLeaveShift) }),
  left: (place) => ({ ...place, x: shifted(place.x, `-${ToastMotion.swipeLeaveShift}`) }),
  down: (place) => ({ ...place, y: shifted(place.y, ToastMotion.swipeLeaveShift) }),
  up: (place) => ({ ...place, y: shifted(place.y, `-${ToastMotion.swipeLeaveShift}`) }),
};

function leavingPlace(place: Place, swipeDirection: SwipeDirection | undefined): Place {
  if (swipeDirection === undefined) {
    return { ...place, y: shifted(place.y, ToastMotion.leaveShift) };
  }
  return SWIPED_AWAY[swipeDirection](place);
}

function movingPlace(state: Toast.Root.State): Place {
  const place = placeOf(state.expanded);
  if (state.transitionStatus === 'starting') {
    return { ...place, y: shifted(place.y, ToastMotion.enterShift) };
  }
  if (state.transitionStatus === 'ending') {
    return leavingPlace(place, state.swipeDirection);
  }
  return place;
}

function transitionOf(properties: readonly string[], isLeaving: boolean): string {
  const duration = isLeaving ? ToastMotion.leaveMilliseconds : ToastMotion.enterMilliseconds;
  const easing = isLeaving ? ToastMotion.leaveEasing : ToastMotion.enterEasing;
  return properties.map((property) => `${property} ${duration}ms ${easing}`).join(', ');
}

function isShown(state: Toast.Root.State): boolean {
  return (
    state.transitionStatus !== 'starting' && state.transitionStatus !== 'ending' && !state.limited
  );
}

export interface ToastRootStyleOptions {
  readonly state: Toast.Root.State;
  readonly isReducedMotion: boolean;
}

/**
 * Where a toast stands in the stack and how it gets there, from Base UI's state and variables:
 * transform and opacity only, and a fade alone when the system asks for less motion.
 */
export function toastRootStyle({ state, isReducedMotion }: ToastRootStyleOptions): CSSProperties {
  const style: CSSProperties = {
    zIndex: `calc(${TOAST_LIMIT} - ${INDEX})`,
    height: state.expanded ? OWN_HEIGHT : FOLDED_HEIGHT,
    opacity: isShown(state) ? 1 : 0,
  };
  // While a finger drags it, Base UI places the toast itself.
  if (state.swiping) {
    return style;
  }
  const isLeaving = state.transitionStatus === 'ending';
  if (isReducedMotion) {
    return {
      ...style,
      transform: transformOf(placeOf(state.expanded)),
      transition: transitionOf(['opacity'], isLeaving),
    };
  }
  return {
    ...style,
    transform: transformOf(movingPlace(state)),
    transition: transitionOf(['transform', 'opacity'], isLeaving),
  };
}

/** The text of the toasts behind the front one fades out while the stack is folded. */
export function toastContentStyle(state: Toast.Content.State): CSSProperties {
  return {
    opacity: state.behind && !state.expanded ? 0 : 1,
    transition: `opacity ${ToastMotion.enterMilliseconds}ms ${ToastMotion.enterEasing}`,
  };
}
