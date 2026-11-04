import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';

export interface ThumbnailTileFrameProps {
  /** The file's name, under the box, in ink. */
  readonly fileName: string;
  /** Its id, when the box is named by it. */
  readonly fileNameId?: string;
  /** A line under the name, in Delft blue: "kept for the site". */
  readonly note?: ReactNode;
  readonly className?: string;
  /** The box, which each tile draws. */
  readonly children: ReactNode;
}

/** A grid's item: the box, then its caption outside the control, so that it never renames it. */
export function ThumbnailTileFrame({
  fileName,
  fileNameId,
  note,
  className,
  children,
}: ThumbnailTileFrameProps) {
  return (
    <li className={classNames('flex min-w-0 flex-col gap-space-2', className)}>
      {children}
      <span className="flex flex-col font-mono text-meta">
        <span id={fileNameId} className="text-ink wrap-anywhere">
          {fileName}
        </span>
        {hasContent(note) && <span className="text-delft">{note}</span>}
      </span>
    </li>
  );
}
