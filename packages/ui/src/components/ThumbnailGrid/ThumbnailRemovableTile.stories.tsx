import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
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
import { type ColorToken, tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Field } from '../Field/Field.tsx';
import { TextArea } from '../TextArea/TextArea.tsx';
import { ThumbnailGrid } from './ThumbnailGrid.tsx';
import { ThumbnailRemovableTile } from './ThumbnailRemovableTile.tsx';
import { ThumbnailGridColumns } from './thumbnail-grid-columns.ts';

const GRID_LABEL = 'Images that speak to you';
const WHY = 'Why this image?';
const BEING_SORTED = 'being sorted';
const REFUSED = 'unreadable image: remove it';
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

const FIRST_REMOVE = removeLabelOf('a painted shop sign');

function boxOf(removeButton: HTMLElement): HTMLElement {
  const box = removeButton.previousElementSibling;
  if (!(box instanceof HTMLElement)) {
    throw new Error('The remove button sits over the image box.');
  }
  return box;
}

// Over the box's corner in every state: a 44 px square on the page's background, square, flat.
async function expectRemoveOverCorner(remove: HTMLElement): Promise<void> {
  await expectHeightAtLeast(remove, 'target-min');
  const removeBox = remove.getBoundingClientRect();
  const imageBox = boxOf(remove).getBoundingClientRect();
  await expect(removeBox.width).toBe(tokenPixels('target-min'));
  await expect(Math.round(imageBox.right - removeBox.right)).toBe(tokenPixels('space-2'));
  await expect(Math.round(removeBox.top - imageBox.top)).toBe(tokenPixels('space-2'));
  const { backgroundColor, color, borderTopWidth, borderRadius, boxShadow } =
    getComputedStyle(remove);
  await expect({ backgroundColor, color, borderTopWidth, borderRadius, boxShadow }).toEqual({
    backgroundColor: tokenColor('bg', remove),
    color: tokenColor('ink', remove),
    borderTopWidth: '0px',
    borderRadius: '0px',
    boxShadow: 'none',
  });
}

// The app's field under the box, or under its note, within the same tile.
async function expectFieldUnder(above: HTMLElement): Promise<void> {
  const field = within(tileOf(above)).getByRole('textbox', { name: WHY });
  const gap = field.getBoundingClientRect().top - above.getBoundingClientRect().bottom;
  await expect(gap).toBeGreaterThanOrEqual(tokenPixels('space-4') - GAP_TOLERANCE);
}

// The note right under the box, in IBM Plex Mono and its color; the field under it.
async function expectNote(remove: HTMLElement, text: string, color: ColorToken): Promise<void> {
  const note = within(tileOf(remove)).getByText(text);
  const { color: noteColor, fontFamily } = getComputedStyle(note);
  await expect(noteColor).toBe(tokenColor(color, note));
  await expect(fontFamily).toContain('IBM Plex Mono');
  const gap = note.getBoundingClientRect().top - boxOf(remove).getBoundingClientRect().bottom;
  await expect(Math.abs(gap - tokenPixels('space-2'))).toBeLessThanOrEqual(GAP_TOLERANCE);
  await expectFieldUnder(note);
}

interface InspirationTileProps {
  readonly inspiration: Inspiration;
  readonly src: string | null;
  readonly onRemove: () => void;
  readonly note?: ReactNode;
  readonly isRefused?: boolean;
  readonly disabled?: boolean;
}

function InspirationTile({ inspiration, disabled, ...tile }: InspirationTileProps) {
  return (
    <ThumbnailRemovableTile
      {...tile}
      removeLabel={removeLabelOf(inspiration.name)}
      disabled={disabled}
    >
      <Field label={WHY} disabled={disabled}>
        <TextArea rows={2} defaultValue={inspiration.why} />
      </Field>
    </ThumbnailRemovableTile>
  );
}

// REF-T6-Q62-Images-D: the images the client added, each with why it speaks to them. The first
// tile takes the story's state; the others are served.
const meta = {
  title: 'Forms/ThumbnailRemovableTile',
  component: ThumbnailRemovableTile,
  args: {
    src: PHOTO,
    removeLabel: FIRST_REMOVE,
    onRemove: fn(),
  },
  argTypes: { children: { control: false } },
  render: (args) => (
    <ThumbnailGrid label={GRID_LABEL} columns={ThumbnailGridColumns.two}>
      {INSPIRATIONS.map((inspiration, index) =>
        index === 0 ? (
          <InspirationTile
            key={inspiration.name}
            inspiration={inspiration}
            src={args.src}
            note={args.note}
            isRefused={args.isRefused}
            onRemove={args.onRemove}
            disabled={args.disabled}
          />
        ) : (
          <InspirationTile
            key={inspiration.name}
            inspiration={inspiration}
            src={PHOTO}
            onRemove={() => undefined}
            disabled={args.disabled}
          />
        ),
      )}
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

    const remove = canvas.getByRole('button', { name: FIRST_REMOVE });
    const box = boxOf(remove);
    await expectTileBox(box);
    await expectCenteredImage(box);
    await expect(within(first).queryByRole('status')).toBeNull();
    await expectRemoveOverCorner(remove);
    // The pointer's hover cannot be simulated: its surface is pinned by its class.
    await expect(remove).toHaveClass('hover:not-data-disabled:bg-surface');

    const field = within(first).getByRole('textbox', { name: WHY });
    await expect(field).toHaveValue(INSPIRATIONS[0]?.why);
    await expectFieldUnder(box);
    await expect(tileOf(field)).toBe(first);
  },
};

