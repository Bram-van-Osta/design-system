import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { Dialog, type DialogProps } from './Dialog.tsx';
import { DialogPlacement } from './dialog-placement.ts';

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

// T13-G1-Ecrire-M: on a phone, the action and its cancel stacked at the whole width, the action
// first; on a computer, side by side at the right, the action last.
export const Open: Story = {
  play: async () => {
    const dialog = await screen.findByRole('alertdialog', { name: 'Remove this file?' });
    await expect(dialog).toBeVisible();
    const cancel = screen.getByRole('button', { name: /cancel|annuler/i });
    await expect(cancel).toBeVisible();
    const remove = screen.getByRole('button', { name: 'Remove' }).getBoundingClientRect();
    const cancelBox = cancel.getBoundingClientRect();
    const actions = cancel.parentElement?.getBoundingClientRect();
    if (actions === undefined) {
      throw new Error('The actions share their row.');
    }
    if (isOnAComputer()) {
      await expect(remove.top + remove.height / 2).toBe(cancelBox.top + cancelBox.height / 2);
      await expect(remove.left).toBeGreaterThan(cancelBox.right);
      await expect(remove.right).toBe(actions.right);
    } else {
      await expect(remove.bottom).toBeLessThanOrEqual(cancelBox.top);
      for (const button of [remove, cancelBox]) {
        await expect({ left: button.left, width: button.width }).toEqual({
          left: actions.left,
          width: actions.width,
        });
      }
    }
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

// T15-I-Inspirations-D, variant C: why the reader likes an image, rising from the bottom at the
// whole width on a phone, in the middle of the screen on a computer.
export const Sheet: Story = {
  args: {
    title: 'What you like in it',
    description: undefined,
    actionLabel: 'Save',
    cancelLabel: 'Later',
    placement: DialogPlacement.sheet,
  },
  play: async () => {
    const dialog = await screen.findByRole('alertdialog', { name: 'What you like in it' });
    const box = dialog.getBoundingClientRect();
    if (isOnAComputer()) {
      await expect(box.top + box.height / 2).toBeCloseTo(window.innerHeight / 2, 0);
      await expect(getComputedStyle(dialog).borderLeftWidth).toBe('1px');
    } else {
      await expect({ left: box.left, right: box.right, bottom: box.bottom }).toEqual({
        left: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      });
      await expect(getComputedStyle(dialog).borderLeftWidth).toBe('0px');
      await expect(getComputedStyle(dialog).borderTopWidth).toBe('1px');
    }
  },
};
