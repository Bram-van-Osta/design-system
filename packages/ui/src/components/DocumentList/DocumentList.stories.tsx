import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { RouterLink } from '../../testing/RouterLink.tsx';
import { tokenColor } from '../../testing/token-color.ts';
import { DocumentList } from './DocumentList.tsx';

const LABEL = 'The documents';
const ROW_MIN_HEIGHT = 52;

// T13-A2-Accueil-PreAnalyse-D: the case's documents, the offer yet to come.
const meta = {
  title: 'Layout/DocumentList',
  component: DocumentList,
  args: {
    label: LABEL,
    documents: [
      { id: 'request', name: 'The request', meta: '11 answers', href: '#request' },
      {
        id: 'pre-analysis',
        name: 'The pre-analysis',
        meta: 'handed in at 9:14',
        render: <RouterLink to="/cases/42/pre-analysis" />,
      },
      { id: 'current-site', name: 'The current site', meta: '16 pages read', href: '#site' },
      { id: 'offer', name: 'The offer', meta: 'after your decision', isLater: true },
      {
        id: 'project',
        name: 'The questionnaire, the files, the plan',
        meta: 'with the project',
        isLater: true,
      },
    ],
  },
  argTypes: {
    documents: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-reading-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SomeYetToCome: Story = {
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: LABEL });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(5);
    const links = within(list).getAllByRole('link');
    await expect(links).toHaveLength(3);
    const preAnalysis = canvas.getByRole('link', { name: 'The pre-analysis handed in at 9:14' });
    await expect(preAnalysis).toHaveAttribute('href', '/cases/42/pre-analysis');
    await expect(preAnalysis).toHaveAttribute('data-router-link');
    for (const link of links) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(ROW_MIN_HEIGHT);
      await expect(getComputedStyle(link).color).toBe(tokenColor('ink', link));
    }

    const later = canvas.getByText('The offer').closest('[data-later]');
    if (!(later instanceof HTMLElement)) {
      throw new Error('A document yet to come is a row of its own.');
    }
    await expect(later.getBoundingClientRect().height).toBeGreaterThanOrEqual(ROW_MIN_HEIGHT);
    await expect(getComputedStyle(later).color).toBe(tokenColor('ink-muted', later));
    await expect(later.closest('a')).toBeNull();

    const meta = canvas.getByText('handed in at 9:14');
    await expect(getComputedStyle(meta).color).toBe(tokenColor('ink-muted', meta));
    await expect(meta.getBoundingClientRect().right).toBe(
      preAnalysis.getBoundingClientRect().right,
    );
  },
};

// The links in the tab order, the documents yet to come out of it.
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('link', { name: 'The request 11 answers' }));
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('link', { name: 'The pre-analysis handed in at 9:14' }));
    await userEvent.tab();
    await expectFocusRing(canvas.getByRole('link', { name: 'The current site 16 pages read' }));
    await userEvent.tab();
    await expect(document.activeElement).toBe(document.body);
  },
};

// Longer than the reading column in any monospace font, so that it never fits beside its name.
const LONG_META =
  'handed in on Tuesday at 9:14, read again on Wednesday after the two notes the visitor added, then touched up on Thursday after your remark';

// A meta too long to sit beside its name wraps under it, at the row's start, inside the row.
export const LongMeta: Story = {
  args: {
    documents: [
      { id: 'pre-analysis', name: 'The pre-analysis', meta: LONG_META, href: '#pre-analysis' },
      { id: 'offer', name: 'The offer', meta: LONG_META, isLater: true },
    ],
  },
  play: async ({ canvas }) => {
    const metas = canvas.getAllByText(LONG_META);
    await expect(metas).toHaveLength(2);
    for (const meta of metas) {
      const row = meta.parentElement;
      const name = meta.previousElementSibling;
      if (row === null || name === null) {
        throw new Error('A meta follows its name in its row.');
      }
      const nameBox = name.getBoundingClientRect();
      const metaBox = meta.getBoundingClientRect();
      await expect(metaBox.top).toBeGreaterThanOrEqual(nameBox.bottom);
      await expect(metaBox.left).toBe(nameBox.left);
      await expect(metaBox.right).toBeLessThanOrEqual(row.getBoundingClientRect().right);
      await expect(row.scrollWidth).toBe(row.clientWidth);
    }
  },
};
