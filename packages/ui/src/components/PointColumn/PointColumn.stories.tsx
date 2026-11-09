import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { expectBackgroundToBecome } from '../../testing/expect-background.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectAnimationOnlyWhenMotionAllowed } from '../../testing/expect-motion.ts';
import {
  FIRST_READING,
  PASSAGES,
  POINT_COUNT,
  pointsNoted,
  WORDS,
  WORDS_HELP,
  WORDS_LABEL,
} from '../../testing/first-contact-fixture.ts';
import { messagesOf } from '../../testing/messages-of.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Field } from '../Field/Field.tsx';
import { HighlightedTextArea } from '../HighlightedTextArea/HighlightedTextArea.tsx';
import { PointBand } from '../PointBand/PointBand.tsx';
import { PointColumn } from './PointColumn.tsx';

const PHONE = { value: 'mobile1' };
const TITLE = 'What we note';
const DESCRIPTION = 'As you write. What is missing, we will ask you next.';
const MISSING =
  'Next, a few short questions, already filled from your text. Two things will remain: the name of your business and the address of your current site.';
const ANNOUNCEMENT = 'Noted: your activity, your situation, what makes you decide.';
const TARGET = 44;

interface ShowsTheReadingProps {
  readonly notedIds: readonly string[];
  readonly isOnAPhone?: boolean;
}

// The page as the app builds it: the field and its column share the emphasized point, and a
// removed point leaves both.
function ShowsTheReading({ notedIds, isOnAPhone = false }: ShowsTheReadingProps) {
  const [emphasizedId, setEmphasizedId] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<readonly string[]>([]);
  const kept = notedIds.filter((id) => !removedIds.includes(id));
  const passages = PASSAGES.filter((passage) => kept.includes(passage.id));
  const band = (
    <PointBand max={POINT_COUNT} value={kept.length} label={`${kept.length} noted out of 7`} />
  );
  return (
    <div className="flex max-w-page-width flex-col gap-space-7 md:flex-row">
      <div className="min-w-0 max-w-reading-width flex-1">
        <Field label={WORDS_LABEL} description={WORDS_HELP}>
          <HighlightedTextArea
            defaultValue={WORDS}
            passages={passages}
            emphasizedId={emphasizedId}
            footer={isOnAPhone ? band : undefined}
          />
        </Field>
      </div>
      <PointColumn
        className="min-w-0 md:w-aside-width md:shrink-0"
        title={TITLE}
        description={DESCRIPTION}
        points={pointsNoted(kept)}
        onEmphasize={setEmphasizedId}
        onRemove={(id) => setRemovedIds((removed) => [...removed, id])}
      />
    </div>
  );
}

function slotOf(root: HTMLElement, id: string): HTMLElement {
  const slot = root.querySelector(`[data-point="${id}"]`);
  if (!(slot instanceof HTMLElement)) {
    throw new Error(`The column holds the point ${id}.`);
  }
  return slot;
}

function passageOf(root: HTMLElement, id: string): HTMLElement | null {
  const passage = root.querySelector(`[data-passage="${id}"]`);
  return passage instanceof HTMLElement ? passage : null;
}

