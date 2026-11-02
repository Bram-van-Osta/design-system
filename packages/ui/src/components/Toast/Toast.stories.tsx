import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { expectContrastAtLeast } from '../../testing/expect-contrast.ts';
import { expectOnFirstLine } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import {
  expectAtTheBottom,
  expectFolded,
  expectUnfolded,
  toastStack,
  toastsSettled,
} from '../../testing/expect-toast-stack.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { REDUCED_MOTION_QUERY } from '../../utils/use-reduced-motion.ts';
import { Button } from '../Button/Button.tsx';
import { ToastProvider } from './ToastProvider.tsx';
import { TOAST_LIMIT } from './toast-motion.ts';
import { ToastTone } from './toast-tone.ts';
import { type ToastContent, useToast } from './use-toast.ts';

// WCAG's threshold for an icon that carries meaning.
const ICON_CONTRAST = 3;
// A media query every screen matches, which stands for the system's reduced motion.
const EVERY_SCREEN_QUERY = 'all';
const IDENTITY_TRANSFORM = 'matrix(1, 0, 0, 1, 0, 0)';
// Either side of Base UI's 40 px, past which a swipe dismisses the toast.
const SHORT_SWIPE = 24;
const LONG_SWIPE = 64;

// Three in a row, the oldest first: the last one is the newest, in front.
const THREE_TOASTS: readonly ToastContent[] = [
  { title: 'Draft saved' },
  { title: 'Email address copied', description: 'jeanne.martin@example.com' },
  { title: 'Failed to send', tone: ToastTone.failed },
];
const OLDEST_TOAST: ToastContent = { title: 'Link copied' };

function ShowToast(content: ToastContent) {
  const showToast = useToast();
  return <Button onClick={() => showToast(content)}>Save</Button>;
}

interface ShowToastsProps {
  readonly contents: readonly ToastContent[];
}

function ShowToasts({ contents }: ShowToastsProps) {
  const showToast = useToast();
  return <Button onClick={() => contents.forEach(showToast)}>Show the toasts</Button>;
}

interface Swipe {
  readonly toast: HTMLElement;
  readonly right: number;
  readonly down: number;
}

/**
 * A mouse pressed in the middle of the toast, dragged, then lifted. Base UI counts the drag from
 * the first move, after the press: that first move is a nudge.
 */
async function swipe({ toast, right, down }: Swipe): Promise<void> {
  const box = toast.getBoundingClientRect();
  const pressed = { clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 };
  const nudged = {
    clientX: pressed.clientX + Math.sign(right),
    clientY: pressed.clientY + Math.sign(down),
  };
  const halfway = { clientX: nudged.clientX + right / 2, clientY: nudged.clientY + down / 2 };
  const lifted = { clientX: nudged.clientX + right, clientY: nudged.clientY + down };
  await userEvent.pointer([
    { keys: '[MouseLeft>]', target: toast, coords: pressed },
    { target: toast, coords: nudged },
    { target: toast, coords: halfway },
    { target: toast, coords: lifted },
    { keys: '[/MouseLeft]', target: toast, coords: lifted },
  ]);
}

async function showTheToasts(): Promise<void> {
  await userEvent.click(screen.getByRole('button', { name: 'Show the toasts' }));
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
    const description = await screen.findByText('Jeanne Martin receives it in a moment.');
    await toastsSettled();
    await expect(description).toBeVisible();
  },
};

// C-19-PileToasts, direction 1: the newest in front, the two before it behind, a sliver showing.
export const Stacked: Story = {
  render: () => <ShowToasts contents={THREE_TOASTS} />,
  play: async () => {
    await showTheToasts();
    await toastsSettled();
    const stack = toastStack();
    await expect(stack.toasts).toHaveLength(THREE_TOASTS.length);
    await expect(stack.toasts[0]).toHaveAccessibleName('Failed to send');
    await expectFolded(stack);
    const [front] = stack.toasts;
    if (front !== undefined) {
      await expectAtTheBottom(front);
    }
  },
};

export const UnfoldedOnHover: Story = {
  render: () => <ShowToasts contents={THREE_TOASTS} />,
  play: async () => {
    await showTheToasts();
    await toastsSettled();
    const [front] = toastStack().toasts;
    if (front === undefined) {
      return;
    }
    await userEvent.hover(front);
    await toastsSettled();
    await expectUnfolded(toastStack());

    await userEvent.unhover(front);
    await toastsSettled();
    await expectFolded(toastStack());
  },
};

export const UnfoldedOnKeyboard: Story = {
  render: () => <ShowToasts contents={THREE_TOASTS} />,
  play: async () => {
    await showTheToasts();
    await toastsSettled();
    await userEvent.keyboard('{F6}');
    await toastsSettled();
    await expectUnfolded(toastStack());

    // Tab reaches the newest first, at the bottom of the column.
    await userEvent.tab();
    const [front] = toastStack().toasts;
    if (front !== undefined) {
      await expectFocusRing(front);
    }
  },
};

export const FourthSendsTheOldestAway: Story = {
  render: () => <ShowToasts contents={[OLDEST_TOAST, ...THREE_TOASTS]} />,
  play: async () => {
    await showTheToasts();
    await waitFor(() => expect(screen.queryByText(OLDEST_TOAST.title)).not.toBeInTheDocument());
    await toastsSettled();
    const stack = toastStack();
    await expect(stack.toasts).toHaveLength(TOAST_LIMIT);
    await expectFolded(stack);
  },
};

// The system asks for less motion: the toasts fade, and nothing moves.
export const ReducedMotion: Story = {
  render: () => <ShowToasts contents={THREE_TOASTS} />,
  beforeEach: () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = (query) =>
      matchMedia.call(window, query === REDUCED_MOTION_QUERY ? EVERY_SCREEN_QUERY : query);
    return () => {
      window.matchMedia = matchMedia;
    };
  },
  play: async () => {
    await showTheToasts();
    const [front] = await screen.findAllByRole('dialog');
    if (front === undefined) {
      return;
    }
    await expect(getComputedStyle(front).transitionProperty).toBe('opacity');
    await toastsSettled();
    await expect(getComputedStyle(front).transform).toBe(IDENTITY_TRANSFORM);
    await expectFolded(toastStack());

    await userEvent.hover(front);
    await expect(getComputedStyle(front).transitionProperty).toBe('opacity');
    await toastsSettled();
    await expectUnfolded(toastStack());
  },
};

// Swiped to the right, or down as on a phone: past 40 px it leaves, short of it it comes back.
export const SwipedAway: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    const toast = await screen.findByRole('dialog', { name: 'Saved' });
    await toastsSettled();
    await swipe({ toast, right: SHORT_SWIPE, down: 0 });
    await toastsSettled();
    await expect(toast).toBeInTheDocument();

    await swipe({ toast, right: LONG_SWIPE, down: 0 });
    await waitFor(() => expect(toast).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    const next = await screen.findByRole('dialog', { name: 'Saved' });
    await toastsSettled();
    await swipe({ toast: next, right: 0, down: LONG_SWIPE });
    await waitFor(() => expect(next).not.toBeInTheDocument());
  },
};
