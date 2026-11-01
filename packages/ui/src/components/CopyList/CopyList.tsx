import { classNames } from '../../utils/class-names.ts';
import { CopyListRow } from './CopyListRow.tsx';
import type { CopyListItem } from './copy-list.ts';

export interface CopyListProps {
  readonly items: readonly CopyListItem[];
  /** The button's text, read with the item's label: "Copy" makes "Copy IBAN". */
  readonly copyLabel: string;
  /** The button's text for a moment once the value is copied, also said by screen readers. */
  readonly copiedLabel: string;
  readonly className?: string;
}

/**
 * Values to copy one by one, such as bank details: each row shows its label, its value in IBM Plex
 * Mono and a button that copies it. Where the browser refuses the clipboard, the value is selected.
 */
export function CopyList({ items, copyLabel, copiedLabel, className }: CopyListProps) {
  return (
    <ul className={classNames('flex flex-col', className)}>
      {items.map((item) => (
        <CopyListRow key={item.id} item={item} copyLabel={copyLabel} copiedLabel={copiedLabel} />
      ))}
    </ul>
  );
}
