import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { Field } from '../Field/Field.tsx';
import { FieldMarker } from '../Field/field-marker.ts';
import { TextArea } from './TextArea.tsx';

const LABEL = 'In one sentence, what you expect';
const EXPECTATION =
  'That customers find our opening hours right away, and order for the holidays without calling us.';

// REF-T6-B03-Pourquoi-D and REF-T6-B10-Projet-D: a few sentences in the person's own words.
const meta = {
  title: 'Forms/TextArea',
  component: TextArea,
  args: {
    maxLength: 2000,
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <Field
        label={LABEL}
        marker={FieldMarker.optional}
        description="In your own words, as you would say it to a customer."
      >
        <Story />
      </Field>
    ),
  ],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { rows: 2 },
  play: async ({ canvas, args }) => {
    const textArea = canvas.getByRole('textbox', { name: /In one sentence, what you expect/ });
    await expect(textArea.tagName).toBe('TEXTAREA');
    await expect(textArea).toHaveAttribute('rows', '2');
    await expect(textArea).toHaveAttribute('maxlength', '2000');
    await expect(getComputedStyle(textArea).resize).toBe('vertical');
    await expectHeightAtLeast(textArea, 'button-height');
    await expect(textArea).toHaveAccessibleDescription(
      'In your own words, as you would say it to a customer.',
    );
    await userEvent.tab();
    await expectFocusRing(textArea);
    await userEvent.keyboard('Order for the holidays.{Enter}Without calling.');
    await expect(textArea).toHaveValue('Order for the holidays.\nWithout calling.');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(
      'Order for the holidays.\nWithout calling.',
      expect.anything(),
    );
  },
};

export const Filled: Story = {
  args: { rows: 6, defaultValue: EXPECTATION },
};

export const WithError: Story = {
  decorators: [
    (Story) => (
      <Field label="Your project" error="Tell us about your project in a few words.">
        <Story />
      </Field>
    ),
  ],
  play: async ({ canvas }) => {
    const textArea = canvas.getByRole('textbox', { name: 'Your project' });
    await expect(textArea).toHaveAttribute('aria-invalid', 'true');
    await expect(textArea).toHaveAccessibleDescription(
      expect.stringContaining('Tell us about your project in a few words.'),
    );
  },
};

export const Disabled: Story = {
  args: { defaultValue: EXPECTATION, disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: /In one sentence/ })).toBeDisabled();
  },
};
