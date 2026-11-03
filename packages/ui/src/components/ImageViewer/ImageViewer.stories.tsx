import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import {
  expectScrolledToTop,
  expectViewerLayout,
  expectWholeImage,
  findImageViewer,
  messagesOf,
} from '../../testing/expect-image-viewer.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { COMPUTER_CAPTURE, PHONE_CAPTURE, pageCapture } from '../../testing/page-capture.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Thumbnail } from '../Thumbnail/Thumbnail.tsx';
import { ToggleGroup } from '../ToggleGroup/ToggleGroup.tsx';
import { ImageViewer, type ImageViewerProps } from './ImageViewer.tsx';

const View = {
  computer: 'computer',
  phone: 'phone',
} as const;
type View = (typeof View)[keyof typeof View];

interface Capture {
  readonly title: string;
  readonly path: string;
  readonly view: View;
  readonly src: string;
}

const PAGES = [
  { title: 'Home', path: '/' },
  { title: 'Our breads', path: '/breads' },
  { title: 'Our story', path: '/story' },
  { title: 'Contact', path: '/contact' },
] as const;

// Each page a little taller than the one before, so that each capture has its own image.
const PAGE_GROWTH = 400;
const VIEWS = [View.computer, View.phone] as const;
const VIEW_WIDTHS: Readonly<Record<View, number>> = { computer: 1440, phone: 390 };

const CAPTURES: readonly Capture[] = PAGES.flatMap((page, pageIndex) => [
  {
    ...page,
    view: View.computer,
    src: pageCapture({
      ...COMPUTER_CAPTURE,
      height: COMPUTER_CAPTURE.height + pageIndex * PAGE_GROWTH,
    }),
  },
  {
    ...page,
    view: View.phone,
    src: pageCapture({ ...PHONE_CAPTURE, height: PHONE_CAPTURE.height + pageIndex * PAGE_GROWTH }),
  },
]);

const FIRST = 0;
const MIDDLE = 3;
const LAST = CAPTURES.length - 1;
const SCROLLED = 600;
const HINT = 'Left and right arrows from one capture to the next · Esc to close';
const VIEWS_LABEL = 'Captured on';
const VIEW_LABELS: Readonly<Record<View, string>> = { computer: 'Computer', phone: 'Phone' };
const THUMBNAIL = { width: 68, height: 130 } as const;

function captureAt(index: number): Capture {
  const capture = CAPTURES[index];
  if (capture === undefined) {
    throw new Error(`There is no capture ${index}.`);
  }
  return capture;
}

function altOf({ title, view }: Capture): string {
  return `The whole ${title} page of example.com on a ${view}`;
}

/** The viewer's props for one capture of the eight, as the app derives them. */
function captureProps(index: number) {
  const capture = captureAt(index);
  return {
    title: capture.title,
    description: `example.com${capture.path} · ${capture.view}, ${VIEW_WIDTHS[capture.view]} px · capture ${index + 1} of ${CAPTURES.length}`,
    src: capture.src,
    alt: altOf(capture),
    originalHref: `https://example.com/captures/${index + 1}.png`,
    hasPrevious: index > FIRST,
    hasNext: index < LAST,
  } satisfies Partial<ImageViewerProps>;
}

const FIRST_PROPS = captureProps(FIRST);
const MIDDLE_PROPS = captureProps(MIDDLE);
const LAST_PROPS = captureProps(LAST);

function indexOf(pageIndex: number, view: View): number {
  return pageIndex * VIEWS.length + VIEWS.indexOf(view);
}

interface Shown {
  readonly index: number;
  readonly isOpen: boolean;
}

// The factory's use: the captures as thumbnails, one opens the viewer, which walks the eight and
// switches between the computer's capture and the phone's.
function WalkingViewer() {
  const [shown, setShown] = useState<Shown>({ index: FIRST, isOpen: false });
  const capture = captureAt(shown.index);
  const pageIndex = Math.floor(shown.index / VIEWS.length);
  const show = (index: number) => setShown({ index, isOpen: true });
  return (
    <>
      <div className="flex flex-wrap gap-space-3">
        {CAPTURES.map((thumbnail, index) => (
          <Thumbnail
            key={thumbnail.src}
            src={thumbnail.src}
            label={`Open ${altOf(thumbnail)}`}
            caption={thumbnail.view}
            {...THUMBNAIL}
            onClick={() => show(index)}
          />
        ))}
      </div>
      <ImageViewer
        {...captureProps(shown.index)}
        open={shown.isOpen}
        onOpenChange={(isOpen) => setShown({ ...shown, isOpen })}
        controls={
          <ToggleGroup
            label={VIEWS_LABEL}
            options={VIEWS.map((view) => ({ value: view, label: VIEW_LABELS[view] }))}
            value={capture.view}
            onValueChange={(view) =>
              show(indexOf(pageIndex, view === View.phone ? View.phone : View.computer))
            }
          />
        }
        onPrevious={() => show(shown.index - 1)}
        onNext={() => show(shown.index + 1)}
        hint={HINT}
      />
    </>
  );
}

