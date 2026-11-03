import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectCroppedImage } from '../../testing/expect-thumbnail.ts';
import { COMPUTER_CAPTURE, pageCapture } from '../../testing/page-capture.ts';
import { RouterLink } from '../../testing/RouterLink.tsx';
import { stayOnThePage } from '../../testing/stay-on-the-page.ts';
import { ThumbnailLink } from './ThumbnailLink.tsx';

const LABEL = 'Open the home page';
const ROUTE = '/files/home-page';
const SIZE = { width: 220, height: 130 } as const;

// A thumbnail that opens its image on a page of its own, such as a file.
const meta = {
  title: 'Actions/ThumbnailLink',
  component: ThumbnailLink,
  args: {
    href: '#home-page',
    src: pageCapture(COMPUTER_CAPTURE),
    label: LABEL,
    caption: 'home-page.png',
    ...SIZE,
    onClick: fn(stayOnThePage),
  },
  argTypes: {
    caption: { control: 'text' },
    render: { control: false },
  },
} satisfies Meta<typeof ThumbnailLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Link: Story = {
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('link', { name: LABEL });
    await expect(link).toHaveAttribute('href', '#home-page');
    await expectCroppedImage(link, SIZE);
    await userEvent.tab();
    await expectFocusRing(link);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

// The app's router renders the link: the package knows no router.
export const WithTheRoutersLink: Story = {
  args: { href: undefined, render: <RouterLink to={ROUTE} /> },
  play: async ({ canvas, args }) => {
    const link = canvas.getByRole('link', { name: LABEL });
    await expect(link).toHaveAttribute('href', ROUTE);
    await expect(link).toHaveAttribute('data-router-link');
    await expectCroppedImage(link, SIZE);
    await userEvent.click(link);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
