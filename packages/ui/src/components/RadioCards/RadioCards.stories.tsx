import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import {
  expectCardStates,
  expectColumns,
  expectOneColumn,
} from '../../testing/expect-choice-cards.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { ChoiceDetailPlacement } from '../ChoiceCard/choice-card.ts';
import { ChoiceColumns } from '../ChoiceCard/choice-grid.ts';
import { RadioCards } from './RadioCards.tsx';

const SOMETHING_ELSE = 'Something else…';
const SPECIFY = 'Specify "Something else"';
const SPECIFY_PLACEHOLDER = 'E.g. a second shop, a stand at the market';

// REF-T6-B02-Situation-D and -M: the first question of the request.
const meta = {
  title: 'Forms/RadioCards',
  component: RadioCards,
  args: {
    legend: 'Where do you stand?',
    description: 'Choose what is most like you. If nothing quite fits, say it in your own words.',
    options: [
      {
        value: 'modernize',
        label: 'I have a website to modernize',
        description: 'For example: it is ten years old, it is slow, it looks dated.',
      },
      {
        value: 'none',
        label: 'I do not have a website yet',
        description: 'For example: a Facebook page, a Google listing, nothing else.',
      },
      {
        value: 'update',
        label: 'My website needs updating',
        description: 'For example: prices, pages, photos to change, without redoing it all.',
      },
      {
        value: 'cheaper',
        label: 'I want to pay less for my website',
        description: 'For example: an agency or hosting subscription that costs too much.',
      },
      {
        value: 'other-project',
        label: 'I have another project',
        description:
          'For example: an online shop, an app, a tool for your team. It is not our usual path: we study it ourselves.',
        isSetApart: true,
      },
      { value: 'something-else', label: SOMETHING_ELSE },
    ],
    detail: {
      forValues: ['something-else'],
      label: SPECIFY,
      placement: ChoiceDetailPlacement.beside,
      placeholder: SPECIFY_PLACEHOLDER,
      maxLength: 200,
      onValueChange: fn(),
    },
    onValueChange: fn(),
  },
} satisfies Meta<typeof RadioCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Situation: Story = {
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('radiogroup', { name: 'Where do you stand?' });
    const modernize = canvas.getByRole('radio', { name: /I have a website to modernize/ });
    const none = canvas.getByRole('radio', { name: /I do not have a website yet/ });
    const somethingElse = canvas.getByRole('radio', { name: SOMETHING_ELSE });
    const somethingElseCell = somethingElse.closest('label')?.parentElement;
    await expectColumns(group, [modernize, none]);
    await expectHeightAtLeast(somethingElse.closest('label') ?? somethingElse, 'button-height');
    await expect(canvas.queryByRole('textbox')).toBeNull();
    await expect(somethingElse).not.toHaveAttribute('aria-controls');
    await expect(somethingElseCell?.nextElementSibling).toBeNull();

    await userEvent.click(none);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('none');
    await expect(none).toHaveFocus();
    await expectCardStates(none, modernize);
    await expect(canvas.queryByRole('textbox')).toBeNull();

    await userEvent.click(somethingElse);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('something-else');
    const specify = await canvas.findByRole('textbox', { name: SPECIFY });
    await expect(somethingElse).toHaveAttribute('aria-controls', specify.id);
    await expect(specify).toHaveAttribute('placeholder', SPECIFY_PLACEHOLDER);
    await expect(specify).toHaveFocus();
    await userEvent.keyboard('A second shop{ArrowLeft}{ArrowRight}{ArrowRight}');
    await expect(specify).toHaveFocus();
    await expect(args.detail?.onValueChange).toHaveBeenLastCalledWith('A second shop');

    await userEvent.tab({ shift: true });
    await expectFocusRing(somethingElse);
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('radio', { name: /I have another project/ })).toBeChecked();
    await expect(canvas.queryByRole('textbox')).toBeNull();
    await expect(somethingElse).not.toHaveAttribute('aria-controls');
    await userEvent.keyboard('{ArrowDown}');
    await expect(somethingElse).toBeChecked();
    await expect(somethingElse).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: SPECIFY })).toHaveValue('A second shop');
  },
};

