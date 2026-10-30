import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Heading, HeadingSize } from './Heading.tsx';

const meta = {
  title: 'Identity/Heading',
  component: Heading,
  args: {
    level: 1,
    children: 'Your proposal is ready.',
  },
  argTypes: {
    size: { control: 'inline-radio', options: Object.values(HeadingSize) },
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageHeading: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 1, name: 'Your proposal is ready.' });
    await expect(getComputedStyle(heading).fontFamily).toContain('Inter Tight');
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-space-5">
      <Heading level={1} size={HeadingSize.xl}>
        Your proposal is ready.
      </Heading>
      <Heading level={2} size={HeadingSize.l}>
        Hello Jeanne.
      </Heading>
      <Heading level={3} size={HeadingSize.m}>
        Where do you stand?
      </Heading>
      <Heading level={4} size={HeadingSize.s}>
        Section 6 · Your inspirations
      </Heading>
      <Heading level={5} size={HeadingSize.xs}>
        What awaits me
      </Heading>
    </div>
  ),
};

export const SectionHeading: Story = {
  args: { level: 2, children: 'What awaits me' },
};
