import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Button } from '../Button/Button.tsx';
import { CopyList } from '../CopyList/CopyList.tsx';
import { Text, TextTone, TextVariant } from '../Text/Text.tsx';
import { ActionCard } from './ActionCard.tsx';

// Tailwind's md breakpoint, from which the card takes the computer's padding.
const COMPUTER_QUERY = '(min-width: 48rem)';

// REF-T8-09-AcompteRecu-O: the deposit the operator waits for.
const meta = {
  title: 'Layout/ActionCard',
  component: ActionCard,
  args: {
    kicker: 'The deposit · expected',
    children: (
      <Text>
        €1,260.00 incl. VAT, with the reference BVO-PORT-0001, for the Boulangerie du Port.
      </Text>
    ),
    actions: (
      <>
        <Button onClick={fn()}>Mark as received</Button>
        <Text variant={TextVariant.bodySmall} tone={TextTone.muted}>
          You give the day of the transfer; the client sees "deposit received".
        </Text>
      </>
    ),
  },
  argTypes: {
    children: { control: false },
    actions: { control: false },
  },
} satisfies Meta<typeof ActionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DepositExpected: Story = {
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region', { name: 'The deposit · expected' });
    const style = getComputedStyle(card);
    await expect(Number.parseFloat(style.borderTopWidth)).toBe(tokenPixels('border-attention'));
    await expect(style.borderTopColor).toBe(tokenColor('vermillion', card));
    await expect(style.backgroundColor).toBe(tokenColor('surface', card));
    await expect(style.borderRadius).toBe('0px');
    await expect(style.boxShadow).toBe('none');
    const padding = window.matchMedia(COMPUTER_QUERY).matches ? 'space-6' : 'space-5';
    await expect(style.paddingLeft).toBe(
      getComputedStyle(card).getPropertyValue(`--${padding}`).trim(),
    );

    const button = canvas.getByRole('button', { name: 'Mark as received' });
    await expectHeightAtLeast(button, 'button-height');
    await userEvent.tab();
    await expectFocusRing(button);
  },
};

// REF-T8-07-Acompte: the client's side, with its heading and the details to copy.
export const PayTheDeposit: Story = {
  args: {
    kicker: 'What depends on you · whenever you like',
    heading: 'Pay the deposit by transfer.',
    children: (
      <>
        <Text tone={TextTone.muted}>
          30% of the creation. No rush: the questionnaire opens without waiting for your transfer.
        </Text>
        <CopyList
          copyLabel="Copy"
          copiedLabel="Copied"
          items={[
            { id: 'amount', label: 'Amount', value: '€1,260.00 incl. VAT', copyValue: '1260.00' },
            { id: 'iban', label: 'IBAN', value: 'FR76 3000 6000 0112 3456 7890 189' },
            { id: 'reference', label: 'Reference to give', value: 'BVO-PORT-0001' },
          ]}
        />
      </>
    ),
    actions: undefined,
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('region', { name: 'Pay the deposit by transfer.' }),
    ).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Pay the deposit by transfer.',
    );
  },
};
