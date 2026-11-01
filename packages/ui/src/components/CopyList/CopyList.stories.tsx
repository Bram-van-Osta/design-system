import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { CopyList } from './CopyList.tsx';

const IBAN = 'FR76 3000 6000 0112 3456 7890 189';
const COPIED_DURATION_TIMEOUT_MS = 3000;

function statusOf(button: HTMLElement): HTMLElement {
  const row = button.closest('li');
  if (row === null) {
    throw new Error('The button is in a row of the list.');
  }
  return within(row).getByRole('status');
}

// REF-T8-07-Acompte: the details of the deposit's transfer.
const meta = {
  title: 'Layout/CopyList',
  component: CopyList,
  args: {
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    items: [
      { id: 'amount', label: 'Amount', value: '€1,260.00 incl. VAT', copyValue: '1260.00' },
      { id: 'beneficiary', label: 'Beneficiary', value: 'Bram van Osta' },
      { id: 'iban', label: 'IBAN', value: IBAN, copyValue: IBAN.replaceAll(' ', '') },
      { id: 'bic', label: 'BIC', value: 'EXMPFRPPXXX' },
      { id: 'reference', label: 'Reference to give', value: 'BVO-PORT-0001' },
    ],
  },
} satisfies Meta<typeof CopyList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BankDetails: Story = {
  play: async ({ canvas }) => {
    const user = userEvent.setup();
    const list = canvas.getByRole('list');
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
    await expect(getComputedStyle(canvas.getByText(IBAN)).fontFamily).toContain('IBM Plex Mono');
    const buttons = canvas.getAllByRole('button', { name: /^Copy / });
    await expect(buttons).toHaveLength(5);
    for (const button of buttons) {
      await expectHeightAtLeast(button, 'target-min');
    }

    await user.tab();
    await expectFocusRing(canvas.getByRole('button', { name: 'Copy Amount' }));
    const copyIban = canvas.getByRole('button', { name: 'Copy IBAN' });
    await user.click(copyIban);
    await expect(await navigator.clipboard.readText()).toBe('FR7630006000011234567890189');
    await expect(copyIban).toHaveAccessibleName('Copied IBAN');
    await expect(statusOf(copyIban)).toHaveTextContent('Copied');
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Copy IBAN' })).toBeVisible(), {
      timeout: COPIED_DURATION_TIMEOUT_MS,
    });
  },
};

// A browser that refuses the clipboard: the value is selected, for the reader to copy it.
export const ClipboardRefused: Story = {
  play: async ({ canvas }) => {
    const user = userEvent.setup();
    spyOn(navigator.clipboard, 'writeText').mockRejectedValue(
      new DOMException('', 'NotAllowedError'),
    );
    const copyIban = canvas.getByRole('button', { name: 'Copy IBAN' });
    await user.click(copyIban);
    await waitFor(() => expect(window.getSelection()?.toString()).toBe(IBAN));
    await expect(copyIban).toHaveAccessibleName('Copy IBAN');
    await expect(statusOf(copyIban)).toBeEmptyDOMElement();
  },
};
