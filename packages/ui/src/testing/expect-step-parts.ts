import { expect, within } from 'storybook/test';
import {
  STEP_PART_STATE_MESSAGES,
  StepPartState,
  type StepProgressPart,
  StepProgressTone,
} from '../components/StepProgress/step-parts.ts';
import { Locale, MESSAGES } from '../i18n/messages.ts';
import { isOnAComputer } from './is-on-a-computer.ts';
import { type ColorToken, tokenColor } from './token-color.ts';
import { tokenPixels } from './token-pixels.ts';

// What rounding the fractions of the grid to device pixels may leave.
const LAYOUT_TOLERANCE = 0.5;
const MEDIUM_WEIGHT = '500';
const REGULAR_WEIGHT = '400';

const STATE_COLORS: Readonly<Record<StepPartState, ColorToken>> = {
  done: 'ink',
  current: 'vermillion',
  upcoming: 'ink-muted',
};

const SEGMENT_COLORS: Readonly<
  Record<StepProgressTone, Readonly<Record<StepPartState, ColorToken>>>
> = {
  delft: { done: 'delft', current: 'delft', upcoming: 'line' },
  ink: { done: 'ink', current: 'vermillion', upcoming: 'line' },
};

interface SegmentFilling {
  readonly filledCount: number;
  readonly tone?: StepProgressTone;
}

function segmentColorOf(index: number, { filledCount, tone }: SegmentFilling): ColorToken {
  const colors = SEGMENT_COLORS[tone ?? StepProgressTone.delft];
  if (index + 1 < filledCount) {
    return colors.done;
  }
  return index + 1 === filledCount ? colors.current : colors.upcoming;
}

/**
 * The segments in order, filled up to the step the person is on: in Delft blue, or with the `ink`
 * tone, done in ink and the current one in vermilion; the next ones in the line color.
 */
export async function expectSegmentColors(
  segments: readonly Element[],
  filling: SegmentFilling,
): Promise<void> {
  for (const [index, segment] of segments.entries()) {
    const color = tokenColor(segmentColorOf(index, filling), segment);
    await expect(getComputedStyle(segment).backgroundColor).toBe(color);
  }
}

async function expectGaps(elements: readonly Element[], gap: number): Promise<void> {
  for (const [index, next] of elements.entries()) {
    const previous = elements[index - 1];
    if (previous !== undefined) {
      const between = next.getBoundingClientRect().left - previous.getBoundingClientRect().right;
      await expect(Math.abs(between - gap)).toBeLessThanOrEqual(LAYOUT_TOLERANCE);
    }
  }
}

/**
 * The segments in one group per part, 4 px apart within a part and 12 px between two parts, each
 * group as wide as its steps, filled in their tone up to the step the person is on.
 */
export async function expectGroupedSegments(
  bar: HTMLElement,
  { parts, ...filling }: SegmentFilling & { readonly parts: readonly StepProgressPart[] },
): Promise<void> {
  const groups = [...bar.children];
  await expect(groups.map((group) => group.childElementCount)).toEqual(
    parts.map((part) => part.steps),
  );
  await expectSegmentColors(
    groups.flatMap((group) => [...group.children]),
    filling,
  );
  await expectGaps(groups, tokenPixels('space-3'));
  for (const group of groups) {
    await expectGaps([...group.children], tokenPixels('space-1'));
  }
}

function textOf(item: HTMLElement, text: string): HTMLElement {
  return within(item).getByText(text, { exact: true });
}

async function expectState(
  item: HTMLElement,
  { state, locale }: { readonly state: StepPartState; readonly locale: unknown },
) {
  const style = getComputedStyle(item);
  await expect(style.color).toBe(tokenColor(STATE_COLORS[state], item));
  await expect(style.fontWeight).toBe(
    state === StepPartState.current ? MEDIUM_WEIGHT : REGULAR_WEIGHT,
  );
  await expect(item.querySelector('svg') !== null).toBe(state === StepPartState.done);
  const messages = MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en];
  await expect(item).toHaveTextContent(
    new RegExp(` ${messages[STEP_PART_STATE_MESSAGES[state]]}$`),
  );
}

async function expectNames(
  item: HTMLElement,
  { part, isComputer }: { readonly part: StepProgressPart; readonly isComputer: boolean },
) {
  const [shown, hidden] = isComputer
    ? [part.label, part.shortLabel]
    : [part.shortLabel, part.label];
  await expect(textOf(item, shown)).toBeVisible();
  await expect(textOf(item, hidden)).not.toBeVisible();
}

// On a phone, a muted dot before every name but the first, read by no screen reader.
async function expectSeparator(
  item: HTMLElement,
  { isFirst, isComputer }: { readonly isFirst: boolean; readonly isComputer: boolean },
) {
  const dot = item.querySelector('[aria-hidden="true"]:not(svg)');
  if (isFirst || isComputer) {
    await expect(dot === null || !dot.checkVisibility()).toBe(true);
    return;
  }
  await expect(dot?.checkVisibility()).toBe(true);
  await expect(dot && getComputedStyle(dot).color).toBe(tokenColor('ink-muted', item));
}

/**
 * The parts' names in a list after the bar, in IBM Plex Mono at the meta size, each with its state
 * in color and in words: from md up its full name under its group, on a phone its short name.
 */
export async function expectPartNames(
  bar: HTMLElement,
  {
    parts,
    states,
    locale,
  }: {
    readonly parts: readonly StepProgressPart[];
    readonly states: readonly StepPartState[];
    readonly locale: unknown;
  },
): Promise<void> {
  const list = bar.nextElementSibling;
  await expect(list?.tagName).toBe('OL');
  if (!(list instanceof HTMLElement)) {
    return;
  }
  const items = within(list).getAllByRole('listitem');
  await expect(items).toHaveLength(parts.length);
  const isComputer = isOnAComputer();
  const groups = [...bar.children];
  for (const [index, item] of items.entries()) {
    const part = parts[index];
    const state = states[index];
    await expect(part !== undefined && state !== undefined).toBe(true);
    if (part === undefined || state === undefined) {
      return;
    }
    const style = getComputedStyle(item);
    await expect(style.fontFamily).toContain('IBM Plex Mono');
    await expect(style.fontSize).toBe(style.getPropertyValue('--text-meta').trim());
    await expectState(item, { state, locale });
    await expectNames(item, { part, isComputer });
    await expectSeparator(item, { isFirst: index === 0, isComputer });
  }
  await (isComputer ? expectUnderGroups(items, groups) : expectOnOneLine(items));
}

// From md up, each name starts where its group starts.
async function expectUnderGroups(items: readonly HTMLElement[], groups: readonly Element[]) {
  for (const [index, item] of items.entries()) {
    const groupLeft = groups[index]?.getBoundingClientRect().left;
    const offset = item.getBoundingClientRect().left - (groupLeft ?? Number.NaN);
    await expect(Math.abs(offset)).toBeLessThanOrEqual(LAYOUT_TOLERANCE);
  }
}

// On a phone, the names follow one another on a line, which wraps when they run out of room.
async function expectOnOneLine(items: readonly HTMLElement[]) {
  const [first, second] = items;
  await expect(second?.getBoundingClientRect().top).toBe(first?.getBoundingClientRect().top);
  await expect(second?.getBoundingClientRect().left).toBeGreaterThan(
    first?.getBoundingClientRect().right ?? Number.POSITIVE_INFINITY,
  );
}
