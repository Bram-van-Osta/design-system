import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { RouterLink } from '../../testing/RouterLink.tsx';
import { tokenColor } from '../../testing/token-color.ts';
import { StatusMark, StatusMarkLevel } from '../StatusMark/StatusMark.tsx';
import { Stat } from './Stat.tsx';
import { StatGrid } from './StatGrid.tsx';
import { StatLink } from './StatLink.tsx';
import { StatGridColumns } from './stat-grid-columns.ts';
import { StatLayout } from './stat-layout.ts';

const FIGURES = 'In figures';
// Inter Tight's heading-s on a computer, heading-xs on a phone.
const FIGURE_SIZES = { computer: '28px', phone: '22px' } as const;

function columnsOf(grid: HTMLElement): number {
  return getComputedStyle(grid).gridTemplateColumns.split(' ').length;
}

// T13-D1-SiteActuel-D: the current site in figures, two to fix and three to improve marked.
const meta = {
  title: 'Feedback/StatGrid',
  component: StatGrid,
  args: { 'aria-label': FIGURES },
  render: (args) => (
    <StatGrid {...args}>
      <Stat layout={StatLayout.figureFirst} label="pages read" value={16} />
      <Stat layout={StatLayout.figureFirst} label="captured" value={4} />
      <Stat
        layout={StatLayout.figureFirst}
        label="to fix"
        value={2}
        mark={<StatusMark level={StatusMarkLevel.poor} />}
      />
      <Stat
        layout={StatLayout.figureFirst}
        label="to improve"
        value={3}
        note="the images and the sharing"
        mark={<StatusMark level={StatusMarkLevel.fair} />}
      />
    </StatGrid>
  ),
} satisfies Meta<typeof StatGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentSiteFigures: Story = {
  play: async ({ canvas }) => {
    const grid = canvas.getByLabelText(FIGURES);
    await expect(grid.tagName).toBe('DL');
    await expect(columnsOf(grid)).toBe(2);
    const terms = within(grid).getAllByRole('term');
    await expect(terms.map((term) => term.textContent)).toEqual([
      'pages read',
      'captured',
      'to fix',
      'to improve',
    ]);
    const [figure] = within(grid).getAllByRole('definition');
    if (figure === undefined) {
      throw new Error('Each tile holds its figure.');
    }
    const label = terms[0];
    await expect(figure.getBoundingClientRect().top).toBeLessThan(
      label?.getBoundingClientRect().top ?? 0,
    );
    await expect(getComputedStyle(figure).fontSize).toBe(
      isOnAComputer() ? FIGURE_SIZES.computer : FIGURE_SIZES.phone,
    );
    const toFix = terms[2];
    const mark = toFix?.querySelector('[data-level="poor"]');
    await expect(mark).not.toBeNull();
    await expect(mark?.getAttribute('aria-hidden')).toBe('true');
    const note = canvas.getByText('the images and the sharing');
    await expect(note.getBoundingClientRect().top).toBeGreaterThan(
      terms[3]?.getBoundingClientRect().top ?? 0,
    );
    await expect(getComputedStyle(note).color).toBe(tokenColor('ink-muted', note));
  },
};

// Six a row on a computer, still two on a phone.
export const SixColumns: Story = {
  args: { columns: StatGridColumns.six },
  play: async ({ canvas }) => {
    const grid = canvas.getByLabelText(FIGURES);
    await expect(columnsOf(grid)).toBe(isOnAComputer() ? 6 : 2);
  },
};

// T13-D4-Fichiers-D: the categories as links, which are not terms: the grid as a navigation.
export const Links: Story = {
  render: () => (
    <StatGrid columns={StatGridColumns.three} render={<nav aria-label="The organized folder" />}>
      <StatLink
        layout={StatLayout.figureFirst}
        label="Logo"
        value={2}
        note="1 vector"
        render={<RouterLink to="/files/logo" />}
      />
      <StatLink
        layout={StatLayout.figureFirst}
        label="Photos"
        value={18}
        note="12 kept for the site"
        href="#photos"
      />
      <StatLink
        layout={StatLayout.figureFirst}
        label="Texts"
        value={6}
        note="taken from your site"
        href="#texts"
      />
    </StatGrid>
  ),
  play: async ({ canvas }) => {
    const grid = canvas.getByRole('navigation', { name: 'The organized folder' });
    await expect(columnsOf(grid)).toBe(isOnAComputer() ? 3 : 2);
    const logo = canvas.getByRole('link', { name: 'Logo 2 1 vector' });
    await expect(logo).toHaveAttribute('href', '/files/logo');
    await expectHeightAtLeast(logo, 'target-min');
    await userEvent.tab();
    await expectFocusRing(logo);
  },
};
