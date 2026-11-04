import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Locale } from '../../i18n/messages.ts';
import { type ColorToken, tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { ProgressBar } from './ProgressBar.tsx';
import { ProgressBarTone } from './progress-bar-tone.ts';

const LABEL = 'Sending shop-front.jpg';
// The filled part's width is a share of the track's: a pixel of rounding either way.
const WIDTH_TOLERANCE = 1;

const FILL_COLORS: Readonly<Record<ProgressBarTone, ColorToken>> = {
  delft: 'delft',
  muted: 'ink-muted',
  vermilion: 'vermillion',
};

function percentOf(value: number, locale: unknown): string {
  return new Intl.NumberFormat(locale === Locale.fr ? Locale.fr : Locale.en, {
    style: 'percent',
  }).format(value);
}

function partsOf(bar: HTMLElement) {
  const track = bar.firstElementChild;
  const fill = track?.firstElementChild;
  if (!(track instanceof HTMLElement) || !(fill instanceof HTMLElement)) {
    throw new Error('The bar has its track and its filled part.');
  }
  return { track, fill };
}

async function expectBar(bar: HTMLElement, value: number, tone: ProgressBarTone): Promise<void> {
  const { track, fill } = partsOf(bar);
  const trackBox = track.getBoundingClientRect();
  await expect(trackBox.height).toBe(tokenPixels('progress-bar-height'));
  await expect(Math.abs(fill.getBoundingClientRect().width - trackBox.width * value)).toBeLessThan(
    WIDTH_TOLERANCE,
  );
  const { backgroundColor, borderRadius } = getComputedStyle(track);
  await expect({ backgroundColor, borderRadius }).toEqual({
    backgroundColor: tokenColor('line', track),
    borderRadius: '0px',
  });
  await expect(getComputedStyle(fill).backgroundColor).toBe(tokenColor(FILL_COLORS[tone], fill));
}

// A file's upload, under its name: no canvas screen draws it, the identity does.
const meta = {
  title: 'Feedback/ProgressBar',
  component: ProgressBar,
  args: { value: 0.42, label: LABEL },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 1, step: 0.01 } },
    tone: { control: 'inline-radio', options: Object.values(ProgressBarTone) },
  },
  render: (args) => (
    <div className="flex max-w-reading-width flex-col gap-space-2">
      <span className="font-mono text-meta text-ink">shop-front.jpg</span>
      <ProgressBar {...args} />
    </div>
  ),
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Being sent: Delft blue on the line color, its share read as a percentage in the reader's language.
export const Sending: Story = {
  play: async ({ canvas, globals }) => {
    const bar = canvas.getByRole('progressbar', { name: LABEL });
    await expect(bar).toHaveAttribute('aria-valuemin', '0');
    await expect(bar).toHaveAttribute('aria-valuemax', '1');
    await expect(bar).toHaveAttribute('aria-valuenow', '0.42');
    await expect(bar).toHaveAttribute('aria-valuetext', percentOf(0.42, globals.locale));
    await expectBar(bar, 0.42, ProgressBarTone.delft);
  },
};

export const Paused: Story = {
  args: { value: 0.7, tone: ProgressBarTone.muted, label: 'Sending shop-front.jpg, paused' },
  play: async ({ canvas }) => {
    await expectBar(canvas.getByRole('progressbar'), 0.7, ProgressBarTone.muted);
  },
};

export const Failed: Story = {
  args: {
    value: 0.25,
    tone: ProgressBarTone.vermilion,
    label: 'Sending shop-front.jpg, failed',
  },
  play: async ({ canvas }) => {
    await expectBar(canvas.getByRole('progressbar'), 0.25, ProgressBarTone.vermilion);
  },
};

// The ends of the bar, and past them: a value out of 0..1 stays within the bar.
export const Ends: Story = {
  render: () => (
    <div className="flex max-w-reading-width flex-col gap-space-4">
      <ProgressBar value={0} label="Sending holiday-menu.pdf" />
      <ProgressBar value={1} label="Sending logo-final-v3.pdf" />
      <ProgressBar value={1.2} label="Sending team-2023.jpg" />
    </div>
  ),
  play: async ({ canvas, globals }) => {
    const [empty, full, past] = canvas.getAllByRole('progressbar');
    if (empty === undefined || full === undefined || past === undefined) {
      throw new Error('The three bars are in the page.');
    }
    await expectBar(empty, 0, ProgressBarTone.delft);
    await expectBar(full, 1, ProgressBarTone.delft);
    await expectBar(past, 1, ProgressBarTone.delft);
    await expect(past).toHaveAttribute('aria-valuetext', percentOf(1, globals.locale));
  },
};
