import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import {
  expectCenteredImage,
  expectTileBox,
  firstRowOf,
  PHOTO_SIZE,
  tileOf,
} from '../../testing/expect-thumbnail-tile.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { pageCapture } from '../../testing/page-capture.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Field } from '../Field/Field.tsx';
import { TextArea } from '../TextArea/TextArea.tsx';
import { ThumbnailGrid } from './ThumbnailGrid.tsx';
import { ThumbnailRemovableTile } from './ThumbnailRemovableTile.tsx';
import { ThumbnailGridColumns } from './thumbnail-grid-columns.ts';

const GRID_LABEL = 'Images that speak to you';
const WHY = 'Why this image?';
const PHOTO = pageCapture(PHOTO_SIZE);
const COMPUTER_COLUMNS = 2;
const PHONE_COLUMNS = 1;
// A pixel of rounding either way between two columns, two rows or the box and its field.
const GAP_TOLERANCE = 1;

interface Inspiration {
  readonly name: string;
  readonly why: string;
}

const INSPIRATIONS: readonly Inspiration[] = [
  { name: 'a painted shop sign', why: 'The letters painted by hand, as they used to be.' },
  { name: 'a kraft paper bag', why: 'Simple, cheap, and people remember it.' },
  { name: 'a magazine page', why: 'The bread up close. You can see the crust.' },
  { name: 'a cafe floor tiling', why: 'Black and white, like an old shop.' },
];

function removeLabelOf(name: string): string {
  return `Remove the image: ${name}`;
}

function boxOf(removeButton: HTMLElement): HTMLElement {
  const box = removeButton.parentElement;
  if (box === null) {
    throw new Error('The remove button sits in the image box.');
  }
  return box;
}

interface InspirationTileProps {
  readonly inspiration: Inspiration;
  readonly onRemove: () => void;
  readonly disabled?: boolean;
}

function InspirationTile({ inspiration, onRemove, disabled }: InspirationTileProps) {
  return (
    <ThumbnailRemovableTile
      src={PHOTO}
      removeLabel={removeLabelOf(inspiration.name)}
      onRemove={onRemove}
      disabled={disabled}
    >
      <Field label={WHY} disabled={disabled}>
        <TextArea rows={2} defaultValue={inspiration.why} />
      </Field>
    </ThumbnailRemovableTile>
  );
}

// REF-T6-Q62-Images-D: the images the client added, each with why it speaks to them.
const meta = {
  title: 'Forms/ThumbnailRemovableTile',
  component: ThumbnailRemovableTile,
  args: {
    src: PHOTO,
    removeLabel: removeLabelOf('a painted shop sign'),
    onRemove: fn(),
  },
  argTypes: { children: { control: false } },
  render: (args) => (
    <ThumbnailGrid label={GRID_LABEL} columns={ThumbnailGridColumns.two}>
      {INSPIRATIONS.map((inspiration, index) => (
        <InspirationTile
          key={inspiration.name}
          inspiration={inspiration}
          onRemove={index === 0 ? args.onRemove : () => undefined}
          disabled={args.disabled}
        />
      ))}
    </ThumbnailGrid>
  ),
} satisfies Meta<typeof ThumbnailRemovableTile>;

export default meta;
type Story = StoryObj<typeof meta>;

