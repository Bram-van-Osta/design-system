import type { ReactNode } from 'react';
import { hasContent } from '../../utils/has-content.ts';
import { STAT_LABEL_CLASSES, STAT_NOTE_CLASSES, statFigureClassesOf } from './stat-classes.ts';
import type { StatLayout } from './stat-layout.ts';
import type { StatTone } from './stat-tone.ts';

export const StatSemantics = {
  /** In a description list: the label is its term, the figure and the note its descriptions. */
  description: 'description',
  /** Inside a link or a button, whose name they make. */
  inline: 'inline',
} as const;
export type StatSemantics = (typeof StatSemantics)[keyof typeof StatSemantics];

const TAGS: Readonly<
  Record<StatSemantics, { readonly term: 'dt' | 'span'; readonly detail: 'dd' | 'span' }>
> = {
  description: { term: 'dt', detail: 'dd' },
  inline: { term: 'span', detail: 'span' },
};

interface StatPartsProps {
  readonly label: ReactNode;
  readonly value: ReactNode;
  readonly note: ReactNode;
  readonly mark: ReactNode;
  readonly tone: StatTone;
  readonly layout: StatLayout;
  readonly semantics: StatSemantics;
}

/**
 * A tile's label, its figure and its note, shared by `Stat` and `StatLink`. The spaces between them,
 * which the tile's layout drops, part their words in a link's name. A titled tile may go without
 * its figure.
 */
export function StatParts({ label, value, note, mark, tone, layout, semantics }: StatPartsProps) {
  const { term: Term, detail: Detail } = TAGS[semantics];
  return (
    <>
      <Term className={STAT_LABEL_CLASSES[layout]}>
        {mark}
        {label}
      </Term>
      {hasContent(value) && (
        <>
          {' '}
          <Detail className={statFigureClassesOf(layout, tone)}>{value}</Detail>
        </>
      )}
      {hasContent(note) && (
        <>
          {' '}
          <Detail className={STAT_NOTE_CLASSES}>{note}</Detail>
        </>
      )}
    </>
  );
}
