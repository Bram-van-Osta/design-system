import type { TextPassage } from '../components/HighlightedTextArea/passage-ranges.ts';
import type { NotedPoint } from '../components/PointColumn/noted-point.ts';

// T12-M1-Ecrire-D: the Boulangerie du Port's words, and what three readings noted of them.

export const WORDS = [
  'We run a bakery and pastry shop by the harbor. Our site is ten years old: it shows badly on phones, and I cannot change anything myself.',
  '',
  'I would like customers to find our opening hours right away, and to order their Yule logs for the holidays without calling us. Ideally before December.',
].join('\n');

export const WORDS_LABEL = 'Your project, in your words';
export const WORDS_HELP = 'Saved as you go, and deleted after seven days if you send nothing.';

export const PASSAGES: readonly TextPassage[] = [
  { id: 'activity', words: 'a bakery and pastry shop' },
  { id: 'situation', words: 'our site is ten years old' },
  { id: 'decides', words: 'I cannot change anything myself' },
  { id: 'customers', words: 'find our opening hours right away' },
  { id: 'when', words: 'before December' },
];

interface PointWords {
  readonly id: string;
  readonly label: string;
  readonly example: string;
  readonly value: string | null;
}

const POINT_WORDS: readonly PointWords[] = [
  {
    id: 'activity',
    label: 'Your activity',
    example: 'E.g. a bakery, a plumber, a cottage',
    value: '"a bakery and pastry shop"',
  },
  {
    id: 'situation',
    label: 'Your situation',
    example: 'E.g. a site to modernize, no site yet',
    value: 'I have a site to modernize',
  },
  {
    id: 'decides',
    label: 'What makes you decide',
    example: 'E.g. people find me badly on Google',
    value: 'I cannot edit it myself',
  },
  {
    id: 'customers',
    label: 'Your customers must be able to',
    example: 'E.g. book, order, call you',
    value: 'Find your hours and come',
  },
  { id: 'when', label: 'By when', example: 'E.g. before summer', value: '"before December"' },
  { id: 'business', label: 'Your business', example: 'E.g. the Boulangerie du Port', value: null },
  { id: 'site', label: 'Your current site', example: 'E.g. example.com', value: null },
];

/** The seven points, those whose ids are given noted, each with its cross. */
export function pointsNoted(notedIds: readonly string[]): readonly NotedPoint[] {
  return POINT_WORDS.map((point) => ({
    id: point.id,
    label: point.label,
    example: point.example,
    value: notedIds.includes(point.id) ? point.value : null,
    removeLabel: `Remove: ${point.label.toLowerCase()}`,
  }));
}

export const FIRST_READING = ['activity', 'situation', 'decides'] as const;
export const POINT_COUNT = POINT_WORDS.length;
