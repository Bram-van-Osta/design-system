import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { expect, spyOn, userEvent, waitFor } from 'storybook/test';
import { Locale, MESSAGES } from '../../i18n/messages.ts';
import { expectCompactTarget } from '../../testing/expect-compact-target.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { CopyButton, type CopyButtonProps } from './CopyButton.tsx';

const EMAIL = 'jeanne@example.com';
const LABEL = 'Copy the email address';
const RESULT_TIMEOUT_MS = 3000;

// The component's own texts, in the language of the run.
function textsOf(locale: unknown) {
  const messages = MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en];
  return { copied: messages['copyButton.copied'], failed: messages['copyButton.failed'] };
}

// A contact's line on a request's page (C-09): the value, then its button.
function ContactLine(props: Omit<CopyButtonProps, 'valueRef'>) {
  const valueRef = useRef<HTMLSpanElement>(null);
  return (
    <div className="text-body-s text-ink">
      <p className="text-ink-muted">Jeanne Martin</p>
      <p>
        <span ref={valueRef}>{EMAIL}</span> <CopyButton {...props} valueRef={valueRef} />
      </p>
    </div>
  );
}

// C-12-CopierCompact, direction 1: a small gray icon, and the copied word beside it.
const meta = {
  title: 'Actions/CopyButton',
  component: CopyButton,
  args: { text: EMAIL, label: LABEL },
  render: (args) => <ContactLine {...args} />,
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InALine: Story = {
  play: async ({ canvas, globals }) => {
    const texts = textsOf(globals.locale);
    const user = userEvent.setup();
    const button = canvas.getByRole('button', { name: LABEL });
    const status = canvas.getByRole('status');
    await expectCompactTarget(button);
    const line = canvas.getByText(EMAIL).closest('p');
    await expect(line?.getBoundingClientRect().height).toBeLessThan(tokenPixels('target-min'));
    await expect(getComputedStyle(button).color).toBe(tokenColor('ink-muted', button));
    await expect(status).toBeEmptyDOMElement();

    await user.tab();
    await expectFocusRing(button);
    await user.keyboard('{Enter}');
    await expect(await navigator.clipboard.readText()).toBe(EMAIL);
    await expect(status).toHaveTextContent(texts.copied);
    const copied = canvas.getByText(texts.copied);
    await expect(copied).toBeVisible();
    await expect(getComputedStyle(copied).color).toBe(tokenColor('delft', copied));
    await expect(getComputedStyle(button).color).toBe(tokenColor('delft', button));
    await expect(button).toHaveAccessibleName(LABEL);

    // Copied again at once: the announcement is a new one, for screen readers to say it again.
    const announcement = status.firstElementChild;
    await user.click(button);
    await waitFor(() => expect(status.firstElementChild).not.toBe(announcement));
    await waitFor(() => expect(status).toBeEmptyDOMElement(), { timeout: RESULT_TIMEOUT_MS });
    await expect(getComputedStyle(button).color).toBe(tokenColor('ink-muted', button));
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
    await user.click(canvas.getByRole('button', { name: LABEL }));
    await waitFor(() => expect(window.getSelection()?.toString()).toBe(EMAIL));
    const status = canvas.getByRole('status');
    await expect(status.textContent).toBe(texts.failed);
    await expect(status.firstElementChild).toHaveClass('sr-only');
  },
};

// The app's own texts, in place of the package's.
export const WithTheAppsTexts: Story = {
  args: { copiedLabel: 'Address copied', failedLabel: 'Select the address to copy it.' },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: LABEL }));
    await expect(await canvas.findByText('Address copied')).toBeVisible();
  },
};
