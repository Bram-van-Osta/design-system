import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectCroppedImage } from '../../testing/expect-thumbnail.ts';
import { COMPUTER_CAPTURE, PHONE_CAPTURE, pageCapture } from '../../testing/page-capture.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Thumbnail } from './Thumbnail.tsx';
import { ThumbnailAwaited } from './ThumbnailAwaited.tsx';
import { ThumbnailLeftOut } from './ThumbnailLeftOut.tsx';

const COMPUTER_LABEL = 'Open the capture of the home page on a computer';
const PHONE_LABEL = 'Open the capture of the home page on a phone';
const COMPUTER = 'computer';
const PHONE = 'phone';
const NOT_CAPTURED = 'not captured · the page did not finish loading';

// C-27, the thumbnail's board: the same page on a computer and on a phone, side by side, at the
// same height. On a phone, the boxes grow a little.
const WIDE = { width: 220, height: 130 } as const;
const NARROW = { width: 68, height: 130 } as const;
const WIDE_ON_A_PHONE = { width: 238, height: 140 } as const;
const NARROW_ON_A_PHONE = { width: 72, height: 140 } as const;

const COMPUTER_PAGE = pageCapture(COMPUTER_CAPTURE);
const PHONE_PAGE = pageCapture(PHONE_CAPTURE);

const BAR_SHARES = [0.7, 0.9, 0.55] as const;
// A bar's width is a share of its box's, inside the box's padding: a pixel of rounding either way.
const BAR_WIDTH_TOLERANCE = 1;

const meta = {
  title: 'Actions/Thumbnail',
  component: Thumbnail,
  args: {
    src: COMPUTER_PAGE,
    label: COMPUTER_LABEL,
    caption: COMPUTER,
    ...WIDE,
    onClick: fn(),
  },
  argTypes: {
    caption: { control: 'text' },
  },
} satisfies Meta<typeof Thumbnail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnAComputer: Story = {
  play: async ({ canvas, args }) => {
    const thumbnail = canvas.getByRole('button', { name: COMPUTER_LABEL });
    await expectCroppedImage(thumbnail, WIDE);
    const caption = canvas.getByText(COMPUTER);
    await expect(thumbnail).not.toContainElement(caption);
    await expect(getComputedStyle(caption).color).toBe(tokenColor('ink-muted', caption));
    await expect(caption.getBoundingClientRect().top).toBeGreaterThan(
      thumbnail.getBoundingClientRect().bottom,
    );
    await userEvent.click(thumbnail);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const OnAPhone: Story = {
  args: { src: PHONE_PAGE, label: PHONE_LABEL, caption: PHONE, ...NARROW },
  play: async ({ canvas }) => {
    await expectCroppedImage(canvas.getByRole('button', { name: PHONE_LABEL }), NARROW);
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const thumbnail = canvas.getByRole('button', { name: COMPUTER_LABEL });
    await userEvent.tab();
    await expectFocusRing(thumbnail);
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

// The four states of a page's captures, the computer's beside the phone's.
export const SideBySide: Story = {
  render: (args) => (
    <div className="flex flex-col gap-space-5">
      <div className="flex flex-wrap items-start gap-space-4">
        <Thumbnail {...args} />
        <Thumbnail {...args} src={PHONE_PAGE} label={PHONE_LABEL} caption={PHONE} {...NARROW} />
      </div>
      <div className="flex flex-wrap items-start gap-space-4">
        <ThumbnailAwaited caption={COMPUTER} {...WIDE} />
        <ThumbnailAwaited caption={PHONE} {...NARROW} />
      </div>
      <div className="flex flex-wrap items-start gap-space-4">
        <ThumbnailLeftOut caption={COMPUTER} reason={NOT_CAPTURED} {...WIDE} />
        <ThumbnailLeftOut caption={PHONE} reason="not captured" {...NARROW} />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(2);
    await expect(canvas.getAllByRole('status')).toHaveLength(2);
    await expect(canvas.getByText(NOT_CAPTURED)).toBeVisible();
  },
};

export const SideBySideOnAPhone: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-space-4">
      <Thumbnail {...args} {...WIDE_ON_A_PHONE} />
      <Thumbnail
        {...args}
        src={PHONE_PAGE}
        label={PHONE_LABEL}
        caption={PHONE}
        {...NARROW_ON_A_PHONE}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expectCroppedImage(canvas.getByRole('button', { name: COMPUTER_LABEL }), WIDE_ON_A_PHONE);
    await expectCroppedImage(canvas.getByRole('button', { name: PHONE_LABEL }), NARROW_ON_A_PHONE);
  },
};

// The capture is under way: the same box on surface, three bars, nothing to open.
export const Awaited: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-space-4">
      <ThumbnailAwaited caption={COMPUTER} {...WIDE} />
      <ThumbnailAwaited caption={PHONE} {...NARROW} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    const [box] = canvas.getAllByRole('status');
    if (box === undefined) {
      throw new Error('The awaited thumbnail has no box.');
    }
    await expect(box).toHaveTextContent(/loading|chargement/i);
    await expect(canvas.getByText(COMPUTER)).toBeVisible();
    const rectangle = box.getBoundingClientRect();
    await expect({ width: rectangle.width, height: rectangle.height }).toEqual(WIDE);
    await expect(getComputedStyle(box).backgroundColor).toBe(tokenColor('surface', box));
    await expect(getComputedStyle(box).borderTopColor).toBe(tokenColor('line', box));
    const bars = Array.from(box.querySelectorAll('[aria-hidden]'));
    const { paddingLeft, paddingRight } = getComputedStyle(box);
    const innerWidth =
      box.clientWidth - Number.parseFloat(paddingLeft) - Number.parseFloat(paddingRight);
    const gaps = BAR_SHARES.map((share, index) =>
      Math.abs((bars[index]?.getBoundingClientRect().width ?? 0) - share * innerWidth),
    );
    await expect(bars).toHaveLength(BAR_SHARES.length);
    await expect(Math.max(...gaps)).toBeLessThanOrEqual(BAR_WIDTH_TOLERANCE);
  },
};

// The capture failed: a dashed border in the field's color, the reason inside, nothing to open.
export const LeftOut: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-space-4">
      <ThumbnailLeftOut caption={COMPUTER} reason={NOT_CAPTURED} {...WIDE} />
      <ThumbnailLeftOut caption={PHONE} reason="not captured" {...NARROW} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    const reason = canvas.getByText(NOT_CAPTURED);
    const rectangle = reason.getBoundingClientRect();
    await expect({ width: rectangle.width, height: rectangle.height }).toEqual(WIDE);
    const { borderTopStyle, borderTopColor, color, textAlign } = getComputedStyle(reason);
    await expect({ borderTopStyle, borderTopColor, color, textAlign }).toEqual({
      borderTopStyle: 'dashed',
      borderTopColor: tokenColor('field', reason),
      color: tokenColor('ink-muted', reason),
      textAlign: 'center',
    });
  },
};
