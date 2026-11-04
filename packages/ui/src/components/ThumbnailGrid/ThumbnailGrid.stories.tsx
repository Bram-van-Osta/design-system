import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import {
  expectCenteredImage,
  expectTileBox,
  expectTileCaption,
  firstRowOf,
  PHOTO_SIZE,
  tileOf,
} from '../../testing/expect-thumbnail-tile.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { pageCapture } from '../../testing/page-capture.ts';
import { RouterLink } from '../../testing/RouterLink.tsx';
import { stayOnThePage } from '../../testing/stay-on-the-page.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { ImageViewer } from '../ImageViewer/ImageViewer.tsx';
import { ThumbnailFileTile } from './ThumbnailFileTile.tsx';
import { ThumbnailFileTileLink } from './ThumbnailFileTileLink.tsx';
import { ThumbnailGrid } from './ThumbnailGrid.tsx';
import { ThumbnailTile } from './ThumbnailTile.tsx';
import { ThumbnailTileAwaited } from './ThumbnailTileAwaited.tsx';

const GRID_LABEL = 'Photos';
const KEPT = 'kept for the site';
const BEING_SORTED = 'being sorted';
const PHOTO = pageCapture(PHOTO_SIZE);
const COMPUTER_COLUMNS = 4;
const PHONE_COLUMNS = 2;
// A pixel of rounding either way between two columns or two rows.
const GAP_TOLERANCE = 1;

interface Photo {
  readonly fileName: string;
  readonly isKept: boolean;
}

const PHOTOS: readonly Photo[] = [
  { fileName: 'shop-front-morning.jpg', isKept: true },
  { fileName: 'IMG_2034.HEIC', isKept: true },
  { fileName: 'bakehouse-1.jpg', isKept: false },
  { fileName: 'holiday-bread.jpg', isKept: true },
  { fileName: 'team-2023.jpg', isKept: false },
  { fileName: 'christmas-window.jpg', isKept: true },
  { fileName: 'IMG_1988.HEIC', isKept: false },
  { fileName: 'croissants.jpg', isKept: true },
];

function labelOf(fileName: string): string {
  return `Open ${fileName}`;
}

function PhotoTiles({ onOpen }: { readonly onOpen: (photo: Photo) => void }) {
  return PHOTOS.map((photo) => (
    <ThumbnailTile
      key={photo.fileName}
      src={PHOTO}
      label={labelOf(photo.fileName)}
      fileName={photo.fileName}
      note={photo.isKept ? KEPT : undefined}
      onClick={() => onOpen(photo)}
    />
  ));
}

// REF-T9-01-Categorie-D and -M: a category of the client's files, opened.
const meta = {
  title: 'Layout/ThumbnailGrid',
  component: ThumbnailGrid,
  args: { label: GRID_LABEL, children: null },
  argTypes: { children: { control: false } },
} satisfies Meta<typeof ThumbnailGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const opened = fn();

// Four columns on a computer, two on a phone; each image a button that opens it.
export const Photos: Story = {
  render: (args) => (
    <ThumbnailGrid {...args}>
      <PhotoTiles onOpen={opened} />
    </ThumbnailGrid>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('list', { name: GRID_LABEL })).toBeVisible();
    const tiles = canvas.getAllByRole('listitem');
    await expect(tiles).toHaveLength(PHOTOS.length);
    const row = firstRowOf(tiles);
    const columns = isOnAComputer() ? COMPUTER_COLUMNS : PHONE_COLUMNS;
    await expect(row).toHaveLength(columns);
    const [first, second] = tiles;
    const below = tiles[columns];
    if (first === undefined || second === undefined || below === undefined) {
      throw new Error('The grid has two rows.');
    }
    const columnGap = second.getBoundingClientRect().left - first.getBoundingClientRect().right;
    const rowGap = below.getBoundingClientRect().top - first.getBoundingClientRect().bottom;
    await expect(Math.abs(columnGap - tokenPixels('space-4'))).toBeLessThanOrEqual(GAP_TOLERANCE);
    await expect(Math.abs(rowGap - tokenPixels('space-5'))).toBeLessThanOrEqual(GAP_TOLERANCE);

    const tile = canvas.getByRole('button', { name: labelOf('shop-front-morning.jpg') });
    await expectTileBox(tile);
    await expectCenteredImage(tile);
    const notes = canvas.getAllByText(KEPT);
    await expectTileCaption(canvas.getByText('shop-front-morning.jpg'), notes[0]);
    await expectTileCaption(canvas.getByText('bakehouse-1.jpg'));
    await expect(tileOf(tile)).not.toContainElement(canvas.getByText('bakehouse-1.jpg'));

    opened.mockClear();
    await userEvent.click(tile);
    await expect(opened).toHaveBeenCalledWith(PHOTOS[0]);
  },
};

export const Keyboard: Story = {
  render: Photos.render,
  play: async ({ canvas }) => {
    opened.mockClear();
    await userEvent.tab();
    const tile = canvas.getByRole('button', { name: labelOf('shop-front-morning.jpg') });
    await expectFocusRing(tile);
    await userEvent.keyboard('{Enter}');
    await expect(opened).toHaveBeenCalledOnce();
  },
};

