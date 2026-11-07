import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import {
  expectAnswerPressed,
  expectAnswerRow,
  expectDisabledOptions,
  expectFocusOnDelft,
  expectInkGroup,
  expectPressed,
  expectSegmentedGroup,
} from '../../testing/expect-toggle-group.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { ToggleGroup } from './ToggleGroup.tsx';
import { ToggleGroupTone } from './toggle-group-tone.ts';

const PREVIEW_ON = 'Preview on';
const COMPUTER = 'Computer';
const PHONE = 'Phone';

// C-05-BasculeApercu, direction 1: the operator's preview of a page as the client will see it.
const meta = {
  title: 'Actions/ToggleGroup',
  component: ToggleGroup,
  args: {
    label: PREVIEW_ON,
    options: [
      { value: 'computer', label: COMPUTER },
      { value: 'phone', label: PHONE },
    ],
    onValueChange: fn(),
  },
  argTypes: {
    options: { control: false },
  },
  decorators: [
    // A Delft band by default; the page's own background for the other tones.
    (Story, { args }) => (
      <div
        className={
          args.tone === undefined || args.tone === ToggleGroupTone.delft
            ? '-m-space-5 flex justify-end bg-delft px-space-4 py-space-2'
            : '-m-space-5 bg-bg p-space-5'
        }
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComputerPressed: Story = {
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: PREVIEW_ON });
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await expectSegmentedGroup(group, [computer, phone]);
    await expectPressed(computer, [phone]);
  },
};

export const PhonePressed: Story = {
  args: { defaultValue: 'phone' },
  play: async ({ canvas }) => {
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await expectPressed(phone, [computer]);
  },
};

export const Pointer: Story = {
  play: async ({ canvas, args }) => {
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await userEvent.click(phone);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('phone');
    await expectPressed(phone, [computer]);
    await userEvent.click(phone);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expectPressed(phone, [computer]);
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await userEvent.tab();
    await expectFocusOnDelft(computer);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusOnDelft(phone);
    await expectPressed(computer, [phone]);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('phone');
    await expectPressed(phone, [computer]);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expectPressed(phone, [computer]);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusOnDelft(computer);
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('computer');
    await expectPressed(computer, [phone]);
    await userEvent.keyboard('{ArrowLeft}');
    await expectFocusOnDelft(phone);
  },
};

// C-27-SiteActuel: the views of a capture, in a dialog on the page's own background.
export const InkOnThePage: Story = {
  args: { tone: ToggleGroupTone.ink },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: PREVIEW_ON });
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await expectInkGroup(group, computer, [phone]);
    await expect(phone.getBoundingClientRect().left).toBe(computer.getBoundingClientRect().right);
    await expect(getComputedStyle(phone).borderLeftColor).toBe(tokenColor('ink', phone));
  },
};

export const InkKeyboard: Story = {
  args: { tone: ToggleGroupTone.ink },
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: PREVIEW_ON });
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await userEvent.tab();
    await expectFocusRing(computer);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusRing(phone);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('phone');
    await expectInkGroup(group, phone, [computer]);
  },
};

// Unavailable: the band's segments in the line color, the pressed one kept.
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'phone' },
  play: async ({ canvas, args }) => {
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await expectDisabledOptions(phone, [computer]);
    await expect(phone).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(computer);
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(phone).toHaveAttribute('aria-pressed', 'true');
  },
};

const QUESTION = 'Does this sentence sound like you?';
const SENTENCE = '"Passionate bakers, we put our whole heart into every batch!"';
const YES = "Yes, that's us";
const IN_BETWEEN = 'Somewhere in between';
const NOT_FOR_ME = 'Not for me';
const ANSWERS = [
  { value: 'yes', label: YES },
  { value: 'in-between', label: IN_BETWEEN },
  { value: 'not-for-me', label: NOT_FOR_ME },
] as const;

function answersOf(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  return {
    yes: canvas.getByRole('button', { name: YES }),
    inBetween: canvas.getByRole('button', { name: IN_BETWEEN }),
    notForMe: canvas.getByRole('button', { name: NOT_FOR_ME }),
  };
}

function answerGap() {
  return isOnAComputer() ? 'space-3' : 'space-2';
}

// REF-T6-Q41-Juger-D and -M: a sentence to judge, three answers side by side, none pressed at
// first, three equal columns on a phone too.
export const Answers: Story = {
  args: { tone: ToggleGroupTone.answer, label: QUESTION, options: ANSWERS },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('group', { name: QUESTION })).toBeVisible();
    const { yes, inBetween, notForMe } = answersOf(canvasElement);
    await expectAnswerRow([yes, inBetween, notForMe], answerGap());
    await expectAnswerPressed(null, [yes, inBetween, notForMe], { isCheckShown: false });
  },
};

