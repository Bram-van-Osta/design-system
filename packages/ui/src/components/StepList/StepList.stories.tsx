import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { messagesOf } from '../../testing/messages-of.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { StepList, type StepListStep } from './StepList.tsx';

const LABEL = "Your project's steps";
const BOX_SIZE = 36;

const STEPS: readonly StepListStep[] = [
  { id: 'request', label: 'Your request', lead: 'usually within two days' },
  { id: 'offer', label: 'The offer', lead: 'usually within two days' },
  { id: 'questionnaire', label: 'The questionnaire', lead: 'about 20 minutes, at your pace' },
  { id: 'proposal', label: 'The proposal', lead: 'about ten days after your answers' },
  { id: 'test-site', label: 'The test site', lead: 'usually two weeks after your choice' },
  { id: 'launch', label: 'The launch', lead: 'around mid-January' },
];

function boxOf(item: HTMLElement): HTMLElement {
  const box = item.querySelector('[data-step-box]');
  if (!(box instanceof HTMLElement)) {
    throw new Error('Each step holds its box.');
  }
  return box;
}

// T14-S1-Acompte-D and -M: the client's six steps, the questionnaire under way.
const meta = {
  title: 'Layout/StepList',
  component: StepList,
  args: { label: LABEL, steps: STEPS, currentIndex: 2 },
  argTypes: {
    steps: { control: false },
  },
} satisfies Meta<typeof StepList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtTheQuestionnaire: Story = {
  play: async ({ canvas, globals }) => {
    const messages = messagesOf(globals.locale);
    const list = canvas.getByRole('list', { name: LABEL });
    const items = within(list).getAllByRole('listitem');
    await expect(items).toHaveLength(STEPS.length);
    const [request, , questionnaire, proposal] = items;
    if (request === undefined || questionnaire === undefined || proposal === undefined) {
      throw new Error('The six steps are drawn.');
    }

    await expect(request).toHaveTextContent(`Your request ${messages['stepProgress.done']}`);
    await expect(request).not.toHaveTextContent('usually within two days');
    const doneBox = boxOf(request);
    await expect(getComputedStyle(doneBox).backgroundColor).toBe(tokenColor('delft', doneBox));
    await expect(doneBox.querySelector('svg')).not.toBeNull();

    await expect(questionnaire).toHaveAttribute('aria-current', 'step');
    await expect(questionnaire).toHaveTextContent(
      `The questionnaire ${messages['stepList.now']} about 20 minutes, at your pace`,
    );
    const now = within(questionnaire).getByText(messages['stepList.now']);
    await expect(getComputedStyle(now).color).toBe(tokenColor('vermillion', now));
    const currentBox = boxOf(questionnaire);
    const currentStyle = getComputedStyle(currentBox);
    await expect({
      borderTopWidth: currentStyle.borderTopWidth,
      borderTopColor: currentStyle.borderTopColor,
    }).toEqual({ borderTopWidth: '2px', borderTopColor: tokenColor('delft', currentBox) });
    await expect(currentBox).toHaveTextContent('3');

    await expect(proposal).not.toHaveAttribute('aria-current');
    await expect(boxOf(proposal)).toHaveTextContent('4');
    const proposalName = within(proposal).getByText('The proposal');
    await expect(getComputedStyle(proposalName).color).toBe(tokenColor('ink-muted', proposal));

    for (const item of items) {
      const box = boxOf(item).getBoundingClientRect();
      await expect({ width: box.width, height: box.height }).toEqual({
        width: BOX_SIZE,
        height: BOX_SIZE,
      });
      await expect(getComputedStyle(boxOf(item)).borderRadius).toBe('0px');
    }
  },
};

// In a row on a computer, a column on a phone.
export const RowOrColumn: Story = {
  play: async ({ canvas }) => {
    const items = within(canvas.getByRole('list', { name: LABEL })).getAllByRole('listitem');
    const [first, second] = items.map((item) => item.getBoundingClientRect());
    if (isOnAComputer()) {
      await expect(second?.top).toBe(first?.top);
      await expect(second?.left ?? 0).toBeGreaterThan(first?.left ?? 0);
    } else {
      await expect(second?.left).toBe(first?.left);
      await expect(second?.top ?? 0).toBeGreaterThan(first?.top ?? 0);
    }
  },
};

// The launch done: every step done, none current.
export const Launched: Story = {
  args: { currentIndex: STEPS.length },
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: LABEL });
    await expect(list.querySelector('[aria-current]')).toBeNull();
    for (const item of within(list).getAllByRole('listitem')) {
      await expect(item).toHaveAttribute('data-state', 'done');
    }
  },
};

const PAUSED = 'paused, at your request';

// The project on hold: the current step without "right now" nor its lead, its line saying so.
export const Paused: Story = {
  args: { currentIndex: 3, pausedNote: PAUSED },
  play: async ({ canvas, globals }) => {
    const messages = messagesOf(globals.locale);
    const list = canvas.getByRole('list', { name: LABEL });
    const proposal = within(list).getAllByRole('listitem')[3];
    if (proposal === undefined) {
      throw new Error('The six steps are drawn.');
    }
    await expect(proposal).toHaveAttribute('aria-current', 'step');
    await expect(proposal).toHaveTextContent(`The proposal ${PAUSED}`);
    await expect(proposal).not.toHaveTextContent(messages['stepList.now']);
    await expect(proposal).not.toHaveTextContent('about ten days after your answers');
    const note = within(proposal).getByText(PAUSED);
    await expect(getComputedStyle(note).color).toBe(tokenColor('ink-muted', note));
    await expect(canvas.getByText('around mid-January')).toBeVisible();
  },
};
