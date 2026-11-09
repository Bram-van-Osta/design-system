import { SignOutIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import {
  expectDetachedPopup,
  expectMenuTriggerAtRest,
  expectMenuTriggerOpen,
} from '../../testing/expect-menu.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { AccountMenu } from './AccountMenu.tsx';

const NAME = 'Jeanne Martin';
const LONG_NAME = 'Jeanne-Marie Martin-Delacroix de la Boulangerie du Port';

const meta = {
  title: 'Actions/AccountMenu',
  component: AccountMenu,
  args: {
    name: NAME,
    items: [
      { id: 'language', label: 'Nederlands', lang: 'nl', onSelect: fn() },
      { id: 'sign-out', label: 'Sign out', icon: SignOutIcon, onSelect: fn() },
    ],
  },
  argTypes: {
    items: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-end">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// The name beside the avatar, shown from md up: on a phone, the avatar alone, the name still read.
function shownName(trigger: HTMLElement, name: string): HTMLElement | undefined {
  return [...trigger.querySelectorAll('span')].find(
    (element) =>
      element.textContent === name &&
      element.childElementCount === 0 &&
      element.getBoundingClientRect().width > 1,
  );
}

export const Closed: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: NAME });
    await expect(trigger).toHaveAccessibleName(NAME);
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
    await expectHeightAtLeast(trigger, 'target-min');
    await expect(trigger.getBoundingClientRect().width).toBeGreaterThanOrEqual(
      tokenPixels('target-min'),
    );
    await expectMenuTriggerAtRest(trigger);
    await expect(getComputedStyle(trigger).borderRadius).toBe('0px');
    await userEvent.tab();
    await expectFocusRing(trigger);
  },
};

export const Open: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: NAME });
    await userEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    await expect(menu).toBeVisible();
    await expectMenuTriggerOpen(trigger);
    await expectDetachedPopup(trigger, menu);
    await expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'Nederlands',
      'Sign out',
    ]);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

// A long name ends in an ellipsis at its maximum width; the button keeps the whole name.
export const LongName: Story = {
  args: { name: LONG_NAME },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: LONG_NAME });
    const name = shownName(trigger, LONG_NAME);
    if (name !== undefined) {
      await expect(name.getBoundingClientRect().width).toBeLessThanOrEqual(
        tokenPixels('account-name-width'),
      );
      await expect(getComputedStyle(name).textOverflow).toBe('ellipsis');
      await expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
      await expectHeightAtLeast(trigger, 'target-min');
      await expect(trigger.getBoundingClientRect().height).toBeLessThan(
        2 * tokenPixels('target-min'),
      );
    }
  },
};

// A navigation column's row: its column's width, the avatar at its left, the name shown everywhere.
export const FullWidth: Story = {
  args: { isFullWidth: true },
  decorators: [
    (Story) => (
      <div className="w-58">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: NAME });
    const column = canvasElement.querySelector('.w-58');
    if (!(column instanceof HTMLElement)) {
      throw new Error('The story draws its column.');
    }
    await expect(trigger.getBoundingClientRect().width).toBe(column.getBoundingClientRect().width);
    await expect(shownName(trigger, NAME)).toBeDefined();
    await expect(getComputedStyle(trigger).justifyContent).toBe('flex-start');
  },
};
