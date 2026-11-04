import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import {
  expectCenteredImage,
  expectTileBox,
  expectTileCaption,
  PHOTO_SIZE,
} from '../../testing/expect-thumbnail-tile.ts';
import { pageCapture } from '../../testing/page-capture.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { ThumbnailCheckboxTile } from './ThumbnailCheckboxTile.tsx';
import { ThumbnailGrid } from './ThumbnailGrid.tsx';

const FILE_NAME = 'shop-front-morning.jpg';
const KEPT = 'kept for the site';
const PHOTO = pageCapture(PHOTO_SIZE);
const SELECTION = 'The photos for the site';
const OTHERS = ['bakehouse-1.jpg', 'holiday-bread.jpg', 'team-2023.jpg'] as const;

function frameOf(checkbox: HTMLElement) {
  const { borderTopColor, borderTopWidth } = getComputedStyle(checkbox, '::after');
  return { borderTopColor, borderTopWidth };
}

function cornerOf(checkbox: HTMLElement): HTMLElement {
  const corner = checkbox.querySelector('span');
  if (corner === null) {
    throw new Error('The tile has its box in the corner.');
  }
  return corner;
}

// The operator ticks the photos of a selection, the client's files among them.
const meta = {
  title: 'Forms/ThumbnailCheckboxTile',
  component: ThumbnailCheckboxTile,
  args: {
    src: PHOTO,
    fileName: FILE_NAME,
    onCheckedChange: fn(),
  },
  argTypes: {
    note: { control: 'text' },
  },
  render: (args) => (
    <ThumbnailGrid label={SELECTION}>
      <ThumbnailCheckboxTile {...args} />
      {OTHERS.map((fileName) => (
        <ThumbnailCheckboxTile key={fileName} src={PHOTO} fileName={fileName} />
      ))}
    </ThumbnailGrid>
  ),
} satisfies Meta<typeof ThumbnailCheckboxTile>;

export default meta;
type Story = StoryObj<typeof meta>;

// At rest: the image on its hairline, an empty box in its corner; a click ticks it.
export const Unchecked: Story = {
  play: async ({ canvas, args }) => {
    const checkbox = canvas.getByRole('checkbox', { name: FILE_NAME });
    await expect(checkbox).not.toBeChecked();
    await expectTileBox(checkbox);
    await expectCenteredImage(checkbox);
    await expectTileCaption(canvas.getByText(FILE_NAME));
    await expect(frameOf(checkbox).borderTopWidth).toBe('0px');
    const corner = cornerOf(checkbox);
    await expect(getComputedStyle(corner).backgroundColor).toBe(tokenColor('bg', corner));

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true, expect.anything());
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false, expect.anything());
  },
};

// Ticked: a Delft frame inside the hairline, the check filled in Delft blue over the corner.
export const Checked: Story = {
  args: { defaultChecked: true, note: KEPT },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole('checkbox', { name: FILE_NAME });
    await expect(checkbox).toBeChecked();
    await expect(frameOf(checkbox)).toEqual({
      borderTopColor: tokenColor('delft', checkbox),
      borderTopWidth: `${tokenPixels('border-select')}px`,
    });
    const corner = cornerOf(checkbox);
    const { backgroundColor, color } = getComputedStyle(corner);
    await expect({ backgroundColor, color }).toEqual({
      backgroundColor: tokenColor('delft', corner),
      color: tokenColor('on-delft', corner),
    });
    const cornerBox = corner.getBoundingClientRect();
    const imageBox = checkbox.getBoundingClientRect();
    await expect(cornerBox.right).toBeLessThanOrEqual(imageBox.right);
    await expect(cornerBox.top).toBeGreaterThanOrEqual(imageBox.top);
    await expectTileCaption(canvas.getByText(FILE_NAME), canvas.getByText(KEPT));
  },
};

// The keyboard: the tab reaches each image, the space bar ticks it.
export const Focus: Story = {
  play: async ({ canvas, args }) => {
    const checkbox = canvas.getByRole('checkbox', { name: FILE_NAME });
    await userEvent.tab();
    await expectFocusRing(checkbox);
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledOnce();
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: OTHERS[0] })).toHaveFocus();
  },
};

// Unavailable, ticked or not: the corner in the line color, nothing changes.
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <ThumbnailGrid label={SELECTION}>
      <ThumbnailCheckboxTile {...args} />
      <ThumbnailCheckboxTile {...args} fileName={OTHERS[0]} defaultChecked />
    </ThumbnailGrid>
  ),
  play: async ({ canvas, args }) => {
    const checkbox = canvas.getByRole('checkbox', { name: FILE_NAME });
    const ticked = canvas.getByRole('checkbox', { name: OTHERS[0] });
    await expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(checkbox);
    await expect(checkbox).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
    await expect(ticked).toBeChecked();
    const corner = cornerOf(ticked);
    const { backgroundColor, borderTopColor } = getComputedStyle(corner);
    await expect({ backgroundColor, borderTopColor }).toEqual({
      backgroundColor: tokenColor('surface', corner),
      borderTopColor: tokenColor('line', corner),
    });
  },
};