const meta = {
  title: 'Feedback/ImageViewer',
  component: ImageViewer,
  args: {
    ...MIDDLE_PROPS,
    open: true,
    onOpenChange: fn(),
    onPrevious: fn(),
    onNext: fn(),
    hint: HINT,
  },
  argTypes: {
    controls: { control: false },
  },
} satisfies Meta<typeof ImageViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

// C-27, the dialog of piste 1: a capture in the middle of the eight, both ways open.
export const MiddleImage: Story = {
  play: async ({ args, globals }) => {
    const messages = messagesOf(globals.locale);
    const viewer = await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    await expect(viewer.dialog).toHaveAccessibleDescription(MIDDLE_PROPS.description);
    await expect(screen.getByRole('heading', { level: 2, name: MIDDLE_PROPS.title })).toBeVisible();
    await expectWholeImage(viewer);
    await expectViewerLayout(viewer);
    const previous = screen.getByRole('button', { name: messages['imageViewer.previous'] });
    const next = screen.getByRole('button', { name: messages['imageViewer.next'] });
    await expect(previous).toBeEnabled();
    await expect(next).toBeEnabled();
    await userEvent.click(previous);
    await expect(args.onPrevious).toHaveBeenCalledOnce();
    await userEvent.click(next);
    await expect(args.onNext).toHaveBeenCalledOnce();
  },
};

export const Keyboard: Story = {
  play: async ({ args, globals }) => {
    const messages = messagesOf(globals.locale);
    await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    const close = screen.getByRole('button', { name: messages['imageViewer.close'] });
    await waitFor(() => expect(close).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onNext).toHaveBeenCalledOnce();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(args.onPrevious).toHaveBeenCalledOnce();
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    await expect(args.onNext).toHaveBeenCalledOnce();
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    const { frame } = await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    await expectFocusRing(frame);
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onNext).toHaveBeenCalledTimes(2);
  },
};

// The first capture: Previous stays displayed, disabled, and the left arrow does nothing.
export const FirstImage: Story = {
  args: FIRST_PROPS,
  play: async ({ args, globals }) => {
    const messages = messagesOf(globals.locale);
    await findImageViewer(FIRST_PROPS.title, FIRST_PROPS.alt);
    const previous = screen.getByRole('button', { name: messages['imageViewer.previous'] });
    await expect(previous).toHaveAttribute('aria-disabled', 'true');
    await expect(getComputedStyle(previous).color).toBe(tokenColor('ink-muted', previous));
    await expect(screen.getByRole('button', { name: messages['imageViewer.next'] })).toBeEnabled();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(args.onPrevious).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onNext).toHaveBeenCalledOnce();
  },
};

// The last capture: Next stays displayed, disabled, and the right arrow does nothing.
export const LastImage: Story = {
  args: LAST_PROPS,
  play: async ({ args, globals }) => {
    const messages = messagesOf(globals.locale);
    await findImageViewer(LAST_PROPS.title, LAST_PROPS.alt);
    await expect(
      screen.getByRole('button', { name: messages['imageViewer.next'] }),
    ).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onNext).not.toHaveBeenCalled();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(args.onPrevious).toHaveBeenCalledOnce();
  },
};

// On a computer, the image alone opens in a new tab; the hint sits on the right. On a phone,
// neither shows.
export const TheImageAlone: Story = {
  play: async ({ globals }) => {
    const messages = messagesOf(globals.locale);
    await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    const hint = screen.getByText(HINT);
    if (!isOnAComputer()) {
      await expect(screen.queryByRole('link')).toBeNull();
      await expect(hint).not.toBeVisible();
      return;
    }
    const link = screen.getByRole('link', { name: messages['imageViewer.openAlone'] });
    await expect(link).toHaveAttribute('href', MIDDLE_PROPS.originalHref);
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noreferrer');
    await expect(getComputedStyle(hint).color).toBe(tokenColor('ink-muted', hint));
    await expect(hint.getBoundingClientRect().left).toBeGreaterThan(
      link.getBoundingClientRect().right,
    );
  },
};

