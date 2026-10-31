import { DotsThreeIcon, SignOutIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { Avatar } from '../Avatar/Avatar.tsx';
import { Menu } from './Menu.tsx';

const chooseLanguage = fn();
const signOut = fn();

const meta = {
  title: 'Actions/Menu',
  component: Menu,
  args: {
    trigger: <Avatar name="Jeanne Martin" />,
    items: [
      { id: 'language', label: 'Nederlands', lang: 'nl', onSelect: chooseLanguage },
      { id: 'sign-out', label: 'Sign out', icon: SignOutIcon, onSelect: signOut },
    ],
  },
  argTypes: {
    trigger: { control: false },
    items: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Account: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Jeanne Martin' });
    await expectHeightAtLeast(trigger, 'target-min');
    await userEvent.tab();
    await expectFocusRing(trigger);
    await userEvent.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    await expect(menu).toBeVisible();
    const items = screen.getAllByRole('menuitem');
    await expect(items.map((item) => item.textContent)).toEqual(['Nederlands', 'Sign out']);
    await expect(items[0]).toHaveAttribute('lang', 'nl');
    for (const item of items) {
      await expectHeightAtLeast(item, 'target-min');
    }
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await expect(signOut).toHaveBeenCalledOnce();
    await expect(chooseLanguage).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

// An icon alone shows no name: the label gives it one.
export const IconTrigger: Story = {
  args: {
    trigger: <DotsThreeIcon size={ICON_SIZE.control} weight={ICON_WEIGHT} aria-hidden />,
    label: 'More actions',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'More actions' })).toBeVisible();
  },
};
