import type { ReactNode } from 'react';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';

export interface DisclosurePartPreviewProps {
  readonly mark?: ReactNode;
  readonly children: ReactNode;
}

// The line is part of the button and of its name, read after the label, as long as the part is
// folded: unfolded, it is gone from the page and from the name.
/** A folded part's line under its label, in small body text, its mark on its first line. */
export function DisclosurePartPreview({ mark, children }: DisclosurePartPreviewProps) {
  return (
    <span
      data-part-preview=""
      className="flex items-start gap-space-2 pb-space-1 text-small font-normal normal-case tracking-normal group-data-panel-open:hidden"
    >
      {mark !== undefined && <span className={FIRST_LINE_SLOT_CLASSES}>{mark}</span>}
      <span className="min-w-0">{children}</span>
    </span>
  );
}
