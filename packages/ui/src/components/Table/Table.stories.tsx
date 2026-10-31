import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Table } from './Table.tsx';

const meta = {
  title: 'Layout/Table',
  component: Table,
  args: {
    caption: 'Why, and on what basis',
    columns: [
      { id: 'purpose', label: 'For' },
      { id: 'basis', label: 'On what basis' },
    ],
    rows: [
      {
        id: 'request',
        cells: [
          'Studying your request and answering you',
          'The steps before a contract, at your request',
        ],
      },
      { id: 'project', cells: ['Carrying out your project', 'The contract between us'] },
      { id: 'account', cells: ['Protecting your account', 'Our legitimate interest'] },
      { id: 'invoices', cells: ['Invoicing you', 'A legal obligation'] },
    ],
  },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
  },
  // The reading column of REF-T10-02-Sommaire-D and -M.
  decorators: [
    (Story) => (
      <div className="max-w-reading-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// The table never widens the page; when it is wider than its column, its box scrolls and the
// keyboard reaches it, named by the caption.
async function expectContained(canvasElement: HTMLElement, caption: string): Promise<void> {
  const page = canvasElement.ownerDocument.documentElement;
  await expect(page.scrollWidth).toBeLessThanOrEqual(page.clientWidth);
  const table = within(canvasElement).getByRole('table', { name: caption });
  const box = table.parentElement;
  if (box === null) {
    throw new Error('The table has no box.');
  }
  const isOverflowing = box.scrollWidth > box.clientWidth;
  await waitFor(() => expect(box.hasAttribute('tabindex')).toBe(isOverflowing));
  if (!isOverflowing) {
    return;
  }
  await expect(within(canvasElement).getByRole('region', { name: caption })).toBe(box);
  await userEvent.tab();
  await expectFocusRing(box);
}

export const Purposes: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const headers = canvas.getAllByRole('columnheader');
    await expect(headers.map((header) => header.textContent)).toEqual(['For', 'On what basis']);
    await expect(canvas.getAllByRole('row')).toHaveLength(args.rows.length + 1);
    await expectContained(canvasElement, 'Why, and on what basis');
  },
};

export const Processors: Story = {
  args: {
    caption: 'Who else processes it',
    columns: [
      { id: 'processor', label: 'Processor' },
      { id: 'purpose', label: 'For' },
      { id: 'place', label: 'Where' },
    ],
    rows: [
      { id: 'hosting', cells: ['Example Hosting', 'Hosting the portal and your files', 'France'] },
      { id: 'ai', cells: ['Example AI', 'The AI tools', 'United States'] },
      { id: 'mail', cells: ['Example Mail', 'Sending the mails', 'Ireland'] },
    ],
  },
  play: async ({ canvasElement }) => {
    await expectContained(canvasElement, 'Who else processes it');
  },
};

export const Retention: Story = {
  args: {
    caption: 'How long',
    columns: [
      { id: 'what', label: 'What' },
      { id: 'kept', label: 'Kept' },
      { id: 'then', label: 'Then' },
    ],
    rows: [
      { id: 'draft', cells: ['A request never sent', 'Seven days without activity', 'Erased'] },
      {
        id: 'request',
        cells: [
          'A request without follow-up',
          'Six months',
          'Archived, your contact details erased three years after our last exchange',
        ],
      },
      {
        id: 'project',
        cells: [
          'Your project and your account',
          'The time of the project and the subscription, then six months',
          'Archived, your contact details erased three years after the end of our relationship',
        ],
      },
      { id: 'invoices', cells: ['Your invoices', 'Ten years', 'Erased'] },
    ],
  },
  play: async ({ canvasElement }) => {
    await expectContained(canvasElement, 'How long');
  },
};

// Words that cannot break, such as addresses, overflow a phone's column: the box scrolls.
export const WiderThanTheScreen: Story = {
  args: {
    caption: 'Their own policies',
    columns: [
      { id: 'processor', label: 'Processor' },
      { id: 'policy', label: 'Its privacy policy' },
    ],
    rows: [
      {
        id: 'hosting',
        cells: ['Example Hosting', 'https://hosting.example.com/legal/privacy'],
      },
      {
        id: 'mail',
        cells: ['Example Mail', 'https://mail.example.com/legal/processingagreement'],
      },
    ],
  },
  play: async ({ canvas, canvasElement }) => {
    await expectContained(canvasElement, 'Their own policies');
    const isPhone =
      canvasElement.ownerDocument.documentElement.clientWidth < tokenPixels('reading-width');
    await expect(canvas.queryAllByRole('region', { name: 'Their own policies' })).toHaveLength(
      isPhone ? 1 : 0,
    );
  },
};
