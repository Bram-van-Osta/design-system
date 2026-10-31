import { type ReactNode, useId, useRef } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { useIsOverflowing } from './use-is-overflowing.ts';

export interface TableColumn {
  /** Unique among the table's columns. */
  readonly id: string;
  readonly label: ReactNode;
}

export interface TableRow {
  /** Unique among the table's rows. */
  readonly id: string;
  /** The row's cells, in the columns' order. */
  readonly cells: readonly ReactNode[];
}

export interface TableProps {
  /** What the table holds, read by screen readers: on screen, the heading above it says it. */
  readonly caption: ReactNode;
  readonly columns: readonly TableColumn[];
  readonly rows: readonly TableRow[];
}

const CELL_CLASSES = 'pr-space-4 text-left last:pr-0';

// Only a box that scrolls is a stop for the keyboard, named by the caption.
function scrollBoxProps(isOverflowing: boolean, captionId: string) {
  return isOverflowing ? { tabIndex: 0, role: 'region', 'aria-labelledby': captionId } : {};
}

/**
 * Facts side by side, such as a legal text's processors or retention periods. A table wider than
 * the screen scrolls sideways in its own box, never the page.
 */
export function Table({ caption, columns, rows }: TableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useIsOverflowing(scrollRef);
  const captionId = useId();
  return (
    <div ref={scrollRef} className="overflow-x-auto" {...scrollBoxProps(isOverflowing, captionId)}>
      <table className="w-full border-collapse text-body text-ink">
        <caption id={captionId} className="sr-only">
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={classNames(
                  CELL_CLASSES,
                  'border-b-hair border-ink pb-space-3 align-bottom font-mono font-normal text-ink-muted text-kicker',
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column, index) => (
                <td
                  key={column.id}
                  className={classNames(
                    CELL_CLASSES,
                    'border-b-hair border-line py-space-3 align-top',
                  )}
                >
                  {row.cells[index]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
