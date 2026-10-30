import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Heading } from '../Heading/Heading.tsx';
import { Text } from '../Text/Text.tsx';
import { Container } from './Container.tsx';

const meta = {
  title: 'Layout/Container',
  component: Container,
  args: {
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

export const ReadingColumn: Story = {
  render: (args) => (
    <Container {...args} className="flex flex-col gap-space-4" data-testid="column" />
  ),
  play: async ({ canvas }) => {
    const column = canvas.getByTestId('column');
    await expect(
      column.clientWidth - 2 * Number.parseFloat(getComputedStyle(column).paddingLeft),
    ).toBeLessThanOrEqual(720);
  },
};

export const AsMain: Story = {
  args: { render: <main /> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('main')).toBeVisible();
  },
};
