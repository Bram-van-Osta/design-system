import { ChatCircleIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { RouterLink } from '../../testing/RouterLink.tsx';
import { stayOnThePage } from '../../testing/stay-on-the-page.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { ButtonVariant } from '../Button/button-classes.ts';
import { ButtonLink } from './ButtonLink.tsx';

const ADJUST = 'Ask for an adjustment';
const ROUTE = '/offer/adjust';

// REF-T8-07-Acompte and the offer: actions that open another page, as links.
const meta = {
  title: 'Actions/ButtonLink',
  component: ButtonLink,
  args: {
    href: '#adjust',
    children: ADJUST,
    onClick: fn(stayOnThePage),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: Object.values(ButtonVariant) },
    icon: { control: false },
    render: { control: false },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('link', { name: ADJUST });
    await expect(link).toHaveAttribute('href', '#adjust');
    await expect(canvas.queryByRole('button')).toBeNull();
    await expectHeightAtLeast(link, 'button-height');
    const { backgroundColor, borderRadius } = getComputedStyle(link);
    await expect(backgroundColor).toBe(tokenColor('delft', link));
    await expect(borderRadius).toBe('0px');

    await userEvent.tab();
    await expectFocusRing(link);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Secondary: Story = {
  args: {
    variant: ButtonVariant.secondary,
    icon: ChatCircleIcon,
    href: '#question',
    children: 'Ask a question',
  },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Ask a question' });
    await expectHeightAtLeast(link, 'target-min');
    await expect(getComputedStyle(link).borderTopColor).toBe(tokenColor('ink', link));
    await userEvent.tab();
    await expectFocusRing(link);
  },
};

export const Quiet: Story = {
  args: { variant: ButtonVariant.quiet, href: '#offer', children: 'Back to the offer' },
  play: async ({ canvas }) => {
    await expectHeightAtLeast(
      canvas.getByRole('link', { name: 'Back to the offer' }),
      'target-min',
    );
  },
};

export const Forward: Story = {
  args: { href: '#next', children: 'See the next step', hasArrow: true },
};

// The app's router renders the link: the package knows no router.
export const WithTheRoutersLink: Story = {
  args: { href: undefined, render: <RouterLink to={ROUTE} /> },
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('link', { name: ADJUST });
    await expect(link).toHaveAttribute('href', ROUTE);
    await expect(link).toHaveAttribute('data-router-link');
    await expect(getComputedStyle(link).backgroundColor).toBe(tokenColor('delft', link));
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
