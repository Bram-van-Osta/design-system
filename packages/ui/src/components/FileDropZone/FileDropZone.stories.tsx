import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { FileDropZone } from './FileDropZone.tsx';
import { FileDropZoneSize } from './file-drop-zone-size.ts';

const LABEL = 'Drop files';
const DESCRIPTION = 'or drag them here, as they come';
const BACKUP_LABEL = 'Drop the backup';
const BACKUP_TYPES = '(.zip, .sql, .gz)';
const PHOTO = new File(['A photo of the shop'], 'shop-front.jpg', { type: 'image/jpeg' });
const MENU = new File(['The holiday menu'], 'holiday-menu.pdf', { type: 'application/pdf' });
const LOGO = new File(['The logo'], 'logo-final-v3.pdf', { type: 'application/pdf' });
const BACKUP = new File(['The site'], 'site-backup.zip', { type: 'application/zip' });
// Named by what it shows: its label, then its description.
const ZONE = new RegExp(`^${LABEL}`);
const COMPACT_ZONE = new RegExp(`^${BACKUP_LABEL}`);

function fileInputOf(canvasElement: HTMLElement): HTMLInputElement {
  const input = canvasElement.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('The file input is in the page.');
  }
  return input;
}

function dragEventOf(type: 'dragover' | 'drop', files: readonly File[]): DragEvent {
  const dataTransfer = new DataTransfer();
  for (const file of files) {
    dataTransfer.items.add(file);
  }
  return new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer });
}

function heightOf(element: Element): number {
  return element.getBoundingClientRect().height;
}

// REF-T4-07-Fichiers-D and -M: the zone beside the folder, and the backup's zone in its card.
const meta = {
  title: 'Forms/FileDropZone',
  component: FileDropZone,
  args: {
    label: LABEL,
    description: DESCRIPTION,
    onFilesChoose: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: Object.values(FileDropZoneSize) },
    label: { control: 'text' },
    description: { control: 'text' },
  },
} satisfies Meta<typeof FileDropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectFramed(zone: HTMLElement, label: HTMLElement, description: HTMLElement) {
  const { borderTopStyle, borderTopColor, backgroundColor, borderRadius, boxShadow } =
    getComputedStyle(zone);
  await expect({
    borderTopStyle,
    borderTopColor,
    backgroundColor,
    borderRadius,
    boxShadow,
  }).toEqual({
    borderTopStyle: 'dashed',
    borderTopColor: tokenColor('ink', zone),
    backgroundColor: tokenColor('bg', zone),
    borderRadius: '0px',
    boxShadow: 'none',
  });
  await expect(heightOf(zone)).toBeGreaterThanOrEqual(tokenPixels('drop-zone-height'));
  await expect(description.getBoundingClientRect().top).toBeGreaterThanOrEqual(
    label.getBoundingClientRect().bottom,
  );
  await expect(getComputedStyle(description).color).toBe(tokenColor('ink-muted', zone));
}

// T14-S8-Fichiers-D and -M: a dashed frame, its label over its description, on every screen.
export const Large: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const zone = canvas.getByRole('button', { name: ZONE });
    await expect(zone).toHaveAccessibleName(`${LABEL} ${DESCRIPTION}`);
    const input = fileInputOf(canvasElement);
    await expect(input).toHaveAttribute('multiple');
    await expect(input).not.toBeVisible();
    await expectFramed(zone, canvas.getByText(LABEL), canvas.getByText(DESCRIPTION));

    await userEvent.upload(input, [PHOTO, MENU]);
    await expect(args.onFilesChoose).toHaveBeenLastCalledWith([PHOTO, MENU]);
    zone.dispatchEvent(dragEventOf('drop', [LOGO, PHOTO]));
    await expect(args.onFilesChoose).toHaveBeenLastCalledWith([LOGO, PHOTO]);
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, canvasElement }) => {
    const zone = canvas.getByRole('button', { name: ZONE });
    const input = fileInputOf(canvasElement);
    const opened = fn();
    input.addEventListener('click', (event) => {
      event.preventDefault();
      opened();
    });
    await userEvent.tab();
    await expectFocusRing(zone);
    await userEvent.keyboard('{Enter}');
    await expect(opened).toHaveBeenCalledOnce();
  },
};

// Files dragged over the zone, on a computer: its frame turns Delft blue on the surface.
export const DragOver: Story = {
  play: async ({ canvas, args }) => {
    const zone = canvas.getByRole('button', { name: ZONE });
    zone.dispatchEvent(dragEventOf('dragover', [PHOTO]));
    await waitFor(() => expect(zone).toHaveAttribute('data-dragging'));
    if (isOnAComputer()) {
      const { borderTopColor, backgroundColor } = getComputedStyle(zone);
      await expect({ borderTopColor, backgroundColor }).toEqual({
        borderTopColor: tokenColor('delft', zone),
        backgroundColor: tokenColor('surface', zone),
      });
    }
    await expect(args.onFilesChoose).not.toHaveBeenCalled();
  },
};

