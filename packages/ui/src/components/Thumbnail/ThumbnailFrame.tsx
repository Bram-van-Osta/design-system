import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';

export interface ThumbnailFrameProps {
  /** In CSS pixels: the box's width, which the caption wraps within. */
  readonly width: number;
  readonly caption?: ReactNode;
  readonly className?: string;
  /** The box, which each state draws. */
  readonly children: ReactNode;
}

/** A thumbnail's box with its caption under it, outside the control so that it never renames it. */
export function ThumbnailFrame({ width, caption, className, children }: ThumbnailFrameProps) {
  return (
    <div
      className={classNames('inline-flex flex-col gap-space-2 align-top', className)}
      style={{ width }}
    >
      {children}
      {hasContent(caption) && <span className="font-mono text-meta text-ink-muted">{caption}</span>}
    </div>
  );
}
