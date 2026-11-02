// Tailwind's md breakpoint, from which the components take their computer's layout.
const COMPUTER_QUERY = '(min-width: 48rem)';

/** Whether the page is as wide as a computer's, from Tailwind's md breakpoint. */
export function isOnAComputer(): boolean {
  return window.matchMedia(COMPUTER_QUERY).matches;
}
