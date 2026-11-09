import { describe, expect, it } from 'vitest';
import { passageRangesOf, segmentsOf, type TextPassage } from './passage-ranges.ts';

const TEXT =
  'We run a bakery by the harbor. Our site is ten years old, and I cannot change anything myself.';
const ACTIVITY: TextPassage = { id: 'activity', words: 'a bakery' };
const SITUATION: TextPassage = { id: 'situation', words: 'our site is ten years old' };

function textsOf(text: string, passages: readonly TextPassage[]): readonly string[] {
  return passageRangesOf(text, passages).map((range) => text.slice(range.start, range.end));
}

describe('passageRangesOf', () => {
  it('should find each passage by its words, in the text as it is written', () => {
    expect(textsOf(TEXT, [SITUATION, ACTIVITY])).toEqual(['a bakery', 'Our site is ten years old']);
  });

  it('should keep a passage while the text around it changes', () => {
    const before = passageRangesOf(TEXT, [ACTIVITY]);
    const edited = `Hello! ${TEXT.replace('by the harbor', 'on the quay')}`;
    const after = passageRangesOf(edited, [ACTIVITY]);
    expect(after).toHaveLength(1);
    expect(after[0]?.start).toBe((before[0]?.start ?? 0) + 'Hello! '.length);
    expect(textsOf(edited, [ACTIVITY])).toEqual(['a bakery']);
  });

  it('should drop a passage once its words are gone', () => {
    const edited = TEXT.replace('a bakery', 'a bake shop');
    expect(passageRangesOf(edited, [ACTIVITY, SITUATION]).map((range) => range.id)).toEqual([
      'situation',
    ]);
  });

  it('should find words across other spaces, a line break and another case', () => {
    const text = 'Our  site\nis TEN years old.';
    expect(textsOf(text, [SITUATION])).toEqual(['Our  site\nis TEN years old']);
  });

  it('should give two passages of the same words their own places, never one over the other', () => {
    const text = 'Order bread. Order cakes.';
    const passages = [
      { id: 'first', words: 'order' },
      { id: 'second', words: 'order' },
      { id: 'over', words: 'order bread' },
    ];
    expect(passageRangesOf(text, passages)).toEqual([
      { id: 'first', start: 0, end: 5 },
      { id: 'second', start: 13, end: 18 },
    ]);
  });

  it('should find nothing for empty words', () => {
    expect(passageRangesOf(TEXT, [{ id: 'empty', words: '  ' }])).toEqual([]);
  });
});

describe('segmentsOf', () => {
  it('should cut the text at its passages, each passage keyed by its id', () => {
    const text = 'We run a bakery by the harbor.';
    expect(segmentsOf(text, passageRangesOf(text, [ACTIVITY]))).toEqual([
      { key: 'before-activity', text: 'We run ', passageId: null },
      { key: 'activity', text: 'a bakery', passageId: 'activity' },
      { key: 'text-end', text: ' by the harbor.', passageId: null },
    ]);
  });

  it('should give the text alone without a passage', () => {
    expect(segmentsOf('Hello', [])).toEqual([{ key: 'text-end', text: 'Hello', passageId: null }]);
  });
});
