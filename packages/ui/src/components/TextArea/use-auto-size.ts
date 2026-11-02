import { type Ref, type RefCallback, useCallback, useLayoutEffect, useRef } from 'react';

// Past this share of the screen's height the text scrolls inside the field, so that on a phone the
// field's label above it and the form's commands below it stay within reach.
export const MAX_HEIGHT_SHARE_OF_VIEWPORT = 0.6;

/** As tall as its text, from its `rows` up to the bound, past which it scrolls. */
function fitToContent(textArea: HTMLTextAreaElement): void {
  textArea.style.height = 'auto';
  const borders = textArea.offsetHeight - textArea.clientHeight;
  const contentHeight = textArea.scrollHeight + borders;
  const maxHeight = window.innerHeight * MAX_HEIGHT_SHARE_OF_VIEWPORT;
  textArea.style.height = `${Math.min(contentHeight, maxHeight)}px`;
  textArea.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
}

// A form library sets the value of an uncontrolled field without an event (a reset): the value's
// setter, on the element itself, refits it, then hands over to the one it replaces (React's own).
function onValueSet(textArea: HTMLTextAreaElement, fit: () => void): () => void {
  const own = Object.getOwnPropertyDescriptor(textArea, 'value');
  const replaced = own ?? Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
  const { get, set } = replaced ?? {};
  if (get === undefined || set === undefined) {
    return () => {};
  }
  Object.defineProperty(textArea, 'value', {
    configurable: true,
    get: () => get.call(textArea),
    set: (value: string) => {
      set.call(textArea, value);
      fit();
    },
  });
  return () => {
    if (own === undefined) {
      Reflect.deleteProperty(textArea, 'value');
      return;
    }
    Object.defineProperty(textArea, 'value', own);
  };
}

// Refitted on the next frame: a height set inside the observer's callback would loop it.
function onWidthChange(textArea: HTMLTextAreaElement, fit: () => void): () => void {
  let width = textArea.clientWidth;
  const observer = new ResizeObserver(() => {
    if (textArea.clientWidth !== width) {
      width = textArea.clientWidth;
      requestAnimationFrame(fit);
    }
  });
  observer.observe(textArea);
  return () => observer.disconnect();
}

function fitWhileAttached(textArea: HTMLTextAreaElement): () => void {
  const fit = () => fitToContent(textArea);
  fit();
  document.fonts.ready.then(fit, () => {});
  textArea.addEventListener('input', fit);
  window.addEventListener('resize', fit);
  const stopValueSet = onValueSet(textArea, fit);
  const stopWidthChange = onWidthChange(textArea, fit);
  return () => {
    textArea.removeEventListener('input', fit);
    window.removeEventListener('resize', fit);
    stopValueSet();
    stopWidthChange();
  };
}

function attach<Element>(ref: Ref<Element> | undefined, element: Element): () => void {
  if (typeof ref === 'function') {
    const cleanup = ref(element);
    return typeof cleanup === 'function' ? cleanup : () => ref(null);
  }
  if (ref !== null && ref !== undefined) {
    ref.current = element;
    return () => {
      ref.current = null;
    };
  }
  return () => {};
}

/**
 * Fits a text area to its text: at its first value, as its reader types, and when the value changes
 * from outside, a controlled value or a form's reset. The app's own ref still receives the element.
 */
export function useAutoSize(
  forwardedRef: Ref<HTMLTextAreaElement> | undefined,
): RefCallback<HTMLTextAreaElement> {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (textAreaRef.current !== null) {
      fitToContent(textAreaRef.current);
    }
  });

  return useCallback(
    (textArea: HTMLTextAreaElement) => {
      textAreaRef.current = textArea;
      const detach = attach(forwardedRef, textArea);
      const stopFitting = fitWhileAttached(textArea);
      return () => {
        textAreaRef.current = null;
        stopFitting();
        detach();
      };
    },
    [forwardedRef],
  );
}