// At rest: two columns on a computer, one on a phone; the remove button over the image's corner,
// a 44 px square on the page's background; the field under the image.
export const Images: Story = {
  play: async ({ canvas }) => {
    const tiles = within(canvas.getByRole('list', { name: GRID_LABEL })).getAllByRole('listitem');
    await expect(tiles).toHaveLength(INSPIRATIONS.length);
    const columns = isOnAComputer() ? COMPUTER_COLUMNS : PHONE_COLUMNS;
    await expect(firstRowOf(tiles)).toHaveLength(columns);
    const [first, second] = tiles;
    if (first === undefined || second === undefined) {
      throw new Error('The grid has two tiles.');
    }
    if (isOnAComputer()) {
      const columnGap = second.getBoundingClientRect().left - first.getBoundingClientRect().right;
      await expect(Math.abs(columnGap - tokenPixels('space-5'))).toBeLessThanOrEqual(GAP_TOLERANCE);
    }
    const below = tiles[columns];
    const rowGap = (below?.getBoundingClientRect().top ?? 0) - first.getBoundingClientRect().bottom;
    await expect(Math.abs(rowGap - tokenPixels('space-6'))).toBeLessThanOrEqual(GAP_TOLERANCE);

    const remove = canvas.getByRole('button', { name: removeLabelOf('a painted shop sign') });
    const box = boxOf(remove);
    await expectTileBox(box);
    await expectCenteredImage(box);
    await expectHeightAtLeast(remove, 'target-min');
    const removeBox = remove.getBoundingClientRect();
    const imageBox = box.getBoundingClientRect();
    await expect(removeBox.width).toBe(tokenPixels('target-min'));
    await expect(Math.round(imageBox.right - removeBox.right)).toBe(
      tokenPixels('space-2') + tokenPixels('border-hair'),
    );
    await expect(Math.round(removeBox.top - imageBox.top)).toBe(
      tokenPixels('space-2') + tokenPixels('border-hair'),
    );
    const { backgroundColor, color, borderTopWidth, borderRadius, boxShadow } =
      getComputedStyle(remove);
    await expect({ backgroundColor, color, borderTopWidth, borderRadius, boxShadow }).toEqual({
      backgroundColor: tokenColor('bg', remove),
      color: tokenColor('ink', remove),
      borderTopWidth: '0px',
      borderRadius: '0px',
      boxShadow: 'none',
    });
    // The pointer's hover cannot be simulated: its surface is pinned by its class.
    await expect(remove).toHaveClass('hover:not-data-disabled:bg-surface');

    const field = within(first).getByRole('textbox', { name: WHY });
    await expect(field).toHaveValue(INSPIRATIONS[0]?.why);
    const fieldGap = field.getBoundingClientRect().top - imageBox.bottom;
    await expect(fieldGap).toBeGreaterThanOrEqual(tokenPixels('space-4') - GAP_TOLERANCE);
    await expect(tileOf(field)).toBe(first);
  },
};

// The remove button calls `onRemove`; the app takes the tile out of the grid.
export const Remove: Story = {
  render: function RemovableImages(args) {
    const [shown, setShown] = useState(INSPIRATIONS);
    return (
      <ThumbnailGrid label={GRID_LABEL} columns={ThumbnailGridColumns.two}>
        {shown.map((inspiration) => (
          <InspirationTile
            key={inspiration.name}
            inspiration={inspiration}
            onRemove={() => {
              args.onRemove();
              setShown((images) => images.filter((image) => image !== inspiration));
            }}
          />
        ))}
      </ThumbnailGrid>
    );
  },
  play: async ({ canvas, args }) => {
    await userEvent.click(canvas.getByRole('button', { name: removeLabelOf('a kraft paper bag') }));
    await expect(args.onRemove).toHaveBeenCalledOnce();
    await expect(
      canvas.queryByRole('button', { name: removeLabelOf('a kraft paper bag') }),
    ).toBeNull();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(INSPIRATIONS.length - 1);
  },
};

// The keyboard: the tab reaches the remove button, then the image's field; Enter removes it.
export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const remove = canvas.getByRole('button', { name: removeLabelOf('a painted shop sign') });
    await userEvent.tab();
    await expectFocusRing(remove);
    await expect(getComputedStyle(remove).outlineColor).toBe(tokenColor('delft', remove));
    await userEvent.tab();
    await expect(within(tileOf(remove)).getByRole('textbox', { name: WHY })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.keyboard('{Enter}');
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

// Unavailable: the cross in muted ink, nothing happens; the app disables its field too.
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const remove = canvas.getByRole('button', { name: removeLabelOf('a painted shop sign') });
    await expect(remove).toBeDisabled();
    await expect(getComputedStyle(remove).color).toBe(tokenColor('ink-muted', remove));
    await userEvent.click(remove);
    await expect(args.onRemove).not.toHaveBeenCalled();
    await expect(within(tileOf(remove)).getByRole('textbox', { name: WHY })).toBeDisabled();
  },
};
