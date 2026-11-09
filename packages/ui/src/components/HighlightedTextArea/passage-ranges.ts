/** A passage of the reader's text, given by its words: found again wherever they still stand. */
export interface TextPassage {
  /** What the passage stands for: the point it comes from, which emphasizes it. */
  readonly id: string;
  /** Its words, compared with the text without regard to case or to the spaces between them. */
  readonly words: string;
}

/** Where a passage was found in the text, from its first character to the one after its last. */
export interface PassageRange {
  readonly id: string;
  readonly start: number;
  readonly end: number;
}

/** A run of the text, inside a passage or between two. */
export interface TextSegment {
  /** Stable while the text around it changes: the passage's id, or the passage it comes before. */
  readonly key: string;
  readonly text: string;
  readonly passageId: string | null;
}

const WHITESPACE = /\s/;
const TEXT_END_KEY = 'text-end';

interface NormalizedText {
  readonly text: string;
  /** For each character of the normalized text, where it starts in the original one. */
  readonly origins: readonly number[];
}

// Lowercased, unless lowercasing it would change its length, which would shift every place after it.
function lowered(character: string): string {
  const lower = character.toLowerCase();
  return lower.length === character.length ? lower : character;
}

// One space for a run of spaces and line breaks, every letter in lowercase.
function normalized(text: string): NormalizedText {
  let normal = '';
  const origins: number[] = [];
  for (let offset = 0; offset < text.length; offset += 1) {
    const character = text.charAt(offset);
    const isSpace = WHITESPACE.test(character);
    if (isSpace && (normal === '' || normal.endsWith(' '))) {
      continue;
    }
    normal += isSpace ? ' ' : lowered(character);
    origins.push(offset);
  }
  return { text: normal, origins };
}

function overlaps(range: PassageRange, taken: readonly PassageRange[]): boolean {
  return taken.some((other) => range.start < other.end && other.start < range.end);
}

function findRange(
  passage: TextPassage,
  text: NormalizedText,
  taken: readonly PassageRange[],
): PassageRange | null {
  const words = normalized(passage.words).text.trim();
  if (words === '') {
    return null;
  }
  for (
    let from = text.text.indexOf(words);
    from !== -1;
    from = text.text.indexOf(words, from + 1)
  ) {
    const start = text.origins[from];
    const last = text.origins[from + words.length - 1];
    if (start === undefined || last === undefined) {
      return null;
    }
    const range = { id: passage.id, start, end: last + 1 };
    if (!overlaps(range, taken)) {
      return range;
    }
  }
  return null;
}

/**
 * Where each passage stands in the text, in the text's order: its first place that no earlier
 * passage holds. A passage whose words are no longer in the text has none.
 */
export function passageRangesOf(
  text: string,
  passages: readonly TextPassage[],
): readonly PassageRange[] {
  const normalText = normalized(text);
  const ranges: PassageRange[] = [];
  for (const passage of passages) {
    const range = findRange(passage, normalText, ranges);
    if (range !== null) {
      ranges.push(range);
    }
  }
  return ranges.sort((first, second) => first.start - second.start);
}

/** The text cut at its passages' edges, each run keyed so that a passage keeps its element. */
export function segmentsOf(text: string, ranges: readonly PassageRange[]): readonly TextSegment[] {
  const segments: TextSegment[] = [];
  let at = 0;
  for (const range of ranges) {
    if (range.start > at) {
      segments.push({
        key: `before-${range.id}`,
        text: text.slice(at, range.start),
        passageId: null,
      });
    }
    segments.push({ key: range.id, text: text.slice(range.start, range.end), passageId: range.id });
    at = range.end;
  }
  if (at < text.length) {
    segments.push({ key: TEXT_END_KEY, text: text.slice(at), passageId: null });
  }
  return segments;
}
