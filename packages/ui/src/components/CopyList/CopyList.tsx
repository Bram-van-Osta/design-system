import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { CopyListRow } from './CopyListRow.tsx';
import type { CopyListItem } from './copy-list.ts';

export interface CopyListProps {
  readonly items: readonly CopyListItem[];
  /** The button's text, read with the item's label, "Copy IBAN": `copyList.copy` by default. */
  readonly copyLabel?: string;
  /** The button's text for a moment once copied, also announced: `copyList.copied` by default. */
  readonly copiedLabel?: string;
  /** Announced when the browser refuses the clipboard: `copyList.failed` by default. */
  readonly failedLabel?: string;
  readonly className?: string;
}

/**
 * Values to copy one by one, such as bank details: each row shows its label, its value in IBM Plex
 * Mono and a button that copies it. Where the browser refuses the clipboard, the value shown is
 * selected, for the reader to copy it by hand.
 */
export function CopyList({ items, copyLabel, copiedLabel, failedLabel, className }: CopyListProps) {
  const messages = useMessages();
  const texts = {
    copy: copyLabel ?? messages['copyList.copy'],
    copied: copiedLabel ?? messages['copyList.copied'],
    failed: failedLabel ?? messages['copyList.failed'],
  };
  return (
    <ul className={classNames('flex flex-col', className)}>
      {items.map((item) => (
        <CopyListRow key={item.id} item={item} texts={texts} />
      ))}
    </ul>
  );
}