// Dropped, not served yet: the awaited box on surface in the 4:3 frame, three bars, read as
// "Loading…"; the remove button over its corner, the field under it.
export const Awaited: Story = {
  args: { src: null },
  play: async ({ canvas }) => {
    const remove = canvas.getByRole('button', { name: FIRST_REMOVE });
    const box = boxOf(remove);
    await expect(box).toHaveAttribute('role', 'status');
    await expect(box).toHaveTextContent(/loading|chargement/i);
    await expect(box.querySelector('img')).toBeNull();
    await expectTileBox(box);
    await expect(getComputedStyle(box).backgroundColor).toBe(tokenColor('surface', box));
    await expectRemoveOverCorner(remove);
    await expectFieldUnder(box);
    await expect(canvas.getAllByRole('status')).toHaveLength(1);
  },
};

// A line under the box, in Delft blue, above the field: what happens to the image meanwhile.
export const WithANote: Story = {
  args: { src: null, note: BEING_SORTED },
  play: async ({ canvas }) => {
    const remove = canvas.getByRole('button', { name: FIRST_REMOVE });
    await expect(boxOf(remove)).toHaveAttribute('role', 'status');
    await expectRemoveOverCorner(remove);
    await expectNote(remove, BEING_SORTED, 'delft');
  },
};

// The cleaning refused it: a dashed box in the field's color, empty, nothing loading; the note in
// vermilion says why, and the remove button takes it back.
export const Refused: Story = {
  args: { src: null, isRefused: true, note: REFUSED },
  play: async ({ canvas, args }) => {
    const remove = canvas.getByRole('button', { name: FIRST_REMOVE });
    const box = boxOf(remove);
    await expectTileBox(box, { color: 'field', style: 'dashed' });
    await expect(box).toBeEmptyDOMElement();
    await expect(canvas.queryByRole('status')).toBeNull();
    await expectRemoveOverCorner(remove);
    await expectNote(remove, REFUSED, 'vermillion');
    await userEvent.click(remove);
    await expect(args.onRemove).toHaveBeenCalledOnce();
  },
};

// Refused wins over an image given anyway: none is shown.
export const RefusedWithASource: Story = {
  args: { isRefused: true, note: REFUSED },
  play: async ({ canvas }) => {
    const box = boxOf(canvas.getByRole('button', { name: FIRST_REMOVE }));
    await expect(box.querySelector('img')).toBeNull();
    await expectTileBox(box, { color: 'field', style: 'dashed' });
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
            src={PHOTO}
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
    const remove = canvas.getByRole('button', { name: FIRST_REMOVE });
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
    const remove = canvas.getByRole('button', { name: FIRST_REMOVE });
    await expect(remove).toBeDisabled();
    await expect(getComputedStyle(remove).color).toBe(tokenColor('ink-muted', remove));
    await userEvent.click(remove);
    await expect(args.onRemove).not.toHaveBeenCalled();
    await expect(within(tileOf(remove)).getByRole('textbox', { name: WHY })).toBeDisabled();
  },
};

// On a phone, whatever the run's screen: one column, each tile the grid's width, the remove
// button over the corner of a refused image as of a served one.
export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  args: { src: null, isRefused: true, note: REFUSED },
  play: async ({ canvas }) => {
    const grid = canvas.getByRole('list', { name: GRID_LABEL });
    const tiles = within(grid).getAllByRole('listitem');
    await expect(firstRowOf(tiles)).toHaveLength(PHONE_COLUMNS);
    for (const tile of tiles) {
      await expect(tile.getBoundingClientRect().width).toBe(grid.getBoundingClientRect().width);
    }
    const refused = canvas.getByRole('button', { name: FIRST_REMOVE });
    await expectRemoveOverCorner(refused);
    await expectNote(refused, REFUSED, 'vermillion');
    await expectRemoveOverCorner(
      canvas.getByRole('button', { name: removeLabelOf('a kraft paper bag') }),
    );
    await expect(grid.scrollWidth).toBeLessThanOrEqual(grid.clientWidth);
  },
};