export const WithoutTheLink: Story = {
  args: { originalHref: undefined },
  play: async () => {
    await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    await expect(screen.queryByRole('link')).toBeNull();
  },
};

// One image alone: no way to another, so neither Previous nor Next, and no footer.
export const OneImage: Story = {
  args: {
    onPrevious: undefined,
    onNext: undefined,
    originalHref: undefined,
    hint: undefined,
    description: 'example.com/ · computer, 1440 px',
  },
  play: async ({ globals }) => {
    const messages = messagesOf(globals.locale);
    const { dialog } = await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    await expect(screen.getAllByRole('button')).toEqual([
      screen.getByRole('button', { name: messages['imageViewer.close'] }),
    ]);
    await userEvent.keyboard('{ArrowRight}');
    await expect(dialog).toBeVisible();
  },
};

// Escape, the close button and a press outside the box ask to close; the app closes it.
export const Closing: Story = {
  play: async ({ args, globals }) => {
    const messages = messagesOf(globals.locale);
    const { dialog } = await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    await userEvent.keyboard('{Escape}');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await userEvent.click(screen.getByRole('button', { name: messages['imageViewer.close'] }));
    await expect(args.onOpenChange).toHaveBeenCalledTimes(2);
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    if (!isOnAComputer() || dialog.parentElement === null) {
      return;
    }
    await userEvent.click(dialog.parentElement);
    await expect(args.onOpenChange).toHaveBeenCalledTimes(3);
  },
};

export const OnAComputer: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async () => {
    await expect(isOnAComputer()).toBe(true);
    const viewer = await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    await expectViewerLayout(viewer);
    await expectWholeImage(viewer);
  },
};

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  play: async () => {
    await expect(isOnAComputer()).toBe(false);
    const viewer = await findImageViewer(MIDDLE_PROPS.title, MIDDLE_PROPS.alt);
    await expectViewerLayout(viewer);
    await expectWholeImage(viewer);
  },
};

// From a thumbnail to the viewer, from one capture to the next and to the phone's, then back to
// the thumbnail that opened it.
export const Walking: Story = {
  render: () => <WalkingViewer />,
  play: async ({ canvas, globals }) => {
    const messages = messagesOf(globals.locale);
    const first = captureAt(FIRST);
    const thumbnail = canvas.getByRole('button', { name: `Open ${altOf(first)}` });
    await userEvent.click(thumbnail);
    const { frame } = await findImageViewer(first.title, altOf(first));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: messages['imageViewer.close'] })).toHaveFocus(),
    );
    frame.scrollTop = SCROLLED;
    await expect(frame.scrollTop).toBe(SCROLLED);
    await userEvent.keyboard('{ArrowRight}');
    const second = captureAt(FIRST + 1);
    await findImageViewer(second.title, altOf(second));
    await expectScrolledToTop(frame);
    const computer = screen.getByRole('button', { name: VIEW_LABELS.computer });
    await userEvent.click(computer);
    await findImageViewer(first.title, altOf(first));
    await userEvent.keyboard('{ArrowRight}');
    await expect(screen.getByRole('button', { name: VIEW_LABELS.phone })).toHaveFocus();
    await findImageViewer(first.title, altOf(first));
    await userEvent.click(screen.getByRole('button', { name: messages['imageViewer.next'] }));
    await findImageViewer(second.title, altOf(second));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(thumbnail).toHaveFocus();
  },
};

// At the last capture, Next turns disabled under the focus, which stays in the dialog.
export const WalkingToTheEnd: Story = {
  render: () => <WalkingViewer />,
  play: async ({ canvas, globals }) => {
    const messages = messagesOf(globals.locale);
    const beforeLast = captureAt(LAST - 1);
    await userEvent.click(canvas.getByRole('button', { name: `Open ${altOf(beforeLast)}` }));
    const { dialog } = await findImageViewer(beforeLast.title, altOf(beforeLast));
    const next = screen.getByRole('button', { name: messages['imageViewer.next'] });
    await userEvent.click(next);
    const last = captureAt(LAST);
    await findImageViewer(last.title, altOf(last));
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(next).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await findImageViewer(last.title, altOf(last));
    await expect(dialog).toBeVisible();
  },
};
