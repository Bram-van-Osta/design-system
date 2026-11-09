import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { tokenColor } from '../../testing/token-color.ts';
import { CheckboxCards } from '../CheckboxCards/CheckboxCards.tsx';
import { Field } from '../Field/Field.tsx';
import { FieldMarker } from '../Field/field-marker.ts';
import { TextInput } from '../TextInput/TextInput.tsx';
import { SourceMark } from './SourceMark.tsx';

const PHONE = { value: 'mobile1' };
const FROM_YOUR_TEXT = 'from your text';
const SELECTED_BORDER = '2px';
const MARK_SIZE = '12px';

async function expectMark(mark: HTMLElement): Promise<void> {
  const { color, fontFamily, fontSize } = getComputedStyle(mark);
  await expect(color).toBe(tokenColor('delft', mark));
  await expect(fontFamily).toContain('IBM Plex Mono');
  await expect(fontSize).toBe(MARK_SIZE);
}

// T12-M3-Clients-D and T12-M4-EnLigne-D: where an answer comes from, ticked or filled for the reader
// from their own words.
const meta = {
  title: 'Forms/SourceMark',
  component: SourceMark,
  args: { children: FROM_YOUR_TEXT },
} satisfies Meta<typeof SourceMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = {
  play: async ({ canvas }) => {
    await expectMark(canvas.getByText(FROM_YOUR_TEXT));
  },
};

// Two answers ticked from the text, each card selected with its mark under its label.
export const OnACard: Story = {
  render: () => (
    <div className="max-w-reading-width">
      <CheckboxCards
        legend="What must your customers be able to do on your site?"
        marker={FieldMarker.optional}
        description="We ticked what your text says. Add what matters too, even a little."
        defaultValue={['hours', 'order']}
        options={[
          { value: 'hours', label: 'Find your hours and come', source: FROM_YOUR_TEXT },
          { value: 'order', label: 'Order', source: FROM_YOUR_TEXT },
          { value: 'book', label: 'Book' },
          { value: 'call', label: 'Call you in one tap' },
          { value: 'quote', label: 'Ask for a quote' },
          { value: 'products', label: 'Discover your products' },
          { value: 'write', label: 'Write to you' },
          { value: 'other', label: 'Other…' },
        ]}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    const hours = canvas.getByRole('checkbox', { name: /Find your hours and come/ });
    await expect(hours).toBeChecked();
    await expect(hours).toHaveAccessibleName(`Find your hours and come ${FROM_YOUR_TEXT}`);
    const marks = canvas.getAllByText(FROM_YOUR_TEXT);
    await expect(marks).toHaveLength(2);
    for (const mark of marks) {
      await expectMark(mark);
    }
    const card = hours.closest('label');
    if (card === null) {
      throw new Error('The checkbox sits in its card.');
    }
    const selected = getComputedStyle(card, '::before');
    await expect(selected.borderTopColor).toBe(tokenColor('delft', card));
    await expect(Number.parseFloat(getComputedStyle(card).borderTopWidth) + 1).toBe(
      Number.parseFloat(SELECTED_BORDER),
    );
  },
};

// A field filled from the text: its mark right under it, which describes it.
export const UnderAField: Story = {
  globals: { viewport: PHONE },
  render: () => (
    <div className="flex max-w-reading-width flex-col gap-space-5">
      <Field label="Its name" marker={FieldMarker.required}>
        <TextInput defaultValue="Boulangerie du Port" />
      </Field>
      <Field label="Its activity" source={FROM_YOUR_TEXT} description="As your customers say it.">
        <TextInput defaultValue="Bakery and pastry shop" />
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    const activity = canvas.getByRole('textbox', { name: 'Its activity' });
    await expect(activity).toHaveAccessibleDescription(
      `${FROM_YOUR_TEXT} As your customers say it.`,
    );
    const mark = canvas.getByText(FROM_YOUR_TEXT);
    await expectMark(mark);
    await expect(mark.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      activity.getBoundingClientRect().bottom,
    );
    await expect(
      canvas.getByRole('textbox', { name: /Its name/ }),
    ).not.toHaveAccessibleDescription();
  },
};
