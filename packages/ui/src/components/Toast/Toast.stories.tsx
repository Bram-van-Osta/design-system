import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { Button } from '../Button/Button.tsx';
import { ToastProvider } from './ToastProvider.tsx';
import { type ToastContent, useToast } from './use-toast.ts';

function ShowToast(content: ToastContent) {
  const showToast = useToast();
  return <Button onClick={() => showToast(content)}>Save</Button>;
}

const meta = {
  title: 'Feedback/Toast',
  component: ShowToast,
  args: {
    title: 'Saved',
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

export const Short: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(await screen.findByText('Saved')).toBeVisible();
    await userEvent.keyboard('{F6}');
    await userEvent.tab();
    await userEvent.tab();
    await expectFocusRing(screen.getByRole('button', { name: /close|fermer/i, hidden: true }));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByText('Saved')).not.toBeInTheDocument());
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Failed to send your message',
    description: 'Check your connection, then send it again.',
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(
      await screen.findByText('Check your connection, then send it again.'),
    ).toBeVisible();
  },
};
