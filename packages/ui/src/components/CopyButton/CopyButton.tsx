import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import type { RefObject } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { CopyOutcome, useCopy } from '../CopyList/use-copy.ts';
import { IconButton, IconButtonSize } from '../IconButton/IconButton.tsx';

export interface CopyButtonProps {
  /** The text copied. */
  readonly text: string;
  /** What the button does, read by screen readers: "Copy the email address". */
  readonly label: string;
  /** Shown beside the icon for a moment once copied, and announced: `copyButton.copied` by default. */
  readonly copiedLabel?: string;
  /** Announced when the browser refuses the clipboard: `copyButton.failed` by default. */
  readonly failedLabel?: string;
  /** The value shown: selected, for the reader to copy it by hand, when the browser refuses. */
  readonly valueRef?: RefObject<HTMLElement | null>;
  readonly className?: string;
}

/**
 * Copies a value from within a line of text, after it: a compact icon, which becomes a Delft check
 * with the copied word beside it for a moment. Where the browser refuses the clipboard, the value
 * given by `valueRef` is selected, and the failure announced.
 */
export function CopyButton({
  text,
  label,
  copiedLabel,
  failedLabel,
  valueRef,
  className,
}: CopyButtonProps) {
  const messages = useMessages();
  const { result, copy } = useCopy({ text, valueRef });
  const isCopied = result?.outcome === CopyOutcome.copied;
  return (
    <span className={classNames('inline-flex items-center align-middle', className)}>
      <IconButton
        size={IconButtonSize.compact}
        icon={isCopied ? CheckIcon : CopyIcon}
        label={label}
        onClick={copy}
        data-copied={isCopied ? '' : undefined}
        className="data-copied:text-delft"
      />
      <span role="status" className="text-small text-delft">
        {result !== null && (
          <span key={result.count} className={isCopied ? 'ml-space-1' : 'sr-only'}>
            {isCopied
              ? (copiedLabel ?? messages['copyButton.copied'])
              : (failedLabel ?? messages['copyButton.failed'])}
          </span>
        )}
      </span>
    </span>
  );
}