// T12-M1-Ecrire-D, T12-B2-Lecture-M and T12-C1-Animations-D: seven fixed places beside the text,
// filled as readings come back.
const meta = {
  title: 'Forms/PointColumn',
  component: PointColumn,
  args: {
    title: TITLE,
    description: DESCRIPTION,
    points: pointsNoted([]),
    onRemove: fn(),
    onEmphasize: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-aside-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PointColumn>;

export default meta;
type Story = StoryObj<typeof meta>;

// Before the first reading: each place says what to tell, in grey.
export const Empty: Story = {
  play: async ({ canvas, canvasElement }) => {
    const column = canvas.getByRole('region', { name: TITLE });
    const slots = within(column).getAllByRole('listitem');
    await expect(slots).toHaveLength(POINT_COUNT);
    await expect(canvas.getByText('E.g. a bakery, a plumber, a cottage')).toBeVisible();
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvasElement.querySelector('[data-point-rule]')).toBeNull();
    const example = canvas.getByText('E.g. example.com');
    await expect(getComputedStyle(example).color).toBe(tokenColor('ink-muted', example));
  },
};

// A reading runs: its squares in a wave and its word beside the title.
export const Reading: Story = {
  args: { isReading: true },
  play: async ({ canvas, canvasElement, globals }) => {
    await expect(canvas.getByText(messagesOf(globals.locale)['pointColumn.reading'])).toBeVisible();
    const squares = canvasElement.querySelectorAll('[data-reading-square]');
    await expect(squares).toHaveLength(3);
    for (const square of squares) {
      await expect(getComputedStyle(square).backgroundColor).toBe(tokenColor('delft', square));
      await expect(square.getBoundingClientRect().width).toBe(6);
      await expectAnimationOnlyWhenMotionAllowed(square);
    }
  },
};

// The first reading came back: three points noted, each with its cross, and its announcement.
export const Noted: Story = {
  args: { points: pointsNoted(FIRST_READING), announcement: ANNOUNCEMENT },
  play: async ({ canvas, canvasElement, args }) => {
    const activity = slotOf(canvasElement, 'activity');
    const rule = activity.querySelector('[data-point-rule]');
    if (rule === null) {
      throw new Error('A noted point has its delft rule.');
    }
    await expect(getComputedStyle(rule).backgroundColor).toBe(tokenColor('delft', rule));
    const value = within(activity).getByText('"a bakery and pastry shop"');
    await waitFor(() => expect(value).toBeVisible());
    await expect(canvas.getAllByRole('button', { name: /^Remove: / })).toHaveLength(
      FIRST_READING.length,
    );
    await expect(canvas.getByText(ANNOUNCEMENT)).toHaveAttribute('aria-live', 'polite');

    await userEvent.tab();
    const remove = canvas.getByRole('button', { name: 'Remove: your activity' });
    await expectFocusRing(remove);
    await expect(remove.getBoundingClientRect().height).toBeGreaterThanOrEqual(TARGET);
    await expect(args.onEmphasize).toHaveBeenLastCalledWith('activity');
    await userEvent.tab();
    await expect(args.onEmphasize).toHaveBeenLastCalledWith('situation');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove: what makes you decide' }));
    await expect(args.onRemove).toHaveBeenCalledWith('decides');

    await userEvent.hover(slotOf(canvasElement, 'when'));
    await expect(args.onEmphasize).toHaveBeenLastCalledWith('when');
    await userEvent.unhover(slotOf(canvasElement, 'when'));
    await expect(args.onEmphasize).toHaveBeenLastCalledWith(null);
  },
};

// The text stopped: what will be asked next, in the grey box under the points.
export const Missing: Story = {
  args: { points: pointsNoted([...FIRST_READING, 'customers', 'when']), missing: MISSING },
  play: async ({ canvas }) => {
    const box = canvas.getByText(MISSING);
    await expect(getComputedStyle(box).backgroundColor).toBe(tokenColor('surface', box));
    await expectAnimationOnlyWhenMotionAllowed(box);
  },
};

// With the field: hovering a point or focusing its cross darkens its passage; its cross removes
// both the value and the passage's tint.
export const WithTheField: Story = {
  decorators: [(Story) => <Story />],
  render: () => <ShowsTheReading notedIds={FIRST_READING} />,
  play: async ({ canvas, canvasElement }) => {
    const situation = passageOf(canvasElement, 'situation');
    if (situation === null) {
      throw new Error('The situation is tinted.');
    }
    await userEvent.hover(slotOf(canvasElement, 'situation'));
    await expectBackgroundToBecome(situation, 'highlight-strong');
    await userEvent.unhover(slotOf(canvasElement, 'situation'));
    await expectBackgroundToBecome(situation, 'highlight');

    const remove = canvas.getByRole('button', { name: 'Remove: your situation' });
    remove.focus();
    await expectBackgroundToBecome(situation, 'highlight-strong');
    await userEvent.click(remove);
    await expect(passageOf(canvasElement, 'situation')).toBeNull();
    const slot = slotOf(canvasElement, 'situation');
    await expect(slot.querySelector('[data-point-rule]')).toBeNull();
    await expect(within(slot).getByText('E.g. a site to modernize, no site yet')).toBeVisible();
  },
};

// On a phone, the points under the field, their count stuck to its bottom.
export const OnAPhone: Story = {
  decorators: [(Story) => <Story />],
  globals: { viewport: PHONE },
  render: () => <ShowsTheReading notedIds={FIRST_READING} isOnAPhone />,
  play: async ({ canvas }) => {
    const textArea = canvas.getByRole('textbox', { name: WORDS_LABEL });
    const column = canvas.getByRole('region', { name: TITLE });
    await expect(column.getBoundingClientRect().top).toBeGreaterThan(
      textArea.getBoundingClientRect().bottom,
    );
    await expect(canvas.getByText('3 noted out of 7')).toBeVisible();
  },
};

// Less motion: a noted point's rule and value show at once; the reading's squares stay still.
export const ReducedMotion: Story = {
  args: { points: pointsNoted(FIRST_READING), isReading: true },
  play: async ({ canvasElement }) => {
    const activity = slotOf(canvasElement, 'activity');
    const rule = activity.querySelector('[data-point-rule]');
    const value = activity.querySelector('[data-point-value]');
    if (rule === null || value === null) {
      throw new Error('A noted point has its rule and its value.');
    }
    await expectAnimationOnlyWhenMotionAllowed(rule);
    await expectAnimationOnlyWhenMotionAllowed(value);
    const opacities = [...canvasElement.querySelectorAll('[data-reading-square]')].map(
      (square) => square.className.match(/opacity-\d+/)?.[0],
    );
    await expect(opacities).toEqual(['opacity-100', 'opacity-60', 'opacity-25']);
  },
};
