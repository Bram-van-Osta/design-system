import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';

export interface ThreadProps {
  /** The list's name for screen readers, when the part's label above does not name it. */
  readonly label?: string;
  /** The button above the list for what came earlier, in the app's words: "6 earlier events". */
  readonly earlierLabel?: ReactNode;
  /** Shows what came earlier; the button is there only with it and its label. */
  readonly onShowEarlier?: () => void;
  /** What came earlier is on its way: the button keeps its place and shows a spinner. */
  readonly isEarlierPending?: boolean;
  /** Its days and its lines, oldest first: `ThreadDay` and `ThreadLine`. */
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * A journey's events in order, oldest first: each day a separator, each event a line that unfolds
 * in place or stays still; above them, a button for what came earlier.
 */
export function Thread({
  label,
  earlierLabel,
  onShowEarlier,
  isEarlierPending = false,
  children,
  className,
}: ThreadProps) {
  return (
    <div className={classNames('flex flex-col items-start gap-space-2', className)}>
      {hasContent(earlierLabel) && onShowEarlier !== undefined && (
        <Button variant={ButtonVariant.quiet} isPending={isEarlierPending} onClick={onShowEarlier}>
          {earlierLabel}
        </Button>
      )}
      <ol aria-label={label} className="w-full border-line border-t-hair">
        {children}
      </ol>
    </div>
  );
}