// Choosing an answer presses it in Delft blue, with its check on a computer; choosing it again
// keeps it, as "Skip this question" is the page's way to leave it unanswered.
export const AnswerChosen: Story = {
  args: Answers.args,
  play: async ({ canvasElement, args }) => {
    const { yes, inBetween, notForMe } = answersOf(canvasElement);
    const isCheckShown = isOnAComputer();
    await userEvent.click(notForMe);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('not-for-me');
    await expectAnswerPressed(notForMe, [yes, inBetween], { isCheckShown });
    await expect(notForMe).toHaveClass('hover:data-pressed:not-data-disabled:bg-delft-deep');
    await userEvent.click(notForMe);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expectAnswerPressed(notForMe, [yes, inBetween], { isCheckShown });
    await userEvent.click(inBetween);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('in-between');
    await expectAnswerPressed(inBetween, [yes, notForMe], { isCheckShown });
    await expectAnswerRow([yes, inBetween, notForMe], answerGap());
  },
};

// An answer given before, as the questionnaire resumes.
export const AnswerPressedAtFirst: Story = {
  args: { ...Answers.args, defaultValue: 'not-for-me' },
  play: async ({ canvasElement }) => {
    const { yes, inBetween, notForMe } = answersOf(canvasElement);
    await expectAnswerPressed(notForMe, [yes, inBetween], { isCheckShown: isOnAComputer() });
  },
};

// Controlled by the app, with none pressed until its answer arrives.
export const AnswerControlled: Story = {
  args: { ...Answers.args, value: null },
  play: async ({ canvasElement, args }) => {
    const { yes, inBetween, notForMe } = answersOf(canvasElement);
    await userEvent.click(yes);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('yes');
    await expectAnswerPressed(null, [yes, inBetween, notForMe], { isCheckShown: false });
  },
};

// The tab reaches the answers once, the arrow keys move between them, the space bar or Enter
// presses one.
export const AnswerKeyboard: Story = {
  args: Answers.args,
  play: async ({ canvasElement, args }) => {
    const { yes, inBetween, notForMe } = answersOf(canvasElement);
    await userEvent.tab();
    await expectFocusRing(yes);
    await expect(getComputedStyle(yes).outlineColor).toBe(tokenColor('delft', yes));
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusRing(inBetween);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('in-between');
    await expectAnswerPressed(inBetween, [yes, notForMe], { isCheckShown: isOnAComputer() });
    await expectFocusRing(inBetween);
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('not-for-me');
    await userEvent.tab();
    await expect(notForMe).not.toHaveFocus();
  },
};

// Named by what the page shows: the question, then the sentence it asks about.
export const AnswersNamedByTheQuestion: Story = {
  args: Answers.args,
  render: (args) => (
    <div className="flex flex-col gap-space-4">
      <h2 id="question" className="font-display text-heading-s">
        {QUESTION}
      </h2>
      <blockquote id="sentence" className="bg-surface p-space-5 text-lead">
        {SENTENCE}
      </blockquote>
      <ToggleGroup
        tone={ToggleGroupTone.answer}
        labelledBy="question sentence"
        options={ANSWERS}
        onValueChange={args.onValueChange}
      />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const group = canvas.getByRole('group', { name: `${QUESTION} ${SENTENCE}` });
    await expect(group).not.toHaveAttribute('aria-label');
    const { yes, inBetween, notForMe } = answersOf(canvasElement);
    await expectAnswerRow([yes, inBetween, notForMe], answerGap());
  },
};

// Unavailable: in the line color, the pressed one kept.
export const AnswersDisabled: Story = {
  args: { ...Answers.args, defaultValue: 'yes', disabled: true },
  play: async ({ canvasElement, args }) => {
    const { yes, inBetween, notForMe } = answersOf(canvasElement);
    await expectDisabledOptions(yes, [inBetween, notForMe]);
    await userEvent.click(notForMe);
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(yes).toHaveAttribute('aria-pressed', 'true');
  },
};

const FILTER = 'Filter the thread';
const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'exchanges', label: 'Exchanges' },
  { value: 'steps', label: 'Steps' },
  { value: 'tasks', label: 'Tasks' },
] as const;

