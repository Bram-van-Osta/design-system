import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { expectContrastAtLeast } from '../../testing/expect-contrast.ts';
import { expectOnFirstLine } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Button } from '../Button/Button.tsx';
import { ToastProvider } from './ToastProvider.tsx';
import { ToastTone } from './toast-tone.ts';
import { type ToastContent, useToast } from './use-toast.ts';

// WCAG's threshold for an icon that carries meaning.
const ICON_CONTRAST = 3;

function ShowToast(content: ToastContent) {
  const showToast = useToast();
  return <Button onClick={() => showToast(content)}>Save</Button>;
}

/** The ink band: ink behind, bg in front, the title at its regular weight, an icon, no button. */
async function expectInkBand(toast: HTMLElement, title: string): Promise<void> {
  const style = getComputedStyle(toast);
  await expect(style.backgroundColor).toBe(tokenColor('ink', toast));
  await expect(style.color).toBe(tokenColor('bg', toast));
  await expect(style.boxShadow).toBe('none');
  await expect(style.borderRadius).toBe('0px');
  await expect(getComputedStyle(within(toast).getByText(title)).fontWeight).toBe('400');
  await expect(within(toast).queryByRole('button')).not.toBeInTheDocument();
  await expectOnFirstLine(toast, toast.querySelector('svg'));
}

// C-11-Toast, direction 1: an ink band, which leaves by itself.
const meta = {
  title: 'Feedback/Toast',
  component: ShowToast,
  args: {
    title: 'Saved',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: Object.values(ToastTone) },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ShowToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Done: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    const toast = await screen.findByRole('dialog', { name: 'Saved' });
    await expectInkBand(toast, 'Saved');

    // F6 reaches the toasts, Tab the first one, Escape dismisses it.
    await userEvent.keyboard('{F6}');
    await userEvent.tab();
    await expectFocusRing(toast);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument());
  },
};

export const Failed: Story = {
  args: {
    title: 'Failed to copy',
    description: 'Select the address to copy it.',
    tone: ToastTone.failed,
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    const toast = await screen.findByRole('dialog', { name: 'Failed to copy' });
    await expect(toast).toHaveAccessibleDescription('Select the address to copy it.');
    await expectInkBand(toast, 'Failed to copy');
    const icon = toast.querySelector('svg');
    await expect(icon).not.toBeNull();
    if (icon !== null) {
      const iconColor = getComputedStyle(icon).color;
      await expect(iconColor).toBe(tokenColor('vermillion', toast));
      await expectContrastAtLeast(
        iconColor,
        getComputedStyle(toast).backgroundColor,
        ICON_CONTRAST,
      );
    }
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Message sent',
    description: 'Jeanne Martin receives it in a moment.',
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(await screen.findByText('Jeanne Martin receives it in a moment.')).toBeVisible();
  },
};
