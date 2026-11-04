import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect } from 'storybook/test';
import { expectContrastAtLeast } from '../../testing/expect-contrast.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Stat } from './Stat.tsx';
import { StatTone } from './stat-tone.ts';

const PIPELINE = 'Projects by state';
// The figure is large text: 3:1 is its threshold.
const LARGE_TEXT_CONTRAST = 3;

function Pipeline({ children }: { readonly children: ReactNode }) {
  return (
    <dl aria-label={PIPELINE} className="grid grid-cols-1 gap-space-3 md:grid-cols-5">
      {children}
    </dl>
  );
}

// REF-T9-02-Projets-O and T4-O1-Accueil: the pipeline's counts, one tile per state.
const meta = {
  title: 'Feedback/Stat',
  component: Stat,
  args: { label: 'Questionnaire', value: 4 },
  argTypes: {
    tone: { control: 'inline-radio', options: Object.values(StatTone) },
    note: { control: 'text' },
  },
  render: (args) => (
    <Pipeline>
      <Stat {...args} />
    </Pipeline>
  ),
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

function tileOf(element: HTMLElement): HTMLElement {
  return element.parentElement ?? element;
}

// A figure among others: its label a term, its figure in tabular Inter Tight, a hairline frame.
export const Plain: Story = {
  play: async ({ canvas }) => {
    const label = canvas.getByRole('term');
    const figure = canvas.getByRole('definition');
    await expect(label).toHaveTextContent('Questionnaire');
    await expect(figure).toHaveTextContent('4');
    await expect(getComputedStyle(label).color).toBe(tokenColor('ink-muted', label));
    const { color, fontFamily, fontVariantNumeric } = getComputedStyle(figure);
    await expect(color).toBe(tokenColor('ink', figure));
    await expect(fontFamily).toContain('Inter Tight');
    await expect(fontVariantNumeric).toBe('tabular-nums');

    const tile = tileOf(figure);
    const { borderTopColor, borderTopWidth, borderRadius, boxShadow } = getComputedStyle(tile);
    await expect({ borderTopColor, borderTopWidth, borderRadius, boxShadow }).toEqual({
      borderTopColor: tokenColor('line', tile),
      borderTopWidth: '1px',
      borderRadius: '0px',
      boxShadow: 'none',
    });
  },
};

// What awaits the reader: the attention rule on top, the figure in vermilion.
export const Attention: Story = {
  args: { label: 'Proposal', value: 2, tone: StatTone.attention },
  play: async ({ canvas }) => {
    const figure = canvas.getByRole('definition');
    const tile = tileOf(figure);
    const { borderTopColor, borderTopWidth, borderLeftColor } = getComputedStyle(tile);
    await expect(borderTopColor).toBe(tokenColor('vermillion', tile));
    await expect(borderTopWidth).toBe(`${tokenPixels('border-attention')}px`);
    await expect(borderLeftColor).toBe(tokenColor('line', tile));
    const { color } = getComputedStyle(figure);
    await expect(color).toBe(tokenColor('vermillion', figure));
    await expectContrastAtLeast(color, tokenColor('bg', figure), LARGE_TEXT_CONTRAST);
  },
};

// A line under the figure that situates it (T4-O1-Accueil).
export const WithANote: Story = {
  args: { label: 'To review', value: 5, note: 'the oldest: 3 h', tone: StatTone.attention },
  play: async ({ canvas }) => {
    const [figure, note] = canvas.getAllByRole('definition');
    await expect(note).toHaveTextContent('the oldest: 3 h');
    if (figure !== undefined && note !== undefined) {
      await expect(getComputedStyle(note).color).toBe(tokenColor('ink-muted', note));
      await expect(note.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        figure.getBoundingClientRect().bottom,
      );
    }
  },
};

// The pipeline: on a computer, each label above its figure; on a phone, side by side on one line.
export const AsAPipeline: Story = {
  render: () => (
    <Pipeline>
      <Stat label="In preparation" value={3} />
      <Stat label="Questionnaire" value={4} />
      <Stat label="Proposal" value={2} tone={StatTone.attention} />
      <Stat label="Test site" value={2} />
      <Stat label="Live" value={3} />
    </Pipeline>
  ),
  play: async ({ canvas }) => {
    const list = canvas.getByLabelText(PIPELINE);
    await expect(canvas.getAllByRole('term')).toHaveLength(5);
    for (const label of canvas.getAllByRole('term')) {
      const figure = label.nextElementSibling;
      await expect(figure).not.toBeNull();
      if (figure !== null) {
        const labelBox = label.getBoundingClientRect();
        const figureBox = figure.getBoundingClientRect();
        if (isOnAComputer()) {
          await expect(figureBox.top).toBeGreaterThanOrEqual(labelBox.bottom);
        } else {
          await expect(figureBox.top).toBeLessThan(labelBox.bottom);
          await expect(figureBox.right).toBeLessThanOrEqual(list.getBoundingClientRect().right);
        }
      }
    }
  },
};
