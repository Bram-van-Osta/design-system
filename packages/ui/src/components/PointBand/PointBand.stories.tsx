import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { expectTransitionOnlyWhenMotionAllowed } from '../../testing/expect-motion.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { PointBand } from './PointBand.tsx';

const PHONE = { value: 'mobile1' };
const MAX = 7;
const NOTED = 3;
const LABEL = '3 noted out of 7';

function segmentsOf(root: HTMLElement): readonly HTMLElement[] {
  return [...root.querySelectorAll('[data-segment]')].filter(
    (segment): segment is HTMLElement => segment instanceof HTMLElement,
  );
}

// T12-B2-Lecture-M and T12-M1-Ecrire-M: on a phone, the count stuck to the field's bottom.
const meta = {
  title: 'Forms/PointBand',
  component: PointBand,
  args: { max: MAX, value: NOTED, label: LABEL },
  globals: { viewport: PHONE },
} satisfies Meta<typeof PointBand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = {
  play: async ({ canvas, canvasElement }) => {
    const label = canvas.getByText(LABEL);
    const band = label.parentElement;
    if (band === null) {
      throw new Error('The count sits in its band.');
    }
    await expect(getComputedStyle(band).backgroundColor).toBe(tokenColor('band', band));
    await expect(getComputedStyle(band).borderTopColor).toBe(tokenColor('highlight-strong', band));
    const segments = segmentsOf(canvasElement);
    await expect(segments).toHaveLength(MAX);
    const filled = segments.filter((segment) => segment.hasAttribute('data-filled'));
    await expect(filled).toHaveLength(NOTED);
    for (const segment of filled) {
      await expect(getComputedStyle(segment).backgroundColor).toBe(tokenColor('delft', segment));
    }
    const [, , , empty] = segments;
    if (empty === undefined) {
      throw new Error('The band has its empty segments.');
    }
    await expect(getComputedStyle(empty).backgroundColor).toBe(tokenColor('field', empty));
    await expectTransitionOnlyWhenMotionAllowed(empty);
  },
};

export const NothingNoted: Story = {
  args: { value: 0, label: '0 noted out of 7' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-filled]')).toHaveLength(0);
  },
};

export const AllNoted: Story = {
  args: { value: MAX, label: '7 noted out of 7' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-filled]')).toHaveLength(MAX);
  },
};
