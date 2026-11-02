import { useSyncExternalStore } from 'react';

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function isReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function isReducedMotionOnTheServer(): boolean {
  return false;
}

/** Whether the system asks for less motion, kept up to date when the setting changes. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, isReducedMotion, isReducedMotionOnTheServer);
}
