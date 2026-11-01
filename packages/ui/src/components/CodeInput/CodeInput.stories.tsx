import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';
import { interpolate } from '../../i18n/interpolate.ts';
import { Locale, MESSAGES } from '../../i18n/messages.ts';
import { expectErrorColors } from '../../testing/expect-error-colors.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { Field } from '../Field/Field.tsx';
import { CodeInput, type CodeInputProps } from './CodeInput.tsx';
import { CODE_LENGTH } from './code-digits.ts';

const LABEL = 'The six-digit code';
const WRONG_CODE = 'This code does not match. Check it: you have three tries left.';
const SEND_AGAIN = 'Send the code again';

function slotsOf(canvasElement: HTMLElement): readonly HTMLInputElement[] {
  return Array.from(canvasElement.querySelectorAll('input:not([aria-hidden])')).filter(
    (slot): slot is HTMLInputElement => slot instanceof HTMLInputElement,
  );
}

function codeOf(canvasElement: HTMLElement): string {
  return slotsOf(canvasElement)
    .map((slot) => slot.value)
    .join('');
}

function slotOf(canvasElement: HTMLElement, position: number): HTMLInputElement {
  const slot = slotsOf(canvasElement)[position - 1];
  if (slot === undefined) {
    throw new Error(`The code input has a slot ${position}.`);
  }
  return slot;
}

// What the keyboard's suggestion or a drop does: one input event that brings the whole text.
function insertInto(slot: HTMLInputElement, text: string, inputType: string): void {
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setValue?.call(slot, `${slot.value}${text}`);
  slot.setSelectionRange(slot.value.length, slot.value.length);
  slot.dispatchEvent(new InputEvent('input', { bubbles: true, inputType, data: text }));
}

function slotName(locale: unknown, position: number): string {
  const messages = MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en];
  return interpolate(messages['codeInput.slot'], { position, count: CODE_LENGTH });
}

// The app's side: it holds the code, and empties it when a new one is sent.
function ControlledCodeInput(props: CodeInputProps) {
  const [code, setCode] = useState('');
  return (
    <div className="flex flex-col gap-space-4">
      <Field label={LABEL}>
        <CodeInput
          {...props}
          value={code}
          onValueChange={(nextCode) => {
            props.onValueChange?.(nextCode);
            setCode(nextCode);
          }}
        />
      </Field>
      <div>
        <Button variant={ButtonVariant.secondary} onClick={() => setCode('')}>
          {SEND_AGAIN}
        </Button>
      </div>
    </div>
  );
}

// REF-T8-03-Code: the code that accepts the offer, sent by mail.
const meta = {
  title: 'Forms/CodeInput',
  component: CodeInput,
  args: { onValueChange: fn(), onComplete: fn() },
  render: (args) => (
    <Field label={LABEL}>
      <CodeInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas, canvasElement, args, globals }) => {
    await expect(canvas.getByRole('group', { name: LABEL })).toBeVisible();
    const first = canvas.getByRole('textbox', { name: LABEL });
    await expect(first).toHaveAttribute('inputmode', 'numeric');
    await expect(first).toHaveAttribute('autocomplete', 'one-time-code');
    await expect(canvas.getByRole('textbox', { name: slotName(globals.locale, 6) })).toBe(
      slotOf(canvasElement, 6),
    );
    for (const slot of slotsOf(canvasElement)) {
      await expectHeightAtLeast(slot, 'target-min');
    }
    const row = first.parentElement;
    await expect(row?.scrollWidth).toBeLessThanOrEqual(row?.parentElement?.clientWidth ?? 0);

    await userEvent.tab();
    await expectFocusRing(first);
    await userEvent.keyboard('4a8 1');
    await expect(codeOf(canvasElement)).toBe('481');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('481');
    await expectFocusRing(slotOf(canvasElement, 4));

    await userEvent.keyboard('{Backspace}');
    await expect(codeOf(canvasElement)).toBe('48');
    await userEvent.keyboard('{ArrowLeft}');
    await expectFocusRing(slotOf(canvasElement, 2));
    await expect(args.onComplete).not.toHaveBeenCalled();
  },
};

export const Pasted: Story = {
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    await user.click(slotOf(canvasElement, 1));
    await user.paste('481 290');
    await expect(codeOf(canvasElement)).toBe('481290');
    await expect(args.onComplete).toHaveBeenLastCalledWith('481290');

    await user.click(slotOf(canvasElement, 6));
    await user.paste('Your code: 735-102');
    await expect(codeOf(canvasElement)).toBe('735102');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('735102');
  },
};

// The code the person started to type: the next digits go after it.
export const PartlyTyped: Story = {
  args: { defaultValue: '4812' },
  play: async ({ canvasElement }) => {
    await expect(codeOf(canvasElement)).toBe('4812');
    await userEvent.tab();
    await expectFocusRing(slotOf(canvasElement, 5));
    await userEvent.keyboard('90');
    await expect(codeOf(canvasElement)).toBe('481290');
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
  play: async ({ canvas, canvasElement }) => {
    const first = canvas.getByRole('textbox', { name: LABEL });
    await expect(first).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('group', { name: LABEL })).toHaveAccessibleDescription(
      WRONG_CODE,
    );
    await expectErrorColors(canvas.getByText(WRONG_CODE));
    for (const slot of slotsOf(canvasElement)) {
      const { borderTopWidth, borderTopColor } = getComputedStyle(slot);
      await expect(Number.parseFloat(borderTopWidth)).toBe(tokenPixels('border-select'));
      await expect(borderTopColor).toBe(tokenColor('ink', canvasElement));
    }
  },
};

// The right code over the wrong one: offered by the keyboard, or dropped, in any slot.
export const WrongThenANewCode: Story = {
  args: { defaultValue: '481290' },
  render: Wrong.render,
  play: async ({ canvasElement, args }) => {
    const user = userEvent.setup();
    await user.click(slotOf(canvasElement, 6));
    insertInto(slotOf(canvasElement, 6), '735102', 'insertReplacementText');
    await expect(codeOf(canvasElement)).toBe('735102');
    await expect(args.onComplete).toHaveBeenLastCalledWith('735102');

    await user.click(slotOf(canvasElement, 3));
    insertInto(slotOf(canvasElement, 3), '204816', 'insertFromDrop');
    await expect(codeOf(canvasElement)).toBe('204816');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('204816');
  },
};

// The app holds the code: here, sending a new code empties the slots.
export const Controlled: Story = {
  render: (args) => <ControlledCodeInput {...args} />,
  play: async ({ canvas, canvasElement, args }) => {
    await userEvent.click(slotOf(canvasElement, 1));
    await userEvent.keyboard('481290');
    await expect(codeOf(canvasElement)).toBe('481290');
    await expect(args.onComplete).toHaveBeenCalledWith('481290');
    await userEvent.click(canvas.getByRole('button', { name: SEND_AGAIN }));
    await expect(codeOf(canvasElement)).toBe('');
  },
};

export const Disabled: Story = {
  args: { defaultValue: '4812', disabled: true },
  play: async ({ canvasElement }) => {
    for (const slot of slotsOf(canvasElement)) {
      await expect(slot).toBeDisabled();
      await expect(getComputedStyle(slot).backgroundColor).toBe(
        tokenColor('surface', canvasElement),
      );
    }
  },
};
