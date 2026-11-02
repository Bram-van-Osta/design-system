import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { expectBodyText } from '../../testing/expect-body-text.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { Field } from '../Field/Field.tsx';
import { FieldMarker } from '../Field/field-marker.ts';
import { TextArea } from './TextArea.tsx';
import { MAX_HEIGHT_SHARE_OF_VIEWPORT } from './use-auto-size.ts';

const LABEL = 'In one sentence, what you expect';
const DRAFT = [
  'Hello Jeanne,',
  'Thank you for your request about the Boulangerie du Port.',
  'Before the offer, two questions.',
  'Do you want customers to order online, or only to see the opening hours?',
  'Do you already have photos of the shop and of the bread?',
  'With these answers, the offer reaches you within two days.',
  'Have a good day,',
  'Bram',
].join('\n');
// The computer of the test runs, which a story pins to keep its text on the lines it is written on.
const DESKTOP = { value: 'desktop' };
const ROWS = 3;
const MORE_LINES = '{Enter}One more line.{Enter}And another.{Enter}And a last one.';
const MANY_LINES = Array.from({ length: 60 }, (_, index) => `Line ${index + 1}`).join('\n');

/** The text is all in view: the field is as tall as it, without a scrollbar. */
async function expectNoInnerScroll(textArea: HTMLElement): Promise<void> {
  await expect(textArea.scrollHeight).toBeLessThanOrEqual(textArea.clientHeight);
  await expect(getComputedStyle(textArea).overflowY).toBe('hidden');
}

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
    await expect(getComputedStyle(textArea).resize).toBe('none');
    await expectBodyText(textArea);
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

function asTextArea(textArea: HTMLElement): HTMLTextAreaElement {
  if (!(textArea instanceof HTMLTextAreaElement)) {
    throw new Error('The field is a textarea.');
  }
  return textArea;
}

// An agent's draft, a reply of eight lines, on the computer the operator reads it on: the field
// fits it, then grows as the operator writes.
export const LongDraft: Story = {
  args: { defaultValue: DRAFT },
  globals: { viewport: DESKTOP },
  play: async ({ canvas }) => {
    const textArea = asTextArea(canvas.getByRole('textbox', { name: /In one sentence/ }));
    await document.fonts.ready;
    await expectNoInnerScroll(textArea);
    const lineHeight = Number.parseFloat(getComputedStyle(textArea).lineHeight);
    await expect(textArea.clientHeight).toBeGreaterThan(lineHeight * DRAFT.split('\n').length);
    const fitted = textArea.clientHeight;

    await userEvent.click(textArea);
    textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    await userEvent.keyboard(MORE_LINES);
    await expect(textArea.clientHeight).toBeGreaterThan(fitted);
    await expectNoInnerScroll(textArea);
  },
};

// Longer than most of the screen: the field stops at its bound and scrolls; emptied without an
// event, as a form's reset does, it goes back to its rows.
export const AtItsBound: Story = {
  args: { rows: ROWS, defaultValue: MANY_LINES },
  play: async ({ canvas }) => {
    const textArea = asTextArea(canvas.getByRole('textbox', { name: /In one sentence/ }));
    const bound = window.innerHeight * MAX_HEIGHT_SHARE_OF_VIEWPORT;
    const lineHeight = Number.parseFloat(getComputedStyle(textArea).lineHeight);
    const height = textArea.getBoundingClientRect().height;
    await expect(height).toBeLessThanOrEqual(bound);
    await expect(height).toBeGreaterThan(bound - lineHeight);
    await expect(getComputedStyle(textArea).overflowY).toBe('auto');
    await expect(textArea.scrollHeight).toBeGreaterThan(textArea.clientHeight);

    textArea.value = '';
    await waitFor(() => expect(textArea.getBoundingClientRect().height).toBeLessThan(height));
    await expectHeightAtLeast(textArea, 'button-height');
    await expectNoInnerScroll(textArea);
    await expect(textArea.clientHeight).toBeLessThan(lineHeight * (ROWS + 2));
  },
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
