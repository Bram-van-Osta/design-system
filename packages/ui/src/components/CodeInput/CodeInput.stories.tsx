import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectErrorColors } from '../../testing/expect-error-colors.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Field } from '../Field/Field.tsx';
import { CodeInput } from './CodeInput.tsx';

const LABEL = 'The six-digit code';
const WRONG_CODE = 'This code does not match. Check it: you have three tries left.';

function cellsOf(input: HTMLElement): readonly HTMLElement[] {
  return Array.from(input.parentElement?.querySelectorAll('span') ?? []);
}

function textsOf(input: HTMLElement): readonly string[] {
  return cellsOf(input).map((cell) => cell.textContent ?? '');
}

// The identity's focus, 2 px offset by 2 px, on the cell the next digit goes in, and on no other.
async function expectRingOn(input: HTMLElement, position: number): Promise<void> {
  await expect(input).toHaveFocus();
  const rings = cellsOf(input).map((cell) => {
    const { outlineStyle, outlineWidth, outlineOffset } = getComputedStyle(cell);
    return outlineStyle === 'solid' && outlineWidth === '2px' && outlineOffset === '2px';
  });
  await expect(rings.indexOf(true)).toBe(position);
  await expect(rings.lastIndexOf(true)).toBe(position);
}

// REF-T8-03-Code: the code that accepts the offer, sent by mail.
const meta = {
  title: 'Forms/CodeInput',
  component: CodeInput,
  args: { onValueChange: fn() },
  render: (args) => (
    <Field label={LABEL}>
      <CodeInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas, args }) => {
    const input = canvas.getByRole('textbox', { name: LABEL });
    await expect(input).toHaveAttribute('inputmode', 'numeric');
    await expect(input).toHaveAttribute('autocomplete', 'one-time-code');
    await expectHeightAtLeast(input, 'target-min');
    const row = input.parentElement;
    await expect(row?.scrollWidth).toBeLessThanOrEqual(row?.parentElement?.clientWidth ?? 0);

    await userEvent.tab();
    await expectRingOn(input, 0);
    await userEvent.keyboard('4a8 1');
    await expect(input).toHaveValue('481');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('481');
    await expect(textsOf(input)).toEqual(['4', '8', '1', '', '', '']);
    await expectRingOn(input, 3);

    await userEvent.keyboard('{Backspace}');
    await expect(input).toHaveValue('48');
    await expectRingOn(input, 2);
    await userEvent.keyboard('{ArrowLeft}');
    await expectRingOn(input, 1);
    await userEvent.keyboard('{Backspace}');
    await expect(input).toHaveValue('8');
    await expectRingOn(input, 0);
  },
};

export const Pasted: Story = {
  play: async ({ canvas, args }) => {
    const user = userEvent.setup();
    const input = canvas.getByRole('textbox', { name: LABEL });
    await user.click(input);
    await user.paste('481 290');
    await expect(input).toHaveValue('481290');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('481290');
    await expectRingOn(input, 5);

    await user.paste('Your code: 735-102');
    await expect(input).toHaveValue('735102');
    await user.keyboard('9');
    await expect(input).toHaveValue('735102');
  },
};

// The code the person started to type: the next digits go after it.
export const PartlyTyped: Story = {
  args: { defaultValue: '4812' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: LABEL });
    await expect(textsOf(input)).toEqual(['4', '8', '1', '2', '', '']);
    await userEvent.tab();
    await expectRingOn(input, 4);
    await userEvent.keyboard('90');
    await expect(input).toHaveValue('481290');
  },
};

// REF-T8-04-CodeFaux: a code that does not match.
export const Wrong: Story = {
  args: { defaultValue: '481290' },
  render: (args) => (
    <Field label={LABEL} error={WRONG_CODE}>
      <CodeInput {...args} />
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: LABEL });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(WRONG_CODE);
    await expectErrorColors(canvas.getByText(WRONG_CODE));
    for (const cell of cellsOf(input)) {
      const { borderTopWidth, borderTopColor } = getComputedStyle(cell);
      await expect(Number.parseFloat(borderTopWidth)).toBe(tokenPixels('border-select'));
      await expect(borderTopColor).toBe(tokenColor('ink', cell));
    }
  },
};

export const Disabled: Story = {
  args: { defaultValue: '4812', disabled: true },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: LABEL });
    await expect(input).toBeDisabled();
    const [cell] = cellsOf(input);
    if (cell !== undefined) {
      await expect(getComputedStyle(cell).backgroundColor).toBe(tokenColor('surface', cell));
    }
  },
};
