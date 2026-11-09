import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { ColorSwatches } from './ColorSwatches.tsx';

// A site's own colors, data the app gives: the Boulangerie du Port's navy, sand, brick, cream and
// charcoal (T15-J-Image-D).
const SITE_COLORS = [
  'rgb(30, 58, 95)',
  'rgb(233, 220, 195)',
  'rgb(200, 85, 61)',
  'rgb(247, 243, 234)',
  'rgb(43, 43, 43)',
] as const;
const LABEL = 'The colors most present on your pages';
const MAX_COLORS = 5;

const meta = {
  title: 'Feedback/ColorSwatches',
  component: ColorSwatches,
  args: { colors: SITE_COLORS, label: LABEL },
  render: (args) => (
    <div className="max-w-reading-width">
      <ColorSwatches {...args} />
    </div>
  ),
} satisfies Meta<typeof ColorSwatches>;

export default meta;
type Story = StoryObj<typeof meta>;

function swatchesIn(row: HTMLElement): readonly HTMLElement[] {
  return [...row.children].filter((child) => child instanceof HTMLElement);
}

// Five equal squares, each in a hairline frame, without its code: the row is one image to a screen
// reader.
export const FiveColors: Story = {
  play: async ({ canvas }) => {
    const row = canvas.getByRole('img', { name: LABEL });
    const swatches = swatchesIn(row);
    await expect(swatches).toHaveLength(SITE_COLORS.length);
    await expect(row.textContent).toBe('');
    const first = swatches[0];
    if (first === undefined) {
      throw new Error('No swatch drawn');
    }
    const { width, height } = first.getBoundingClientRect();
    await expect(Math.round(width)).toBe(Math.round(height));
    const { borderTopColor, borderTopWidth, borderRadius, backgroundColor } =
      getComputedStyle(first);
    await expect({ borderTopColor, borderTopWidth, borderRadius }).toEqual({
      borderTopColor: tokenColor('line', first),
      borderTopWidth: `${tokenPixels('border-hair')}px`,
      borderRadius: '0px',
    });
    await expect(backgroundColor).toBe('rgb(30, 58, 95)');
    for (const swatch of swatches) {
      await expect(Math.round(swatch.getBoundingClientRect().width)).toBe(Math.round(width));
    }
  },
};

// Fewer colors than the row holds: each keeps the size it has among five.
export const FewerColors: Story = {
  args: { colors: SITE_COLORS.slice(0, 2), columns: MAX_COLORS },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('img', { name: LABEL });
    const [first] = swatchesIn(row);
    await expect(swatchesIn(row)).toHaveLength(2);
    if (first === undefined) {
      throw new Error('No swatch drawn');
    }
    const gap = tokenPixels('space-2');
    const expected = (row.getBoundingClientRect().width - gap * (MAX_COLORS - 1)) / MAX_COLORS;
    await expect(Math.abs(first.getBoundingClientRect().width - expected)).toBeLessThan(1);
  },
};
