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

const FOLDER = 'Your organized folder';
// The label as the title: the label text style, 17 px semibold in ink; the note in small text.
const TITLED_SIZES = { label: '17px', note: '14px', figure: '22px' } as const;
const TITLED_GAPS = { rowGap: '20px', columnGap: '16px' } as const;

function titledCategories(withCounts: boolean) {
  return (
    <StatGrid
      columns={StatGridColumns.three}
      tileLayout={StatLayout.titled}
      render={<nav aria-label={FOLDER} />}
    >
      <StatLink
        layout={StatLayout.titled}
        label="Logo"
        value={withCounts ? 2 : undefined}
        note={withCounts ? 'of which 1 vector' : '2 files'}
        render={<RouterLink to="/files/logo" />}
      />
      <StatLink
        layout={StatLayout.titled}
        label="Photos"
        value={withCounts ? 18 : undefined}
        note={withCounts ? '12 kept for the site' : '18 · 12 kept for the site'}
        href="#photos"
      />
      <StatLink
        layout={StatLayout.titled}
        label="Practical information"
        value={withCounts ? 3 : undefined}
        note="opening hours, address, phone"
        href="#practical"
      />
      <StatLink
        layout={StatLayout.titled}
        label="Your inspirations"
        value={withCounts ? 5 : undefined}
        note="5 images"
        href="#inspirations"
      />
    </StatGrid>
  );
}

// T14-S8-Fichiers-D and -M: the client's categories, without a figure, each under an ink rule.
export const TitledCategories: Story = {
  render: () => titledCategories(false),
  play: async ({ canvas }) => {
    const grid = canvas.getByRole('navigation', { name: FOLDER });
    await expect(columnsOf(grid)).toBe(isOnAComputer() ? 3 : 2);
    const { rowGap, columnGap } = getComputedStyle(grid);
    await expect({ rowGap, columnGap }).toEqual(TITLED_GAPS);

    const logo = canvas.getByRole('link', { name: 'Logo 2 files' });
    await expect(logo).toHaveAttribute('href', '/files/logo');
    await expectHeightAtLeast(logo, 'target-min');
    const tile = getComputedStyle(logo);
    await expect({
      top: tile.borderTopWidth,
      right: tile.borderRightWidth,
      bottom: tile.borderBottomWidth,
      left: tile.borderLeftWidth,
      paddingTop: tile.paddingTop,
      paddingLeft: tile.paddingLeft,
      color: tile.borderTopColor,
    }).toEqual({
      top: '2px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      paddingTop: '12px',
      paddingLeft: '0px',
      color: tokenColor('ink', logo),
    });

    const label = getComputedStyle(within(logo).getByText('Logo'));
    await expect({ size: label.fontSize, weight: label.fontWeight, color: label.color }).toEqual({
      size: TITLED_SIZES.label,
      weight: '600',
      color: tokenColor('ink', logo),
    });
    const noteElement = within(logo).getByText('2 files');
    const note = getComputedStyle(noteElement);
    await expect({ size: note.fontSize, color: note.color }).toEqual({
      size: TITLED_SIZES.note,
      color: tokenColor('ink-muted', logo),
    });
    await expect(noteElement.getBoundingClientRect().top).toBeGreaterThan(
      within(logo).getByText('Logo').getBoundingClientRect().top,
    );

    await userEvent.tab();
    await expectFocusRing(logo);
  },
};

// T13-D4-Fichiers-D: the same tiles for the operator, each count at the right of its title.
export const TitledCategoriesWithCounts: Story = {
  render: () => titledCategories(true),
  play: async ({ canvas }) => {
    const logo = canvas.getByRole('link', { name: 'Logo 2 of which 1 vector' });
    const title = within(logo).getByText('Logo').getBoundingClientRect();
    const count = within(logo).getByText('2');
    const countBox = count.getBoundingClientRect();
    await expect(getComputedStyle(count).fontSize).toBe(TITLED_SIZES.figure);
    await expect(countBox.right).toBe(logo.getBoundingClientRect().right);
    await expect(countBox.top).toBeLessThan(title.bottom);
    await expect(
      within(logo).getByText('of which 1 vector').getBoundingClientRect().top,
    ).toBeGreaterThanOrEqual(countBox.bottom);
  },
};
