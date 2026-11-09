import { type Ref, type RefCallback, useCallback, useLayoutEffect, useRef } from 'react';

interface Mirror {
  /** The text area's ref, which also reaches the app's. */
  readonly textAreaRef: RefCallback<HTMLTextAreaElement>;
  /** The layer behind it, which paints the passages. */
  readonly mirrorRef: RefCallback<HTMLDivElement>;
}

// The layer scrolls with the text area, and leaves out the width its scrollbar takes, so that its
// lines break where the text area's do.
function follow(textArea: HTMLTextAreaElement, mirror: HTMLDivElement): void {
  const borders = textArea.offsetWidth - textArea.clientWidth;
  const sideBorders = textArea.clientLeft * 2;
  mirror.style.right = `${Math.max(borders - sideBorders, 0)}px`;
  mirror.scrollTop = textArea.scrollTop;
}

function followWhileAttached(textArea: HTMLTextAreaElement, mirror: HTMLDivElement): () => void {
  const onChange = () => follow(textArea, mirror);
  onChange();
  textArea.addEventListener('scroll', onChange);
  textArea.addEventListener('input', onChange);
  const observer = new ResizeObserver(onChange);
  observer.observe(textArea);
  return () => {
    textArea.removeEventListener('scroll', onChange);
    textArea.removeEventListener('input', onChange);
    observer.disconnect();
  };
}

function assign<Element>(ref: Ref<Element> | undefined, element: Element | null): void {
  if (typeof ref === 'function') {
    ref(element);
    return;
  }
  if (ref !== null && ref !== undefined) {
    ref.current = element;
  }
}

/** Keeps the layer that paints the passages under the text area's own lines, as it scrolls. */
export function useMirror(forwardedRef: Ref<HTMLTextAreaElement> | undefined): Mirror {
  const textArea = useRef<HTMLTextAreaElement | null>(null);
  const mirror = useRef<HTMLDivElement | null>(null);
  const stop = useRef<(() => void) | null>(null);

  const restart = useCallback(() => {
    stop.current?.();
    stop.current =
      textArea.current !== null && mirror.current !== null
        ? followWhileAttached(textArea.current, mirror.current)
        : null;
  }, []);

  useLayoutEffect(() => {
    if (textArea.current !== null && mirror.current !== null) {
      follow(textArea.current, mirror.current);
    }
  });

  const textAreaRef = useCallback(
    (element: HTMLTextAreaElement | null) => {
      textArea.current = element;
      assign(forwardedRef, element);
      restart();
    },
    [forwardedRef, restart],
  );
  const mirrorRef = useCallback(
    (element: HTMLDivElement | null) => {
      mirror.current = element;
      restart();
    },
    [restart],
  );
  return { textAreaRef, mirrorRef };
}
