import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { expectErrorColors } from '../../testing/expect-error-colors.ts';
import { expectOnFirstLine, lineCount } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { TextInput } from '../TextInput/TextInput.tsx';
import { Field } from './Field.tsx';
import { FieldLabelSize } from './field-label-size.ts';
import { FieldMarker } from './field-marker.ts';

const meta = {
  title: 'Forms/Field',
  component: Field,
  args: {
    label: 'Your email',
    children: <TextInput type="email" autoComplete="email" />,
  },
  argTypes: {
    marker: { control: 'inline-radio', options: [undefined, ...Object.values(FieldMarker)] },
    labelSize: { control: 'inline-radio', options: Object.values(FieldLabelSize) },
    children: { control: false },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Your email' });
    await expectHeightAtLeast(input, 'button-height');
    await userEvent.click(canvas.getByText('Your email'));
    await expect(input).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.tab();
    await expectFocusRing(input);
  },
};

export const WithHelp: Story = {
  args: {
    description: 'We will send you a link to confirm this address.',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Your email' })).toHaveAccessibleDescription(
      'We will send you a link to confirm this address.',
    );
  },
};

export const Required: Story = {
  args: { marker: FieldMarker.required },
};

export const Optional: Story = {
  args: {
    label: 'Phone',
    marker: FieldMarker.optional,
    children: <TextInput type="tel" autoComplete="tel" />,
  },
};

export const WithError: Story = {
  args: {
    description: 'We will send you a link to confirm this address.',
    error: 'Enter an email address, such as jeanne.martin@example.com.',
    children: <TextInput type="email" defaultValue="jeanne.martin@" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Your email' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(
      expect.stringContaining('Enter an email address'),
    );
    const message = canvas.getByText(/^Enter an email address/);
    await expectErrorColors(message);
    await expectOnFirstLine(message, message.querySelector('svg'));
  },
};

// A message on two lines at a short form's width: its icon stays on the first one.
export const WithALongError: Story = {
  args: {
    error:
      'Enter the email address your invitation was sent to, such as jeanne.martin@example.com, so that we can find your account.',
    children: <TextInput type="email" defaultValue="jeanne.martin@" />,
  },
  decorators: [
    (Story) => (
      <div className="max-w-form-width">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const message = canvas.getByText(/^Enter the email address/);
    await expect(lineCount(message)).toBeGreaterThanOrEqual(2);
    await expectOnFirstLine(message, message.querySelector('svg'));
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <TextInput type="email" defaultValue="jeanne.martin@example.com" />,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox', { name: 'Your email' })).toBeDisabled();
  },
};

// T13-A1-Dossiers-D and T13-E4-Clients-D: a search field beside the page's heading, its label in
// muted mono, close above its control.
export const SmallLabel: Story = {
  args: {
    label: 'Search for a client',
    labelSize: FieldLabelSize.small,
    children: <TextInput type="search" placeholder="E.g. Boulangerie du Port" />,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('searchbox', { name: 'Search for a client' });
    const label = canvas.getByText('Search for a client');
    const style = getComputedStyle(label);
    await expect({
      isMono: style.fontFamily.includes('IBM Plex Mono'),
      fontSize: style.fontSize,
      color: style.color,
    }).toEqual({ isMono: true, fontSize: '13px', color: tokenColor('ink-muted', label) });
    const labelRow = label.parentElement;
    if (labelRow === null) {
      throw new Error('The label has its row.');
    }
    await expect(input.getBoundingClientRect().top - labelRow.getBoundingClientRect().bottom).toBe(
      tokenPixels('space-1'),
    );
    await userEvent.click(label);
    await expect(input).toHaveFocus();
  },
};
