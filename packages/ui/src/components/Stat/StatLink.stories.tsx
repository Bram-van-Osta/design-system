import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { RouterLink } from '../../testing/RouterLink.tsx';
import { stayOnThePage } from '../../testing/stay-on-the-page.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { StatLink } from './StatLink.tsx';
import { StatTone } from './stat-tone.ts';

const NAME = 'Questionnaire 4';
const ROUTE = '/projects?state=questionnaire';

// A pipeline's tile that filters the list under it. Under the pointer, its tile takes the surface.
const meta = {
  title: 'Actions/StatLink',
  component: StatLink,
  args: {
    href: '#questionnaire',
    label: 'Questionnaire',
    value: 4,
    onClick: fn(stayOnThePage),
  },
  argTypes: {
    tone: { control: 'inline-radio', options: Object.values(StatTone) },
    note: { control: 'text' },
    render: { control: false },
  },
} satisfies Meta<typeof StatLink>;

export default meta;
type Story = StoryObj<typeof meta>;

// At rest, then focused by the keyboard: named by its label and its figure, a target of 44 px.
export const Link: Story = {
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('link', { name: NAME });
    await expect(link).toHaveAttribute('href', '#questionnaire');
    await expectHeightAtLeast(link, 'target-min');
    const { borderTopColor, borderRadius, boxShadow } = getComputedStyle(link);
    await expect({ borderTopColor, borderRadius, boxShadow }).toEqual({
      borderTopColor: tokenColor('line', link),
      borderRadius: '0px',
      boxShadow: 'none',
    });
    await expect(getComputedStyle(canvas.getByText('4')).color).toBe(tokenColor('ink', link));

    await userEvent.tab();
    await expectFocusRing(link);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Attention: Story = {
  args: { label: 'Proposal', value: 2, tone: StatTone.attention, href: '#proposal' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Proposal 2' });
    await expect(getComputedStyle(link).borderTopColor).toBe(tokenColor('vermillion', link));
    await expect(getComputedStyle(canvas.getByText('2')).color).toBe(
      tokenColor('vermillion', link),
    );
  },
};

export const WithANote: Story = {
  args: { label: 'To review', value: 5, note: 'the oldest: 3 h', href: '#to-review' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'To review 5 the oldest: 3 h' })).toBeVisible();
  },
};

// The app's router renders the link: the package knows no router.
export const WithTheRoutersLink: Story = {
  args: { href: undefined, render: <RouterLink to={ROUTE} /> },
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('link', { name: NAME });
    await expect(link).toHaveAttribute('href', ROUTE);
    await expect(link).toHaveAttribute('data-router-link');
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

// A filter the page keeps, without changing its address: a button.
export const AsAButton: Story = {
  args: { href: undefined, render: <button type="button" />, onClick: fn() },
  play: async ({ canvas, args }) => {
    const button = canvas.getByRole('button', { name: NAME });
    await expect(canvas.queryByRole('link')).toBeNull();
    await expectHeightAtLeast(button, 'target-min');
    await userEvent.tab();
    await expectFocusRing(button);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
