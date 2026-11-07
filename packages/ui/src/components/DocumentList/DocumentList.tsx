import { useRender } from '@base-ui/react/use-render';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';

interface DocumentCommon {
  /** Stable across renders: the document's code. */
  readonly id: string;
  /** Its name: "The pre-analysis". */
  readonly name: ReactNode;
  /**
   * Where it stands, in mono on the right: "handed in at 9:14", "after your decision". Too long to
   * sit beside the name, it wraps under it.
   */
  readonly meta?: ReactNode;
}

/** A document to open: `href`, or `render` for the router's link. */
export interface DocumentListLink extends DocumentCommon {
  readonly isLater?: false;
  readonly href?: string;
  /** The router's link: `render={<RouterLink to="/cases/42/offer" />}`. */
  readonly render?: useRender.ComponentProps<'a'>['render'];
}

/** A document yet to come: in grey, not a link, its meta saying when. */
export interface DocumentListLater extends DocumentCommon {
  readonly isLater: true;
}

export type DocumentListItem = DocumentListLink | DocumentListLater;

export interface DocumentListProps {
  /** The documents, in order, those yet to come among them. */
  readonly documents: readonly DocumentListItem[];
  /** The list's name for screen readers, when the part's label above does not name it. */
  readonly label?: string;
  readonly className?: string;
}

// A meta too long to sit beside the name wraps under it, at the row's start, rather than overflow.
const ROW_CLASSES =
  'flex min-h-13 flex-wrap content-center items-center justify-between gap-x-space-3 gap-y-space-1 py-space-2';
const META_CLASSES = 'min-w-0 font-mono text-meta text-ink-muted';

/**
 * A journey's documents, one a row, a line between two: each a link, its name and where it stands
 * on the right, or under the name when it is too long; a document yet to come in grey, neither a
 * link nor focusable.
 */
export function DocumentList({ documents, label, className }: DocumentListProps) {
  return (
    <ul aria-label={label} className={classNames('border-line border-b-hair', className)}>
      {documents.map((document) => (
        <li key={document.id} className="border-line border-t-hair">
          {document.isLater === true ? (
            <LaterRow document={document} />
          ) : (
            <LinkRow document={document} />
          )}
        </li>
      ))}
    </ul>
  );
}

function Meta({ children }: { readonly children: ReactNode }) {
  return hasContent(children) ? <span className={META_CLASSES}>{children}</span> : null;
}

function LinkRow({
  document: { name, meta, href, render },
}: {
  readonly document: DocumentListLink;
}) {
  return useRender({
    defaultTagName: 'a',
    render,
    props: {
      href,
      className: classNames(ROW_CLASSES, 'group text-ink'),
      children: (
        <>
          <span className="min-w-0 font-semibold text-body-s underline-offset-4 group-hover:underline">
            {name}
          </span>{' '}
          <Meta>{meta}</Meta>
        </>
      ),
    },
  });
}

function LaterRow({ document: { name, meta } }: { readonly document: DocumentListLater }) {
  return (
    <div data-later className={classNames(ROW_CLASSES, 'text-body-s text-ink-muted')}>
      <span className="min-w-0">{name}</span> <Meta>{meta}</Meta>
    </div>
  );
}
