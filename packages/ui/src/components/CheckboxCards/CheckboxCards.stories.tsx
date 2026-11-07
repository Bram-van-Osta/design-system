import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import {
  expectCardStates,
  expectColumns,
  expectOneColumn,
} from '../../testing/expect-choice-cards.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { ChoiceColumns, ChoiceSize } from '../ChoiceCard/choice-grid.ts';
import { CheckboxCards } from './CheckboxCards.tsx';

const SPECIFY = 'Specify "Other"';
const SPECIFY_PLACEHOLDER = 'E.g. my opening hours change every season';

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
      placeholder: SPECIFY_PLACEHOLDER,
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
    await expectColumns(group, [information, aging]);
    await expectHeightAtLeast(aging.closest('label') ?? aging, 'button-height');
    await expect(canvas.queryByRole('textbox')).toBeNull();
    await expect(other).not.toHaveAttribute('aria-controls');
    await expect(other.closest('label')?.parentElement?.nextElementSibling).toBeNull();

    await userEvent.tab();
    await expectFocusRing(information);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['information']);
    await expectCardStates(information, aging);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'I want to take orders' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['information', 'orders']);

    await userEvent.click(other);
    const specify = await canvas.findByRole('textbox', { name: SPECIFY });
    await expect(other).toHaveAttribute('aria-controls', specify.id);
    await expect(specify).toHaveAttribute('placeholder', SPECIFY_PLACEHOLDER);
    await expect(specify).toHaveFocus();
    await userEvent.keyboard('The Sunday cake list');
    await expect(args.detail?.onValueChange).toHaveBeenLastCalledWith('The Sunday cake list');
    await expect(specify.getBoundingClientRect().width).toBe(group.getBoundingClientRect().width);

    await userEvent.click(other);
    await expect(other).not.toBeChecked();
    await expect(canvas.queryByRole('textbox')).toBeNull();
    await expect(other).not.toHaveAttribute('aria-controls');

    await userEvent.keyboard(' ');
    await expect(other).toBeChecked();
    await expect(await canvas.findByRole('textbox', { name: SPECIFY })).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: SPECIFY })).toHaveValue(
      'The Sunday cake list',
    );
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
    defaultValue: ['quote', 'other'],
    detail: {
      forValues: ['other'],
      label: 'Specify if you wish',
      isLabelVisible: true,
      placeholder: 'E.g. a booking page for the workshops',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Specify if you wish')).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Specify if you wish' })).toHaveAttribute(
      'placeholder',
      'E.g. a booking page for the workshops',
    );
    await expect(canvas.getByRole('checkbox', { name: 'A quote' })).toBeChecked();
  },
};

// C-26-OffrePistes, the list form: an offer's extras, one per row on every width.
export const Extras: Story = {
  args: {
    legend: 'If you wish',
    description: 'Paid once, like the creation.',
    columns: ChoiceColumns.one,
    options: [
      {
        value: 'photos',
        label: 'A photo session',
        description: 'Your shop and your products, by a photographer, for the site.',
      },
      {
        value: 'texts',
        label: 'The texts written for you',
        description: 'Every page written from an interview, in your words.',
      },
    ],
    detail: undefined,
  },
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: /If you wish/ });
    const photos = canvas.getByRole('checkbox', { name: /A photo session/ });
    const texts = canvas.getByRole('checkbox', { name: /The texts written for you/ });
    await expectOneColumn(group, [photos, texts]);

    await userEvent.click(texts);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['texts']);
    await expectCardStates(texts, photos);
  },
};

export const WithError: Story = {
  args: { error: 'Tick at least one answer, or skip the question.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Tick at least one answer, or skip the question.')).toBeVisible();
  },
};

export const Disabled: Story = {
  args: { defaultValue: ['aging', 'other'], disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'My website is aging' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(canvas.getByRole('textbox', { name: SPECIFY })).toBeDisabled();
  },
};

// Compact cards: 48 px high at least, their labels in 15 px semibold, 8 px apart.
const COMPACT_MIN_HEIGHT = 48;
const COMPACT = { fontSize: '15px', fontWeight: '600', gap: '8px' } as const;

function cardOfControl(control: HTMLElement): HTMLElement {
  const card = control.closest('label');
  if (card === null) {
    throw new Error('A choice card is the label around its control.');
  }
  return card;
}

async function expectCompactCard(control: HTMLElement): Promise<void> {
  const card = cardOfControl(control);
  const style = getComputedStyle(card);
  await expect(card.getBoundingClientRect().height).toBeGreaterThanOrEqual(COMPACT_MIN_HEIGHT);
  await expect({
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    gap: getComputedStyle(card.parentElement?.parentElement ?? card).rowGap,
  }).toEqual(COMPACT);
}

// T14-Q05-Juger-D and -M: why a sentence does not suit, short reasons in two columns on a computer,
// one on a phone.
export const CompactReasons: Story = {
  args: {
    legend: 'Why?',
    description: 'A quick reason is enough.',
    size: ChoiceSize.compact,
    options: [
      { value: 'familiar', label: 'Too familiar' },
      { value: 'long', label: 'Too long' },
      { value: 'unlike', label: 'It does not sound like us' },
      { value: 'other', label: 'Something else…' },
    ],
    detail: { forValues: ['other'], label: 'Say it your way', onValueChange: fn() },
  },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: /Why\?/ });
    const familiar = canvas.getByRole('checkbox', { name: 'Too familiar' });
    const long = canvas.getByRole('checkbox', { name: 'Too long' });
    await expectColumns(group, [familiar, long]);
    await expectCompactCard(familiar);
    await expect(cardOfControl(familiar).getBoundingClientRect().height).toBe(COMPACT_MIN_HEIGHT);
    await userEvent.click(long);
    await expectCardStates(long, familiar);
  },
};

// T14-Q07-Inspirations-D and -M: what the client likes in a site, single words in three columns on
// a computer, two on a phone.
export const CompactAspects: Story = {
  args: {
    legend: 'What you like',
    description: undefined,
    size: ChoiceSize.compact,
    columns: ChoiceColumns.three,
    options: [
      { value: 'colors', label: 'The colors' },
      { value: 'lettering', label: 'The lettering' },
      { value: 'photos', label: 'The photos' },
      { value: 'simplicity', label: 'The simplicity' },
      { value: 'mood', label: 'The mood' },
      { value: 'other', label: 'Something else…' },
    ],
    detail: undefined,
  },
  play: async ({ canvas }) => {
    const top = (name: string) =>
      cardOfControl(canvas.getByRole('checkbox', { name })).getBoundingClientRect().top;
    await expect(top('The lettering')).toBe(top('The colors'));
    const third = top('The photos');
    if (isOnAComputer()) {
      await expect(third).toBe(top('The colors'));
      await expect(top('The simplicity')).toBeGreaterThan(top('The colors'));
    } else {
      await expect(third).toBeGreaterThan(top('The colors'));
    }
    await expectCompactCard(canvas.getByRole('checkbox', { name: 'The colors' }));
  },
};
