import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Heading } from '../Heading/Heading.tsx';
import { Text } from '../Text/Text.tsx';
import { Container } from './Container.tsx';

const meta = {
  title: 'Layout/Container',
  component: Container,
  args: {
    className: 'flex flex-col gap-space-4',
    children: (
      <>
        <Heading level={1}>Your proposal is ready.</Heading>
        <Text variant="lead">
          Allow about twenty minutes, in one go or several: everything you write is kept.
        </Text>
        <Text>
          The Boulangerie du Port has had the same site for ten years. It is slow on a phone, and
          the opening hours are three clicks away. This proposal starts from what its clients look
          for first: when it opens, what it bakes, and how to order for the holidays.
        </Text>
      </>
    ),
  },
  argTypes: {
    children: { control: false },
    render: { control: false },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// The column's width: the reading width, or the room inside the outer element's margins.
async function expectReadingColumn(column: HTMLElement | null) {
  const outer = column?.parentElement;
  if (!column || !outer) {
    throw new Error('The column and its outer element are expected.');
  }
  const readingWidth = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--reading-width'),
  );
  const { paddingLeft, paddingRight } = getComputedStyle(outer);
  const room = outer.clientWidth - Number.parseFloat(paddingLeft) - Number.parseFloat(paddingRight);
  await expect(column.getBoundingClientRect().width).toBeCloseTo(Math.min(readingWidth, room));
}

export const ReadingColumn: Story = {
  play: async ({ canvas }) => {
    await expectReadingColumn(canvas.getByRole('heading', { level: 1 }).parentElement);
  },
};

// An app's shell lays its header and its main out in a flex column: a short page keeps the width.
export const InAFlexColumn: Story = {
  args: { children: <Heading level={1}>Hello Jeanne.</Heading> },
  render: (args) => (
    <div className="flex flex-col">
      <Container {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expectReadingColumn(canvas.getByRole('heading', { level: 1 }).parentElement);
  },
};

export const AsMain: Story = {
  args: { render: <main /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('main')).toBeVisible();
  },
};
