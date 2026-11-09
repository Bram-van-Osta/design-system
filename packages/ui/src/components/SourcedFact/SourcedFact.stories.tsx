import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { tokenColor } from '../../testing/token-color.ts';
import { Link } from '../Link/Link.tsx';
import { SourcedFact } from './SourcedFact.tsx';
import { SourcedFactList } from './SourcedFactList.tsx';

const PHONE = { value: 'mobile1' };
const RULE = '3px';
const TARGET = 44;

const ANSWERS = [
  {
    id: 'activity',
    label: 'Your activity',
    value: 'Bakery and pastry shop',
    source: 'from "We run a bakery and pastry shop"',
  },
  {
    id: 'situation',
    label: 'Your situation',
    value: 'I have a site to modernize',
    source: 'from "Our site is ten years old"',
  },
  {
    id: 'decides',
    label: 'What makes you decide',
    value: 'My site is aging · I cannot edit it myself',
    source: 'from "Our site is ten years old" and "I cannot change anything myself"',
  },
  {
    id: 'when',
    label: 'By when',
    value: 'A precise period: before December',
    source: 'from "Ideally before December"',
  },
] as const;

function Understood() {
  return (
    <SourcedFactList className="max-w-reading-width">
      {ANSWERS.map((answer) => (
        <SourcedFact
          key={answer.id}
          label={answer.label}
          value={answer.value}
          source={answer.source}
          action={<Link href={`#correct-${answer.id}`}>Correct</Link>}
        />
      ))}
    </SourcedFactList>
  );
}

// T12-M2-Compris-D: what was understood of the reader's words, each answer with where it comes
// from and its correction.
const meta = {
  title: 'Layout/SourcedFact',
  component: SourcedFact,
  args: { label: 'Your activity', value: 'Bakery and pastry shop' },
  render: () => <Understood />,
} satisfies Meta<typeof SourcedFact>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhatWeUnderstood: Story = {
  play: async ({ canvas, canvasElement }) => {
    const list = canvasElement.querySelector('dl');
    if (list === null) {
      throw new Error('The answers are a description list.');
    }
    const terms = within(list).getAllByRole('term');
    await expect(terms.map((term) => term.textContent)).toEqual(
      ANSWERS.map((answer) => answer.label),
    );
    const row = terms[0]?.parentElement;
    if (row === undefined || row === null) {
      throw new Error('Each answer is a row.');
    }
    const { borderTopWidth, borderTopColor } = getComputedStyle(row);
    await expect(borderTopWidth).toBe(RULE);
    await expect(borderTopColor).toBe(tokenColor('delft', row));
    const label = canvas.getByText('Your activity');
    await expect(getComputedStyle(label).fontFamily).toContain('IBM Plex Mono');
    const source = canvas.getByText(ANSWERS[0].source);
    await expect(getComputedStyle(source).color).toBe(tokenColor('ink-muted', source));

    const corrections = canvas.getAllByRole('link', { name: 'Correct' });
    await expect(corrections).toHaveLength(ANSWERS.length);
    const [first] = corrections;
    if (first === undefined) {
      throw new Error('Each answer has its correction.');
    }
    const action = first.getBoundingClientRect();
    const value = canvas.getByText(ANSWERS[0].value).getBoundingClientRect();
    await expect(action.left).toBeGreaterThan(value.left);
    await expect(action.height).toBeGreaterThanOrEqual(TARGET);
    const middle = action.top + action.height / 2;
    const rowBox = row.getBoundingClientRect();
    await expect(Math.abs(middle - (rowBox.top + rowBox.height / 2))).toBeLessThan(TARGET / 2);
  },
};

export const OnAPhone: Story = {
  globals: { viewport: PHONE },
  play: async ({ canvas }) => {
    const value = canvas.getByText(ANSWERS[2].value);
    const [, , third] = canvas.getAllByRole('link', { name: 'Correct' });
    if (third === undefined) {
      throw new Error('Each answer has its correction.');
    }
    await expect(third.getBoundingClientRect().left).toBeGreaterThan(
      value.getBoundingClientRect().left,
    );
  },
};

export const WithoutSourceNorAction: Story = {
  render: (args) => (
    <SourcedFactList className="max-w-reading-width">
      <SourcedFact {...args} />
    </SourcedFactList>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('definition')).toHaveTextContent('Bakery and pastry shop');
    await expect(canvas.queryByRole('link')).toBeNull();
  },
};
