import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
import { expect, fn, userEvent } from 'storybook/test';
import { Locale, MESSAGES } from '../../i18n/messages.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { FieldMarker } from '../Field/field-marker.ts';
import { FileInput, type FileInputProps } from './FileInput.tsx';

const LABEL = 'A document, a link, a photo?';
const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const;
const REFUSED_TYPE = 'This file is not a PDF, nor a JPEG, PNG or WebP image.';
const MENU = new File(['The holiday menu'], 'holiday-menu.pdf', { type: 'application/pdf' });
const PHOTO = new File(['A photo of the shop'], 'shop-front.jpg', { type: 'image/jpeg' });
const NOTES = new File(['Some notes'], 'notes.txt', { type: 'text/plain' });

function isAccepted(file: File): boolean {
  return ACCEPTED_TYPES.some((type) => type === file.type);
}

// The app's side: it checks the file, then keeps its name or says what is wrong.
function CheckedFileInput(props: FileInputProps) {
  const [fileName, setFileName] = useState(props.fileName ?? null);
  const [error, setError] = useState<ReactNode>(props.error);
  return (
    <FileInput
      {...props}
      fileName={fileName}
      error={error}
      onFileChange={(file) => {
        props.onFileChange(file);
        const isRefused = file !== null && !isAccepted(file);
        setError(isRefused ? REFUSED_TYPE : undefined);
        if (!isRefused) {
          setFileName(file?.name ?? null);
        }
      }}
    />
  );
}

// The component's own texts, in the language of the run.
function textsOf(locale: unknown) {
  const messages = MESSAGES[locale === Locale.fr ? Locale.fr : Locale.en];
  return {
    choose: messages['fileInput.choose'],
    remove: messages['fileInput.remove'],
    optional: messages['field.optional'],
  };
}

function fileInputOf(canvasElement: HTMLElement): HTMLInputElement {
  const input = canvasElement.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) {
    throw new Error('The file input is in the page.');
  }
  return input;
}

// REF-T6-B10-Projet-D: a file to go with a project outside the usual path.
const meta = {
  title: 'Forms/FileInput',
  component: FileInput,
  args: {
    label: LABEL,
    marker: FieldMarker.optional,
    description: 'PDF, JPEG, PNG or WebP, 10 MiB at most.',
    accept: '.pdf,image/jpeg,image/png,image/webp',
    onFileChange: fn(),
  },
  render: (args) => <CheckedFileInput {...args} />,
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas, canvasElement, args, globals }) => {
    const texts = textsOf(globals.locale);
    const zone = canvas.getByRole('button', { name: new RegExp(texts.choose) });
    // The label, its marker, then the zone's own words.
    await expect(zone).toHaveAccessibleName(expect.stringContaining(LABEL));
    await expect(zone).toHaveAccessibleName(expect.stringContaining(texts.optional));
    await expectHeightAtLeast(zone, 'button-height');
    await expect(zone).toHaveAccessibleDescription('PDF, JPEG, PNG or WebP, 10 MiB at most.');
    await expect(fileInputOf(canvasElement)).toHaveAttribute('accept', args.accept ?? '');
    await userEvent.tab();
    await expectFocusRing(zone);

    await userEvent.upload(fileInputOf(canvasElement), MENU);
    await expect(args.onFileChange).toHaveBeenLastCalledWith(MENU);
    const remove = canvas.getByRole('button', { name: `${texts.remove} holiday-menu.pdf` });
    await expect(remove).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onFileChange).toHaveBeenLastCalledWith(null);
    await expect(canvas.getByRole('button', { name: new RegExp(texts.choose) })).toHaveFocus();

    const dropped = new DataTransfer();
    dropped.items.add(PHOTO);
    canvas
      .getByRole('button', { name: new RegExp(texts.choose) })
      .dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: dropped }));
    await expect(await canvas.findByText('shop-front.jpg')).toBeVisible();
  },
};

export const Chosen: Story = {
  args: { fileName: 'holiday-menu-with-the-prices-of-every-cake-and-every-log.pdf' },
  play: async ({ canvas, globals }) => {
    const remove = canvas.getByRole('button', {
      name: new RegExp(`^${textsOf(globals.locale).remove} holiday-menu`),
    });
    await expectHeightAtLeast(remove, 'target-min');
  },
};

export const Refused: Story = {
  play: async ({ canvas, canvasElement, globals }) => {
    // As a drop would: the zone does not filter what is dropped, the app checks it.
    await userEvent.setup({ applyAccept: false }).upload(fileInputOf(canvasElement), NOTES);
    await expect(await canvas.findByText(REFUSED_TYPE)).toBeVisible();
    const zone = canvas.getByRole('button', { name: new RegExp(textsOf(globals.locale).choose) });
    await expect(zone).toHaveAttribute('aria-invalid', 'true');
    await expect(zone).toHaveAccessibleDescription(expect.stringContaining(REFUSED_TYPE));
  },
};

export const Disabled: Story = {
  args: { fileName: 'holiday-menu.pdf', disabled: true },
  play: async ({ canvas, globals }) => {
    const remove = canvas.getByRole('button', {
      name: `${textsOf(globals.locale).remove} holiday-menu.pdf`,
    });
    await expect(remove).toBeDisabled();
  },
};
