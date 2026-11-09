import { classNames } from '../../utils/class-names.ts';
import { PassageText } from '../HighlightedTextArea/PassageText.tsx';
import type { TextPassage } from '../HighlightedTextArea/passage-ranges.ts';

export interface HighlightedQuoteProps {
  /** The reader's text, as they wrote it: its line breaks kept. */
  readonly text: string;
  /** Its passages, by their words, tinted and underlined as in the field. */
  readonly passages: readonly TextPassage[];
  /** The passage whose answer is hovered or focused, in the strong tint. */
  readonly emphasizedId?: string | null;
  readonly className?: string;
}

/**
 * The reader's own words, read only, on the surface, with the passages their answers come from:
 * beside what was understood of them, or folded under a Disclosure above the questions left.
 */
export function HighlightedQuote({
  text,
  passages,
  emphasizedId,
  className,
}: HighlightedQuoteProps) {
  return (
    <blockquote
      className={classNames(
        'm-0 whitespace-pre-wrap wrap-break-word bg-surface p-space-5 text-body text-ink',
        className,
      )}
    >
      <PassageText
        text={text}
        passages={passages}
        emphasizedId={emphasizedId}
        isArrivalShown={false}
      />
    </blockquote>
  );
}