function GridWithTheViewer({ label }: { readonly label?: string }) {
  const [shown, setShown] = useState<Photo | null>(null);
  return (
    <>
      <ThumbnailGrid label={label}>
        <PhotoTiles onOpen={setShown} />
      </ThumbnailGrid>
      <ImageViewer
        open={shown !== null}
        onOpenChange={(open) => setShown(open ? shown : null)}
        title={shown?.fileName ?? ''}
        description={shown?.isKept ? KEPT : undefined}
        src={PHOTO}
        alt={`The photo ${shown?.fileName ?? ''}`}
      />
    </>
  );
}

// An image opens whole in the ImageViewer; closed, the focus goes back to its tile.
export const OpensTheViewer: Story = {
  render: (args) => <GridWithTheViewer label={args.label} />,
  play: async ({ canvas }) => {
    const tile = canvas.getByRole('button', { name: labelOf('holiday-bread.jpg') });
    await userEvent.click(tile);
    const viewer = await screen.findByRole('dialog', { name: 'holiday-bread.jpg' });
    await expect(viewer).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(tile).toHaveFocus();
  },
};

// Files without an image, by their format: a PDF that downloads, a Word document that does not
// open, beside an image and a file on its way.
export const Files: Story = {
  args: { label: 'Documents' },
  render: (args) => (
    <ThumbnailGrid {...args}>
      <ThumbnailFileTileLink
        format="PDF"
        fileName="holiday-menu.pdf"
        note={KEPT}
        href="#holiday-menu.pdf"
        download
        onClick={stayOnThePage}
      />
      <ThumbnailFileTile format="Word" fileName="holiday menu 2024.docx" />
      <ThumbnailFileTileLink
        format="PDF"
        fileName="legal-notice.pdf"
        render={<RouterLink to="/files/legal-notice" />}
        onClick={stayOnThePage}
      />
      <ThumbnailTileAwaited fileName="loyalty-card-scan.jpg" note={BEING_SORTED} />
    </ThumbnailGrid>
  ),
  play: async ({ canvas }) => {
    const download = canvas.getByRole('link', { name: 'PDF holiday-menu.pdf' });
    await expect(download).toHaveAttribute('href', '#holiday-menu.pdf');
    await expect(download).toHaveAttribute('download');
    await expect(download).toHaveTextContent('PDF');
    await expectTileBox(download);
    const { backgroundColor, color, fontFamily } = getComputedStyle(download);
    await expect({ backgroundColor, color }).toEqual({
      backgroundColor: tokenColor('surface', download),
      color: tokenColor('ink-muted', download),
    });
    await expect(fontFamily).toContain('IBM Plex Mono');

    const word = canvas.getByText('Word');
    await expectTileBox(word);
    await expect(tileOf(word).querySelector('a, button')).toBeNull();
    await expectTileCaption(canvas.getByText('holiday menu 2024.docx'));

    const routed = canvas.getByRole('link', { name: 'PDF legal-notice.pdf' });
    await expect(routed).toHaveAttribute('data-router-link');
    await expect(routed).toHaveAttribute('href', '/files/legal-notice');
    await userEvent.tab();
    await expectFocusRing(download);
  },
};

// Files on their way: the box on surface, three bars, its name and its note under it.
export const Awaited: Story = {
  args: { label: 'Latest drops' },
  render: (args) => (
    <ThumbnailGrid {...args}>
      <ThumbnailTileAwaited fileName="loyalty-card-scan.jpg" note={BEING_SORTED} />
      <ThumbnailTileAwaited fileName="IMG_2101.HEIC" note={BEING_SORTED} />
      <ThumbnailTileAwaited fileName="terrace.jpg" />
    </ThumbnailGrid>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull();
    const [box] = canvas.getAllByRole('status');
    if (box === undefined) {
      throw new Error('The awaited tile has a box.');
    }
    await expect(box).toHaveTextContent(/loading|chargement/i);
    await expectTileBox(box);
    await expect(getComputedStyle(box).backgroundColor).toBe(tokenColor('surface', box));
    await expectTileCaption(
      canvas.getByText('loyalty-card-scan.jpg'),
      canvas.getAllByText(BEING_SORTED)[0],
    );
  },
};

// A long name without a space wraps within its column, never past it.
export const LongNames: Story = {
  render: (args) => (
    <ThumbnailGrid {...args}>
      <ThumbnailTile
        src={PHOTO}
        label={labelOf('the-shop-front-on-a-winter-morning')}
        fileName="the-shop-front-on-a-winter-morning-with-the-lights-on-before-opening.jpg"
        note={KEPT}
      />
      <ThumbnailFileTile
        format="Excel"
        fileName="prices_of_every_cake_and_every_log_for_the_holidays_2024_final_v3.xlsx"
      />
    </ThumbnailGrid>
  ),
  play: async ({ canvas }) => {
    for (const name of canvas.getAllByText(/_|-with-/)) {
      const tile = tileOf(name);
      await expect(name.getBoundingClientRect().right).toBeLessThanOrEqual(
        tile.getBoundingClientRect().right,
      );
      await expect(name.scrollWidth).toBeLessThanOrEqual(name.clientWidth);
    }
  },
};
