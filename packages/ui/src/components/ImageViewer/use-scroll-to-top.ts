import { type RefObject, useLayoutEffect, useRef } from 'react';

/** The element scrolled back to its top whenever `value` changes, before the browser paints. */
export function useScrollToTop<Value>(value: Value): RefObject<HTMLDivElement | null> {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const shownValue = useRef(value);
  useLayoutEffect(() => {
    if (shownValue.current === value) {
      return;
    }
    shownValue.current = value;
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [value]);
  return scrollerRef;
}
