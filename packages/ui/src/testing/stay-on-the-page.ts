import type { MouseEvent } from 'react';

/** A link's story stays on its page: the test checks where the link leads, not the leaving. */
export function stayOnThePage(event: MouseEvent): void {
  event.preventDefault();
}