// REF-T6-B08-Delai-D: short answers, and a field under them that details two of them.
export const Timing: Story = {
  args: {
    legend: 'When for?',
    description: undefined,
    options: [
      { value: 'no-rush', label: 'No rush' },
      { value: 'coming-months', label: 'In the coming months' },
      { value: 'period', label: 'For a specific period…' },
      { value: 'other', label: 'Other…' },
    ],
    detail: {
      forValues: ['period', 'other'],
      label: 'Which one? Or specify',
      isLabelVisible: true,
      placement: ChoiceDetailPlacement.below,
      defaultValue: 'Before the end-of-year holidays, if possible',
    },
  },
  play: async ({ canvas }) => {
    const period = canvas.getByRole('radio', { name: 'For a specific period…' });
    await expectHeightAtLeast(period.closest('label') ?? period, 'button-height');
    await expect(canvas.queryByText('Which one? Or specify')).toBeNull();

    await userEvent.click(period);
    const specify = await canvas.findByRole('textbox', { name: 'Which one? Or specify' });
    await expect(canvas.getByText('Which one? Or specify')).toBeVisible();
    await expect(specify).toHaveFocus();
    await expect(specify.getBoundingClientRect().width).toBe(
      canvas.getByRole('radiogroup').getBoundingClientRect().width,
    );

    await userEvent.click(canvas.getByRole('radio', { name: 'No rush' }));
    await expect(canvas.queryByRole('textbox')).toBeNull();
    await expect(canvas.queryByText('Which one? Or specify')).toBeNull();

    await userEvent.click(canvas.getByRole('radio', { name: 'Other…' }));
    await expect(await canvas.findByRole('textbox', { name: 'Which one? Or specify' })).toHaveValue(
      'Before the end-of-year holidays, if possible',
    );
  },
};

// C-26-OffrePistes, the list form: an offer's subscriptions, one per row on every width.
export const Subscriptions: Story = {
  args: {
    legend: 'The subscription',
    description: 'Choose how your site is looked after once it is online.',
    columns: ChoiceColumns.one,
    options: [
      {
        value: 'base',
        label: 'The Base subscription',
        description: 'Hosting, updates and one change a month.',
      },
      {
        value: 'premium',
        label: 'The Premium subscription',
        description: 'Hosting, updates and five changes a month, handled first.',
      },
      {
        value: 'none',
        label: 'No subscription',
        description: 'You, or your provider, look after the site.',
      },
    ],
    defaultValue: 'base',
    detail: undefined,
  },
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('radiogroup', { name: 'The subscription' });
    const base = canvas.getByRole('radio', { name: /The Base subscription/ });
    const premium = canvas.getByRole('radio', { name: /The Premium subscription/ });
    const none = canvas.getByRole('radio', { name: /No subscription/ });
    await expectOneColumn(group, [base, premium]);
    await expectOneColumn(group, [premium, none]);
    await expectCardStates(base, premium);

    await userEvent.click(premium);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('premium');
    await expectCardStates(premium, base);
    await userEvent.keyboard('{ArrowDown}');
    await expect(none).toBeChecked();
    await expectFocusRing(none);
  },
};

// The answer that asks for words, chosen: its field beside it, with the app's hint inside.
export const SomethingElseChosen: Story = {
  args: { defaultValue: 'something-else' },
  play: async ({ canvas }) => {
    const somethingElse = canvas.getByRole('radio', { name: SOMETHING_ELSE });
    const specify = canvas.getByRole('textbox', { name: SPECIFY });
    await expect(specify).toBeVisible();
    await expect(specify).toHaveAttribute('placeholder', SPECIFY_PLACEHOLDER);
    await expect(somethingElse).toHaveAttribute('aria-controls', specify.id);
    await expect(specify).not.toHaveFocus();
  },
};

export const WithErrors: Story = {
  args: {
    defaultValue: 'something-else',
    error: 'Choose what is most like you.',
    detail: {
      forValues: ['something-else'],
      label: SPECIFY,
      placement: ChoiceDetailPlacement.beside,
      error: 'Say it in a few words.',
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Choose what is most like you.')).toBeVisible();
    const specify = canvas.getByRole('textbox', { name: SPECIFY });
    await expect(specify).toHaveAttribute('aria-invalid', 'true');
    // Base UI adds the group's help and error to the description of a field inside it.
    await expect(specify).toHaveAccessibleDescription(
      expect.stringContaining('Say it in a few words.'),
    );
  },
};

export const Disabled: Story = {
  args: { defaultValue: 'something-else', disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('radio', { name: SOMETHING_ELSE })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await expect(canvas.getByRole('textbox', { name: SPECIFY })).toBeDisabled();
  },
};
