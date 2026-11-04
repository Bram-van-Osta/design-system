import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectOnFirstLine } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { FieldMarker } from '../Field/field-marker.ts';
import { RadioGroup } from './RadioGroup.tsx';
import { RadioGroupOrientation } from './radio-group-orientation.ts';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  args: {
    legend: 'To come back to your space',
    options: [
      { value: 'passkey', label: 'With Face ID or your fingerprint' },
      { value: 'link', label: 'With a link received by email' },
      { value: 'password', label: 'With a password' },
    ],
    onValueChange: fn(),
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: Object.values(RadioGroupOrientation) },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await expect(
      canvas.getByRole('radiogroup', { name: 'To come back to your space' }),
    ).toBeVisible();
    const first = canvas.getByRole('radio', { name: 'With Face ID or your fingerprint' });
    await expectOnFirstLine(first.closest('label') ?? first, first);
    await userEvent.tab();
    await expectFocusRing(first);
    await userEvent.keyboard('{ArrowDown}');
    const second = canvas.getByRole('radio', { name: 'With a link received by email' });
    await expect(second).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('link');
  },
};

export const WithDescriptions: Story = {
  args: {
    defaultValue: 'passkey',
    marker: FieldMarker.required,
    options: [
      {
        value: 'passkey',
        label: 'With Face ID or your fingerprint',
        description: 'A passkey on this phone, without a password',
      },
      {
        value: 'link',
        label: 'With a link received by email',
        description: 'At each sign-in, valid for ten minutes',
      },
    ],
  },
};

export const WithError: Story = {
  args: { error: 'Choose how you will come back.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Choose how you will come back.')).toBeVisible();
  },
};

export const DisabledOption: Story = {
  args: {
    defaultValue: 'link',
    options: [
      { value: 'passkey', label: 'With Face ID or your fingerprint', disabled: true },
      { value: 'link', label: 'With a link received by email' },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('radio', { name: 'With Face ID or your fingerprint' }),
    ).toHaveAttribute('aria-disabled', 'true');
  },
};

const TO_THE_CLIENT = 'Message to Jeanne';
const INTERNAL_NOTE = 'Internal note';

function labelOf(radio: HTMLElement): Element {
  return radio.closest('label') ?? radio;
}

// REF-T4-O6-Projet's composer: two short answers on one line, the arrow keys still moving between
// them.
export const Horizontal: Story = {
  args: {
    legend: 'Write',
    orientation: RadioGroupOrientation.horizontal,
    defaultValue: 'message',
    options: [
      { value: 'message', label: TO_THE_CLIENT },
      { value: 'note', label: INTERNAL_NOTE },
    ],
  },
  play: async ({ canvas, args }) => {
    const message = canvas.getByRole('radio', { name: TO_THE_CLIENT });
    const note = canvas.getByRole('radio', { name: INTERNAL_NOTE });
    const first = labelOf(message).getBoundingClientRect();
    const second = labelOf(note).getBoundingClientRect();
    await expectHeightAtLeast(labelOf(note), 'target-min');
    if (isOnAComputer()) {
      await expect(second.top).toBe(first.top);
      await expect(second.left).toBeGreaterThanOrEqual(first.right + tokenPixels('space-5'));
    }
    await userEvent.tab();
    await expectFocusRing(message);
    await userEvent.keyboard('{ArrowRight}');
    await expect(note).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('note');
  },
};

// Too narrow for the answers side by side: they wrap, each whole with its box.
export const HorizontalWrapping: Story = {
  args: {
    legend: 'How should we reach you?',
    orientation: RadioGroupOrientation.horizontal,
    options: [
      { value: 'email', label: 'By email, at the address of your request' },
      { value: 'phone', label: 'By phone, in the afternoon' },
      { value: 'none', label: 'Not at all' },
    ],
  },
  render: (args) => (
    <div className="max-w-form-width">
      <RadioGroup {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const radios = canvas.getAllByRole('radio');
    const [first, second] = radios.map((radio) => labelOf(radio).getBoundingClientRect());
    if (first !== undefined && second !== undefined) {
      await expect(second.top).toBeGreaterThanOrEqual(first.bottom);
    }
    for (const radio of radios) {
      await expectOnFirstLine(labelOf(radio), radio);
      await expect(labelOf(radio).getBoundingClientRect().right).toBeLessThanOrEqual(
        canvasElement.getBoundingClientRect().right,
      );
    }
  },
};
