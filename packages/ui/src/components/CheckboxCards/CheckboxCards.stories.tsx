import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectCardStates, expectColumns } from '../../testing/expect-choice-cards.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { CheckboxCards } from './CheckboxCards.tsx';

const SPECIFY = 'Specify "Other"';

// REF-T6-B03-Pourquoi-D: what makes the business decide now.
const meta = {
  title: 'Forms/CheckboxCards',
  component: CheckboxCards,
  args: {
    legend: 'What makes you decide now?',
    description: 'Tick everything that matters, even a little. Every detail helps us aim right.',
    options: [
      { value: 'information', label: 'My customers cannot find the information' },
      { value: 'aging', label: 'My website is aging' },
      { value: 'orders', label: 'I want to take orders' },
      { value: 'cost', label: 'It costs me too much' },
      { value: 'opening', label: 'An opening, a move' },
      { value: 'editing', label: 'I cannot edit it myself' },
      { value: 'search', label: 'People find me badly on Google' },
      { value: 'other', label: 'Other…' },
    ],
    detail: {
      forValues: ['other'],
      label: SPECIFY,
      maxLength: 200,
      onValueChange: fn(),
    },
    onValueChange: fn(),
  },
} satisfies Meta<typeof CheckboxCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhatDecides: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: /What makes you decide now/ });
    const information = canvas.getByRole('checkbox', { name: /cannot find the information/ });
    const aging = canvas.getByRole('checkbox', { name: 'My website is aging' });
    const other = canvas.getByRole('checkbox', { name: 'Other…' });
    const specify = canvas.getByRole('textbox', { name: SPECIFY });
    await expectColumns(group, [information, aging]);
    await expectHeightAtLeast(aging.closest('label') ?? aging, 'button-height');
    await expect(other).toHaveAttribute('aria-controls', specify.id);

    await userEvent.tab();
    await expectFocusRing(information);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['information']);
    await expectCardStates(information, aging);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'I want to take orders' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['information', 'orders']);

    await userEvent.click(other);
    await expect(specify).toHaveFocus();
    await userEvent.keyboard('The Sunday cake list');
    await expect(args.detail?.onValueChange).toHaveBeenLastCalledWith('The Sunday cake list');
    await expect(specify.getBoundingClientRect().width).toBe(group.getBoundingClientRect().width);
    await userEvent.click(other);
    await expect(other).not.toBeChecked();
    await expect(specify).not.toHaveFocus();
  },
};

// REF-T6-B10-Projet-D: what a project outside the usual path expects, and its visible field.
export const WhatYouExpect: Story = {
  args: {
    legend: 'What you expect from us',
    description: undefined,
    options: [
      { value: 'advice', label: 'Advice' },
      { value: 'quote', label: 'A quote' },
      { value: 'build', label: 'That you build it' },
      { value: 'unsure', label: 'I do not know yet' },
      { value: 'other', label: 'Other…' },
    ],
    defaultValue: ['quote', 'build'],
    detail: { forValues: ['other'], label: 'Specify if you wish', isLabelVisible: true },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Specify if you wish')).toBeVisible();
    await expect(canvas.getByRole('checkbox', { name: 'A quote' })).toBeChecked();
  },
};

export const WithError: Story = {
  args: { error: 'Tick at least one answer, or skip the question.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tick at least one answer, or skip the question.')).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { defaultValue: ['aging'], disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'My website is aging' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(canvas.getByRole('textbox', { name: SPECIFY })).toBeDisabled();
  },
};
