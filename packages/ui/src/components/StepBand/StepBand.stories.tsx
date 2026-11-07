import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { interpolate } from '../../i18n/interpolate.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { messagesOf } from '../../testing/messages-of.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { StepBand, type StepBandStep } from './StepBand.tsx';
import { StepBandCompact } from './StepBandCompact.tsx';

const LABEL = "The case's steps";
const SUB_STATE = 'pre-analysis ready · yours';

const STEPS: readonly StepBandStep[] = [
  { id: 'request', label: 'The request' },
  { id: 'offer', label: 'The offer' },
  { id: 'questionnaire', label: 'The questionnaire' },
  { id: 'proposal', label: 'The proposal' },
  { id: 'test-site', label: 'The test site' },
  { id: 'launch', label: 'The launch' },
];

function positionText(locale: unknown, position: number): string {
  return interpolate(messagesOf(locale)['stepBand.position'], { position, count: STEPS.length });
}

async function expectBars(list: HTMLElement, states: readonly string[]): Promise<void> {
  const items = within(list).getAllByRole('listitem');
  await expect(items).toHaveLength(states.length);
  for (const [index, item] of items.entries()) {
    const state = states[index];
    await expect(item).toHaveAttribute('data-state', state);
    const bar = item.firstElementChild;
    if (!(bar instanceof HTMLElement)) {
      throw new Error('Each step starts with its bar.');
    }
    await expect(bar.getBoundingClientRect().height).toBe(tokenPixels('progress-bar-height'));
    const color = { done: 'delft', current: 'delft-pale', upcoming: 'line' } as const;
    if (state === 'done' || state === 'current' || state === 'upcoming') {
      await expect(getComputedStyle(bar).backgroundColor).toBe(tokenColor(color[state], bar));
    }
  }
}

// T13-A2-Accueil-PreAnalyse-D and T13-C2-Accueil-M: a case's six steps under its heading.
const meta = {
  title: 'Layout/StepBand',
  component: StepBand,
  args: {
    label: LABEL,
    steps: STEPS,
    currentIndex: 0,
    subState: SUB_STATE,
  },
  argTypes: {
    steps: { control: false },
  },
} satisfies Meta<typeof StepBand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AtTheRequest: Story = {
  play: async ({ canvas, globals }) => {
    const list = canvas.getByRole('list', { name: LABEL });
    await expectBars(list, ['current', 'upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming']);
    const [current, ...others] = within(list).getAllByRole('listitem');
    await expect(current).toHaveAttribute('aria-current', 'step');
    for (const other of others) {
      await expect(other).not.toHaveAttribute('aria-current');
    }
    const diamond = canvasDiamond(canvas.getByText(SUB_STATE, { selector: 'li *' }));
    if (isOnAComputer()) {
      await expect(canvas.getByText('The offer')).toBeVisible();
      await expect(canvas.getByText(SUB_STATE, { selector: 'li *' })).toBeVisible();
      await expect(getComputedStyle(diamond).backgroundColor).toBe(
        tokenColor('vermillion', diamond),
      );
      await expect(canvas.getByText(positionText(globals.locale, 1))).not.toBeVisible();
    } else {
      await expect(canvas.getByText(positionText(globals.locale, 1))).toBeVisible();
      await expect(canvas.getByText(SUB_STATE, { selector: 'div[aria-hidden] *' })).toBeVisible();
    }
  },
};

function canvasDiamond(subState: HTMLElement): HTMLElement {
  const diamond = subState.closest('li')?.querySelector('[data-current-step-diamond]');
  if (!(diamond instanceof HTMLElement)) {
    throw new Error('The current step holds its diamond.');
  }
  return diamond;
}

// T13-B1-Fil-D: the questionnaire, two steps done, each read as done.
export const AtTheQuestionnaire: Story = {
  args: { currentIndex: 2, subState: 'with Jeanne · section 3 of 8' },
  play: async ({ canvas, globals }) => {
    const list = canvas.getByRole('list', { name: LABEL });
    await expectBars(list, ['done', 'done', 'current', 'upcoming', 'upcoming', 'upcoming']);
    const [request] = within(list).getAllByRole('listitem');
    await expect(request).toHaveTextContent(
      `The request ${messagesOf(globals.locale)['stepProgress.done']}`,
    );
    await expect(within(list).getAllByRole('listitem')[2]).toHaveAttribute('aria-current', 'step');
  },
};

// A launched site: every step done, none current, the band on its last step.
export const Launched: Story = {
  args: { currentIndex: STEPS.length, subState: undefined },
  play: async ({ canvas, globals }) => {
    const list = canvas.getByRole('list', { name: LABEL });
    await expectBars(list, ['done', 'done', 'done', 'done', 'done', 'done']);
    await expect(list.querySelector('[aria-current]')).toBeNull();
    if (!isOnAComputer()) {
      await expect(canvas.getByText(positionText(globals.locale, STEPS.length))).toBeVisible();
    }
  },
};

// T13-A1-Dossiers-D: the compact form in a case's row, its bars read as its position.
export const Compact: Story = {
  render: () => (
    <span className="flex flex-col gap-space-2 text-small">
      <StepBandCompact count={STEPS.length} currentIndex={3} />
      The proposal 1
    </span>
  ),
  play: async ({ canvas, globals }) => {
    const bars = canvas.getByRole('img', { name: positionText(globals.locale, 4) });
    const segments = [...bars.children];
    await expect(segments).toHaveLength(STEPS.length);
    await expect(segments.map((segment) => segment.getAttribute('data-state'))).toEqual([
      'done',
      'done',
      'done',
      'current',
      'upcoming',
      'upcoming',
    ]);
    for (const segment of segments) {
      await expect(segment.getBoundingClientRect().height).toBe(tokenPixels('progress-bar-height'));
    }
  },
};

// The app's own words for a screen reader, in place of the position.
export const CompactNamedByTheApp: Story = {
  render: () => <StepBandCompact count={STEPS.length} currentIndex={0} label="The request" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'The request' })).toBeVisible();
  },
};
