import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { expectAnimationOnlyWhenMotionAllowed } from '../../testing/expect-motion.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { CheckboxCards } from '../CheckboxCards/CheckboxCards.tsx';
import { ChoiceColumns, ChoiceSize } from '../ChoiceCard/choice-grid.ts';
import { FieldMarker } from '../Field/field-marker.ts';
import { RadioCards } from '../RadioCards/RadioCards.tsx';
import { FollowUp } from './FollowUp.tsx';

const PHONE = { value: 'mobile1' };
const FOLLOW_UP = 'Orders: pick-up in store, or delivery?';
const WHY = 'Because you want to take orders. It changes what the site does.';
const COMPACT_HEIGHT = 48;

function Fulfillment({ onValueChange }: { readonly onValueChange?: (value: string) => void }) {
  return (
    <RadioCards
      legend={FOLLOW_UP}
      description={WHY}
      size={ChoiceSize.compact}
      columns={ChoiceColumns.three}
      onValueChange={onValueChange}
      options={[
        { value: 'pickup', label: 'Pick-up in store' },
        { value: 'delivery', label: 'Delivery' },
        { value: 'both', label: 'Both' },
        { value: 'unknown', label: 'I do not know yet' },
      ]}
    />
  );
}

// T12-M3-Clients-D: a short question that follows from an answer, under the question's choices.
const meta = {
  title: 'Forms/FollowUp',
  component: FollowUp,
  args: { children: <Fulfillment onValueChange={fn()} /> },
  render: (args) => (
    <div className="flex max-w-reading-width flex-col gap-space-6">
      <CheckboxCards
        legend="What must your customers be able to do on your site?"
        marker={FieldMarker.optional}
        defaultValue={['order']}
        options={[
          { value: 'hours', label: 'Find your hours and come' },
          { value: 'order', label: 'Order' },
          { value: 'book', label: 'Book' },
          { value: 'call', label: 'Call you in one tap' },
        ]}
      />
      <FollowUp {...args} />
    </div>
  ),
} satisfies Meta<typeof FollowUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UnderTheQuestion: Story = {
  play: async ({ canvas, canvasElement }) => {
    const panel = canvasElement.querySelector('[data-follow-up]');
    if (!(panel instanceof HTMLElement)) {
      throw new Error('The follow-up sits in its panel.');
    }
    await expect(getComputedStyle(panel).backgroundColor).toBe(tokenColor('surface', panel));
    const question = canvas.getByRole('radiogroup', { name: FOLLOW_UP });
    await expect(question).toHaveAccessibleDescription(WHY);
    const pickup = canvas.getByRole('radio', { name: 'Pick-up in store' });
    await expect(pickup).not.toBeChecked();
    const card = pickup.closest('label');
    await expect(card?.getBoundingClientRect().height).toBeGreaterThanOrEqual(COMPACT_HEIGHT);
    await userEvent.click(pickup);
    await expect(pickup).toBeChecked();
    const order = canvas.getByRole('checkbox', { name: 'Order' });
    await expect(order.getBoundingClientRect().top).toBeLessThan(panel.getBoundingClientRect().top);
  },
};

export const OnAPhone: Story = {
  globals: { viewport: PHONE },
  play: async ({ canvas }) => {
    const unknown = canvas.getByRole('radio', { name: 'I do not know yet' });
    await waitFor(() => expect(unknown).toBeVisible());
  },
};

// Less motion: the follow-up shows at once, without rising.
export const ReducedMotion: Story = {
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('[data-follow-up]');
    if (panel === null) {
      throw new Error('The follow-up sits in its panel.');
    }
    await expectAnimationOnlyWhenMotionAllowed(panel);
  },
};
