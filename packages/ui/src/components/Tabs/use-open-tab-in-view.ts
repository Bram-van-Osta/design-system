import { type RefObject, useEffect, useRef } from 'react';
import { useReducedMotion } from '../../utils/use-reduced-motion.ts';
import { scrollBehaviorOf, scrollLeftShowing } from './open-tab-scroll.ts';

const TAB_SELECTOR = '[role="tab"]';

// The visible part of the row lies inside its padding, which leaves room for the focus ring.
function scrollBoxOf(scroller: HTMLElement) {
  const { left, right } = scroller.getBoundingClientRect();
  const style = getComputedStyle(scroller);
  return {
    left: left + Number.parseFloat(style.paddingLeft),
    right: right - Number.parseFloat(style.paddingRight),
    scrollLeft: scroller.scrollLeft,
  };
}

function showTab(scroller: HTMLElement, index: number, behavior: ScrollBehavior): void {
  const tab = scroller.querySelectorAll(TAB_SELECTOR)[index];
  if (tab === undefined) {
    return;
  }
  const left = scrollLeftShowing(scrollBoxOf(scroller), tab.getBoundingClientRect());
  if (left !== null) {
    scroller.scrollTo({ left, behavior });
  }
}

/**
 * Keeps the open tab in view in a row that scrolls sideways: at once when the row appears, gliding
 * when another tab opens or the row changes size (its fonts, a phone turned), unless the system
 * asks for less motion. Only the row scrolls, never the page.
 */
export function useOpenTabInView(
  scrollerRef: RefObject<HTMLElement | null>,
  openIndex: number,
): void {
  const isReducedMotion = useReducedMotion();
  const shownIndexRef = useRef(openIndex);
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller === null) {
      return;
    }
    let behavior: ScrollBehavior = 'instant';
    const observer = new ResizeObserver(() => {
      showTab(scroller, shownIndexRef.current, behavior);
      behavior = scrollBehaviorOf(isReducedMotion);
    });
    observer.observe(scroller);
    for (const child of scroller.children) {
      observer.observe(child);
    }
    return () => observer.disconnect();
  }, [scrollerRef, isReducedMotion]);
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller === null || shownIndexRef.current === openIndex) {
      return;
    }
    shownIndexRef.current = openIndex;
    showTab(scroller, openIndex, scrollBehaviorOf(isReducedMotion));
  }, [scrollerRef, openIndex, isReducedMotion]);
}
