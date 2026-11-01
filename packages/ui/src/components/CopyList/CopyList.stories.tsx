import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { Locale, MESSAGES } from '../../i18n/messages.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { CopyList } from './CopyList.tsx';

const IBAN = 'FR76 3000 6000 0112 3456 7890 189';
const RESULT_TIMEOUT_MS = 3000;

// The component's own texts, in the language of the run.
function textsOf(locale: unknown) {
  const messages = MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en];
  return {
    copy: messages['copyList.copy'],
    copied: messages['copyList.copied'],
    failed: messages['copyList.failed'],
  };
}

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
  play: async ({ canvas, globals }) => {
    const texts = textsOf(globals.locale);
    const user = userEvent.setup();
    const list = canvas.getByRole('list');
    await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth);
    await expect(getComputedStyle(canvas.getByText(IBAN)).fontFamily).toContain('IBM Plex Mono');
    const buttons = canvas.getAllByRole('button', { name: new RegExp(`^${texts.copy} `) });
    await expect(buttons).toHaveLength(5);
    for (const button of buttons) {
      await expectHeightAtLeast(button, 'target-min');
    }

    await user.tab();
    await expectFocusRing(canvas.getByRole('button', { name: `${texts.copy} Amount` }));
    const copyIban = canvas.getByRole('button', { name: `${texts.copy} IBAN` });
    await document.fonts.ready;
    const width = copyIban.getBoundingClientRect().width;
    await user.click(copyIban);
    await expect(await navigator.clipboard.readText()).toBe('FR7630006000011234567890189');
    await expect(copyIban).toHaveAccessibleName(`${texts.copied} IBAN`);
    await expect(copyIban.getBoundingClientRect().width).toBe(width);
    const status = statusOf(copyIban);
    await expect(status).toHaveTextContent(texts.copied);

    // Copied again at once: the announcement is a new one, for screen readers to say it again.
    const announcement = status.firstElementChild;
    await user.click(copyIban);
    await waitFor(() => expect(status.firstElementChild).not.toBe(announcement));
    await expect(status).toHaveTextContent(texts.copied);
    await waitFor(() => expect(copyIban).toHaveAccessibleName(`${texts.copy} IBAN`), {
      timeout: RESULT_TIMEOUT_MS,
    });
  },
};

// A browser that refuses the clipboard: the value shown is selected, and the failure announced.
export const ClipboardRefused: Story = {
  play: async ({ canvas, globals }) => {
    const texts = textsOf(globals.locale);
    const user = userEvent.setup();
    spyOn(navigator.clipboard, 'writeText').mockRejectedValue(
      new DOMException('', 'NotAllowedError'),
    );
    const copyIban = canvas.getByRole('button', { name: `${texts.copy} IBAN` });
    await user.click(copyIban);
    await waitFor(() => expect(window.getSelection()?.toString()).toBe(IBAN));
    await expect(statusOf(copyIban).textContent).toBe(texts.failed);
    await expect(copyIban).toHaveAccessibleName(`${texts.copy} IBAN`);
  },
};

// The app's own texts, in place of the package's.
export const WithTheAppsTexts: Story = {
  args: { copyLabel: 'Copy the', copiedLabel: 'Copied:', failedLabel: 'Select it by hand.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Copy the IBAN' })).toBeVisible();
  },
};
