import { type RefObject, useEffect, useState } from 'react';

/** Whether the element's content is wider than the element, measured again as either resizes. */
export function useIsOverflowing(ref: RefObject<HTMLElement | null>): boolean {
  const [isOverflowing, setIsOverflowing] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (element === null) {
      return;
    }
    const observer = new ResizeObserver(() =>
      setIsOverflowing(element.scrollWidth > element.clientWidth),
    );
    observer.observe(element);
    for (const child of element.children) {
      observer.observe(child);
    }
    return () => observer.disconnect();
  }, [ref]);
  return isOverflowing;
}