// T14-S8: inside the card of what depends on the client, lower than the page's zone, its types
// under its label on a computer and on a phone.
export const Compact: Story = {
  args: {
    size: FileDropZoneSize.compact,
    label: BACKUP_LABEL,
    description: BACKUP_TYPES,
    accept: '.zip,.sql,.gz',
  },
  render: (args) => (
    <div className="flex max-w-reading-width flex-col gap-space-3 bg-surface p-space-4">
      <FileDropZone {...args} />
    </div>
  ),
  play: async ({ canvas, canvasElement, args }) => {
    const zone = canvas.getByRole('button', { name: COMPACT_ZONE });
    await expect(zone).toHaveAccessibleName(`${BACKUP_LABEL} ${BACKUP_TYPES}`);
    await expect(fileInputOf(canvasElement)).toHaveAttribute('accept', '.zip,.sql,.gz');
    const { borderTopStyle, backgroundColor } = getComputedStyle(zone);
    await expect({ borderTopStyle, backgroundColor }).toEqual({
      borderTopStyle: 'dashed',
      backgroundColor: tokenColor('bg', zone),
    });
    await expect(heightOf(zone)).toBeGreaterThanOrEqual(tokenPixels('drop-zone-compact-height'));
    const label = canvas.getByText(BACKUP_LABEL);
    const description = canvas.getByText(BACKUP_TYPES);
    await expect(description).toBeVisible();
    await expect(description.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      label.getBoundingClientRect().bottom,
    );
    const labelStyle = getComputedStyle(label);
    await expect({ fontSize: labelStyle.fontSize, fontWeight: labelStyle.fontWeight }).toEqual({
      fontSize: '16px',
      fontWeight: '600',
    });
    await expect(getComputedStyle(description).color).toBe(tokenColor('ink-muted', zone));
    await userEvent.upload(fileInputOf(canvasElement), [BACKUP]);
    await expect(args.onFilesChoose).toHaveBeenLastCalledWith([BACKUP]);
  },
};

// Both zones, unavailable: nothing chosen nor dropped, the zone in the line and muted colors.
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="flex max-w-reading-width flex-col gap-space-5">
      <FileDropZone {...args} />
      <FileDropZone
        {...args}
        size={FileDropZoneSize.compact}
        label={BACKUP_LABEL}
        description={BACKUP_TYPES}
      />
    </div>
  ),
  play: async ({ canvas, args }) => {
    const zone = canvas.getByRole('button', { name: ZONE });
    const compact = canvas.getByRole('button', { name: COMPACT_ZONE });
    await expect(zone).toBeDisabled();
    await expect(compact).toBeDisabled();
    await expect(getComputedStyle(compact).borderTopColor).toBe(tokenColor('line', compact));
    await expect(getComputedStyle(zone).color).toBe(tokenColor('ink-muted', zone));
    zone.dispatchEvent(dragEventOf('dragover', [PHOTO]));
    zone.dispatchEvent(dragEventOf('drop', [PHOTO]));
    await expect(zone).not.toHaveAttribute('data-dragging');
    await expect(args.onFilesChoose).not.toHaveBeenCalled();
  },
};

// On a phone, whatever the run's screen: the large zone keeps its frame and its description.
export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvas }) => {
    const zone = canvas.getByRole('button', { name: ZONE });
    await expectFramed(zone, canvas.getByText(LABEL), canvas.getByText(DESCRIPTION));
    await expect(zone).toHaveAccessibleName(`${LABEL} ${DESCRIPTION}`);
  },
};

const ORIGINAL_LOGO = 'Drop the original file';
const LOGO_TYPES = 'or drag it here · .svg, .ai, .pdf or .png';

// T14-Q08-Fichier-D and -M: a question that takes one file, its types given; a drop of several
// hands the first.
export const OneFile: Story = {
  args: {
    label: ORIGINAL_LOGO,
    description: LOGO_TYPES,
    isMultiple: false,
    accept: '.svg,.ai,.pdf,.png',
  },
  play: async ({ canvas, canvasElement, args }) => {
    const zone = canvas.getByRole('button', { name: `${ORIGINAL_LOGO} ${LOGO_TYPES}` });
    const input = fileInputOf(canvasElement);
    await expect(input).not.toHaveAttribute('multiple');
    await expect(input).toHaveAttribute('accept', '.svg,.ai,.pdf,.png');
    await userEvent.upload(input, LOGO);
    await expect(args.onFilesChoose).toHaveBeenLastCalledWith([LOGO]);
    zone.dispatchEvent(dragEventOf('drop', [LOGO, PHOTO]));
    await expect(args.onFilesChoose).toHaveBeenLastCalledWith([LOGO]);
    await userEvent.tab();
    await expectFocusRing(zone);
  },
};
