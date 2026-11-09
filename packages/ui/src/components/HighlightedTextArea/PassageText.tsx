import { useMemo } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { passageRangesOf, segmentsOf, type TextPassage } from './passage-ranges.ts';

// A found passage fades in its tint, then draws its underline; hovered or focused through its
// point, its tint darkens. The text itself stays the field's: here it may be transparent.
const PASSAGE_CLASSES =
  'bg-highlight text-inherit passage-underline motion-safe:transition-colors motion-safe:duration-150 data-emphasized:bg-highlight-strong';
const ARRIVAL_CLASSES = 'motion-safe:animate-passage';

interface PassageTextProps {
  readonly text: string;
  readonly passages: readonly TextPassage[];
  /** The passage whose point is hovered or focused, in the strong tint. */
  readonly emphasizedId?: string | null;
  /** Whether a passage tints, then underlines itself as it appears: as a reading comes back. */
  readonly isArrivalShown: boolean;
}

/** The text with its passages marked, each one found by its words. */
export function PassageText({
  text,
  passages,
  emphasizedId = null,
  isArrivalShown,
}: PassageTextProps) {
  const segments = useMemo(
    () => segmentsOf(text, passageRangesOf(text, passages)),
    [text, passages],
  );
  return segments.map((segment) =>
    segment.passageId === null ? (
      <span key={segment.key}>{segment.text}</span>
    ) : (
      <mark
        key={segment.key}
        data-passage={segment.passageId}
        data-emphasized={segment.passageId === emphasizedId || undefined}
        className={classNames(PASSAGE_CLASSES, isArrivalShown && ARRIVAL_CLASSES)}
      >
        {segment.text}
      </mark>
    ),
  );
}
