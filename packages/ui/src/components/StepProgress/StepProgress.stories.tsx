import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import {
  expectGroupedSegments,
  expectPartNames,
  expectSegmentColors,
} from '../../testing/expect-step-parts.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { StepProgress } from './StepProgress.tsx';
import { StepPartState, type StepProgressPart, StepProgressTone } from './step-parts.ts';

const LABEL = "Your request's progress";

// C-07-Progression, direction 1: the brief's four parts, as its welcome page announces them.
const BRIEF_PARTS: readonly StepProgressPart[] = [
  { label: 'Your situation', shortLabel: 'Situation', steps: 3 },
  { label: 'Your business', shortLabel: 'Business', steps: 2 },
  { label: 'Your project', shortLabel: 'Project', steps: 2 },
  { label: 'Reaching you', shortLabel: 'Contact', steps: 1 },
];
const BRIEF_QUESTIONS = 8;
const PHONE = { value: 'mobile1' };
const { done, current, upcoming } = StepPartState;

// REF-T6-B01-Accueil-D to REF-T6-B08-Delai-D: across the page, under the header.
const meta = {
  title: 'Layout/StepProgress',
  component: StepProgress,
  args: {
    label: LABEL,
    max: 7,
    value: 2,
    valueText: 'Question 2 of 7',
  },
  decorators: [
    (Story) => (
      <div className="-mx-space-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StepProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTheWay: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '7');
    await expect(bar).toHaveAttribute('aria-valuenow', '2');
    await expect(bar).toHaveAttribute('aria-valuetext', 'Question 2 of 7');
    const segments = [...bar.children];
    await expect(segments).toHaveLength(7);
    const [done, notYet] = [segments[1], segments[2]];
    await expect(done && getComputedStyle(done).backgroundColor).toBe(tokenColor('delft', bar));
    await expect(notYet && getComputedStyle(notYet).backgroundColor).toBe(tokenColor('line', bar));
    await expect(done?.getBoundingClientRect().height).toBe(tokenPixels('progress-height'));
  },
};

export const NotStarted: Story = {
  args: { value: 0, valueText: 'Request not started yet' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  },
};

export const Done: Story = {
  args: { value: 7, valueText: 'Every question answered' },
};

export const BriefStart: Story = {
  args: {
    max: BRIEF_QUESTIONS,
    value: 0,
    valueText: 'Request not started yet',
    parts: BRIEF_PARTS,
  },
  play: async ({ canvas, globals }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expect(bar).toHaveAttribute('aria-valuenow', '0');
    await expect(bar).toHaveAttribute('aria-valuetext', 'Request not started yet');
    await expectGroupedSegments(bar, { parts: BRIEF_PARTS, filledCount: 0 });
    await expectPartNames(bar, {
      parts: BRIEF_PARTS,
      states: [current, upcoming, upcoming, upcoming],
      locale: globals.locale,
    });
  },
};

export const BriefInTheSecondPart: Story = {
  args: {
    max: BRIEF_QUESTIONS,
    value: 4,
    valueText: 'Question 4 of 8',
    parts: BRIEF_PARTS,
  },
  play: async ({ canvas, globals }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expect(bar).toHaveAttribute('aria-valuemax', '8');
    await expect(bar).toHaveAttribute('aria-valuenow', '4');
    await expect(bar).toHaveAttribute('aria-valuetext', 'Question 4 of 8');
    await expectGroupedSegments(bar, { parts: BRIEF_PARTS, filledCount: 4 });
    await expectPartNames(bar, {
      parts: BRIEF_PARTS,
      states: [done, current, upcoming, upcoming],
      locale: globals.locale,
    });
  },
};

export const BriefInTheLastPart: Story = {
  args: {
    max: BRIEF_QUESTIONS,
    value: 8,
    valueText: 'Question 8 of 8',
    parts: BRIEF_PARTS,
  },
  play: async ({ canvas, globals }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expectGroupedSegments(bar, { parts: BRIEF_PARTS, filledCount: 8 });
    await expectPartNames(bar, {
      parts: BRIEF_PARTS,
      states: [done, done, done, current],
      locale: globals.locale,
    });
  },
};

// C-07-Progression's phone: on the second part's last question, the short names on one line.
export const BriefOnAPhone: Story = {
  args: {
    max: BRIEF_QUESTIONS,
    value: 5,
    valueText: 'Question 5 of 8',
    parts: BRIEF_PARTS,
  },
  globals: { viewport: PHONE },
  play: async ({ canvas, globals }) => {
    await expect(isOnAComputer()).toBe(false);
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expectGroupedSegments(bar, { parts: BRIEF_PARTS, filledCount: 5 });
    await expectPartNames(bar, {
      parts: BRIEF_PARTS,
      states: [done, current, upcoming, upcoming],
      locale: globals.locale,
    });
  },
};

// The request's tracking page, kept on 3 November: the steps done in ink, the current one in
// vermilion, the next ones in the line color.
export const Following: Story = {
  args: { max: 6, value: 3, valueText: 'Step 3 of 6: the proposal', tone: StepProgressTone.ink },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expect(bar).toHaveAttribute('aria-valuenow', '3');
    await expect(bar).toHaveAttribute('aria-valuetext', 'Step 3 of 6: the proposal');
    const segments = [...bar.children];
    await expect(segments).toHaveLength(6);
    await expectSegmentColors(segments, { filledCount: 3, tone: StepProgressTone.ink });
  },
};

export const FollowingNotStarted: Story = {
  args: { max: 6, value: 0, valueText: 'Not started yet', tone: StepProgressTone.ink },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expectSegmentColors([...bar.children], { filledCount: 0, tone: StepProgressTone.ink });
  },
};

// With parts, the segments in the colors of their parts' names.
export const FollowingInParts: Story = {
  args: {
    max: BRIEF_QUESTIONS,
    value: 5,
    valueText: 'Question 5 of 8',
    parts: BRIEF_PARTS,
    tone: StepProgressTone.ink,
  },
  play: async ({ canvas, globals }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expectGroupedSegments(bar, {
      parts: BRIEF_PARTS,
      filledCount: 5,
      tone: StepProgressTone.ink,
    });
    await expectPartNames(bar, {
      parts: BRIEF_PARTS,
      states: [done, current, upcoming, upcoming],
      locale: globals.locale,
    });
  },
};

// T14-Q06-Garder-D: the questionnaire's progress by section, six done, the seventh under way, its
// segments 4 px high as every T14-Q board draws them.
export const BySection: Story = {
  args: {
    label: 'Your questionnaire',
    max: 8,
    value: 7,
    valueText: '6 sections of 8 done',
    tone: StepProgressTone.sections,
  },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Your questionnaire' });
    await expect(bar).toHaveAttribute('aria-valuetext', '6 sections of 8 done');
    const segments = [...bar.children];
    await expect(segments).toHaveLength(8);
    const colors = segments.map((segment) => getComputedStyle(segment).backgroundColor);
    await expect(colors).toEqual([
      ...Array.from({ length: 6 }, () => tokenColor('delft', bar)),
      tokenColor('delft-pale', bar),
      tokenColor('line', bar),
    ]);
    for (const segment of segments) {
      await expect(segment.getBoundingClientRect().height).toBe(tokenPixels('progress-bar-height'));
    }
  },
};
