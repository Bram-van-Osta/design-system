import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { expectMarkersOnNames, expectUnbrokenRule } from '../../testing/expect-timeline.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Timeline } from './Timeline.tsx';

function Provided({ name, detail }: { readonly name: string; readonly detail: string }) {
  return (
    <span className="flex flex-col gap-0.5">
      <span className="font-semibold text-body-s">{name}</span>
      <span className="text-ink-muted text-small">{detail}</span>
    </span>
  );
}

const meta = {
  title: 'Feedback/Timeline',
  component: Timeline,
  args: {
    items: [
      {
        id: 'before_start',
        label: 'before the start',
        children: <Provided name="Domain access" detail="Access to the domain and its host." />,
      },
      {
        id: 'at_questionnaire',
        label: 'at the questionnaire',
        children: (
          <>
            <Provided name="Photos" detail="The products and the events, if there are any." />
            <Provided name="Texts" detail="The breads, their prices and the market days." />
          </>
        ),
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-reading-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

// What a client provides, by moment: each moment a square on the rule, centered on its name's line,
// the rule unbroken from one square to the next, its name, then its items.
export const ByMoment: Story = {
  play: async ({ canvas, canvasElement }) => {
    const moments = canvas.getAllByRole('listitem');
    await expect(moments).toHaveLength(2);
    await expect(canvas.getByText('at the questionnaire')).toBeVisible();
    const marker = moments[0]?.querySelector('[data-marker]');
    if (marker instanceof HTMLElement) {
      await expect(getComputedStyle(marker).backgroundColor).toBe(tokenColor('ink', marker));
    }
    const names = ['before the start', 'at the questionnaire'].map((name) =>
      canvas.getByText(name),
    );
    await expectMarkersOnNames(canvasElement, names);
    await expectUnbrokenRule(canvasElement);
  },
};

export const OneMoment: Story = {
  args: {
    items: [
      {
        id: 'before_launch',
        label: 'before the launch',
        children: <Provided name="Translations" detail="The English pages, checked." />,
      },
    ],
  },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(1);
    await expectMarkersOnNames(canvasElement, [canvas.getByText('before the launch')]);
    await expect(canvasElement.querySelector('[data-rule]')).toBeNull();
  },
};