async function expectPlainPressed(
  pressed: HTMLElement,
  others: readonly HTMLElement[],
): Promise<void> {
  await expect(pressed).toHaveAttribute('aria-pressed', 'true');
  const style = getComputedStyle(pressed);
  await expect({
    fontWeight: style.fontWeight,
    textDecorationLine: style.textDecorationLine,
    textDecorationColor: style.textDecorationColor,
    textDecorationThickness: style.textDecorationThickness,
    backgroundColor: style.backgroundColor,
  }).toEqual({
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: tokenColor('delft', pressed),
    textDecorationThickness: '2px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  });
  for (const other of others) {
    await expect(other).toHaveAttribute('aria-pressed', 'false');
    await expect(getComputedStyle(other).textDecorationLine).toBe('none');
    await expect(getComputedStyle(other).fontWeight).toBe('400');
  }
}

// T13-B1-Fil-D and T13-C3-Fil-M: the thread's filters, plain words, the chosen one underlined.
export const PlainFilters: Story = {
  args: { tone: ToggleGroupTone.plain, label: FILTER, options: FILTERS },
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: FILTER });
    await expect(getComputedStyle(group).borderTopWidth).toBe('0px');
    const [all, exchanges, steps, tasks] = FILTERS.map(({ label }) =>
      canvas.getByRole('button', { name: label }),
    );
    if (
      all === undefined ||
      exchanges === undefined ||
      steps === undefined ||
      tasks === undefined
    ) {
      throw new Error('The four filters are drawn.');
    }
    for (const option of [all, exchanges, steps, tasks]) {
      await expectHeightAtLeast(option, 'target-min');
    }
    await expectPlainPressed(all, [exchanges, steps, tasks]);
    await userEvent.click(exchanges);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('exchanges');
    await expectPlainPressed(exchanges, [all, steps, tasks]);
  },
};

export const PlainKeyboard: Story = {
  args: PlainFilters.args,
  play: async ({ canvas, args }) => {
    const all = canvas.getByRole('button', { name: 'All' });
    const exchanges = canvas.getByRole('button', { name: 'Exchanges' });
    await userEvent.tab();
    await expectFocusRing(all);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusRing(exchanges);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('exchanges');
    await expectPlainPressed(exchanges, [all]);
  },
};

const PAGE = 'Home';
const KEEP_OPTIONS = [
  { value: 'keep', label: 'Keep' },
  { value: 'change', label: 'Change' },
  { value: 'remove', label: 'Remove' },
] as const;

async function expectSegmentsPressed(
  pressed: HTMLElement | null,
  others: readonly HTMLElement[],
): Promise<void> {
  if (pressed !== null) {
    await expect(pressed).toHaveAttribute('aria-pressed', 'true');
    const { backgroundColor, color } = getComputedStyle(pressed);
    await expect({ backgroundColor, color }).toEqual({
      backgroundColor: tokenColor('delft', pressed),
      color: tokenColor('on-delft', pressed),
    });
  }
  for (const other of others) {
    await expect(other).toHaveAttribute('aria-pressed', 'false');
    const { backgroundColor, color } = getComputedStyle(other);
    await expect({ backgroundColor, color }).toEqual({
      backgroundColor: tokenColor('bg', other),
      color: tokenColor('ink', other),
    });
  }
}

// T14-Q06-Garder-D and -M: what to keep of a page, named by the row it answers, none pressed first.
export const Segments: Story = {
  render: (args) => (
    <div className="flex items-center justify-between gap-space-3 border-line border-t-hair py-space-3">
      <span id="page-home" className="font-semibold">
        {PAGE}
      </span>
      <ToggleGroup {...args} />
    </div>
  ),
  args: {
    tone: ToggleGroupTone.segments,
    label: undefined,
    labelledBy: 'page-home',
    options: KEEP_OPTIONS,
  },
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: PAGE });
    const style = getComputedStyle(group);
    await expect({
      borderTopWidth: style.borderTopWidth,
      borderTopColor: style.borderTopColor,
      borderRadius: style.borderRadius,
    }).toEqual({
      borderTopWidth: '1px',
      borderTopColor: tokenColor('field', group),
      borderRadius: '0px',
    });
    const [keep, change, remove] = KEEP_OPTIONS.map(({ label }) =>
      canvas.getByRole('button', { name: label }),
    );
    if (keep === undefined || change === undefined || remove === undefined) {
      throw new Error('The three answers are drawn.');
    }
    await expectSegmentsPressed(null, [keep, change, remove]);
    for (const option of [keep, change, remove]) {
      await expectHeightAtLeast(option, 'target-min');
    }
    await expect(change.getBoundingClientRect().left).toBe(keep.getBoundingClientRect().right);
    await userEvent.click(change);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('change');
    await expectSegmentsPressed(change, [keep, remove]);
  },
};

export const SegmentsKeyboard: Story = {
  render: Segments.render,
  args: Segments.args,
  play: async ({ canvas, args }) => {
    const keep = canvas.getByRole('button', { name: 'Keep' });
    const change = canvas.getByRole('button', { name: 'Change' });
    await userEvent.tab();
    await expectFocusRing(keep);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusRing(change);
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('change');
    await expectSegmentsPressed(change, [keep]);
  },
};
