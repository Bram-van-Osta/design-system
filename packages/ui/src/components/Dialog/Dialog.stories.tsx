import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { Dialog, type DialogProps } from './Dialog.tsx';

type DialogStoryArgs = Omit<DialogProps, 'open' | 'onOpenChange'>;

function DialogWithTrigger(args: DialogStoryArgs) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant={ButtonVariant.secondary} onClick={() => setIsOpen(true)}>
        Remove menu.pdf
      </Button>
      <Dialog {...args} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

const meta = {
  title: 'Feedback/Dialog',
  component: Dialog,
  args: {
    open: true,
    onOpenChange: fn(),
    title: 'Remove this file?',
    description: 'menu.pdf leaves your folder. Your other files stay where they are.',
    actionLabel: 'Remove',
    onAction: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Question: Story = {
  render: (args) => <DialogWithTrigger {...args} />,
  play: async ({ canvas, args }) => {
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    const dialog = await screen.findByRole('alertdialog', { name: 'Remove this file?' });
    await expect(dialog).toHaveAccessibleDescription(
      'menu.pdf leaves your folder. Your other files stay where they are.',
    );
    const remove = screen.getByRole('button', { name: 'Remove' });
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /cancel|annuler/i })).toHaveFocus(),
    );
    await userEvent.tab();
    await expectFocusRing(remove);
    await userEvent.keyboard('{Enter}');
    await expect(args.onAction).toHaveBeenCalledOnce();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Remove menu.pdf' })).toHaveFocus();
  },
};

export const Open: Story = {
  play: async () => {
    await expect(
      await screen.findByRole('alertdialog', { name: 'Remove this file?' }),
    ).toBeVisible();
    await expect(screen.getByRole('button', { name: /cancel|annuler/i })).toBeVisible();
  },
};

export const Pending: Story = {
  args: { isPending: true },
  play: async ({ args }) => {
    const remove = await screen.findByRole('button', { name: 'Remove' });
    await expect(remove).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(remove);
    await expect(args.onAction).not.toHaveBeenCalled();
  },
};

export const WithOwnCancelLabel: Story = {
  args: {
    title: 'Send your feedback to Bram?',
    description: 'You will not be able to change it afterwards.',
    actionLabel: 'Send',
    cancelLabel: 'Keep writing',
  },
};
