import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Skeleton, SkeletonShape } from './Skeleton.tsx';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  argTypes: {
    shape: { control: 'inline-radio', options: Object.values(SkeletonShape) },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent(/loading|chargement/i);
  },
};

export const Heading: Story = {
  args: { shape: SkeletonShape.heading },
};

export const Field: Story = {
  args: { shape: SkeletonShape.field },
};

export const APage: Story = {
  render: () => (
    <div className="flex max-w-reading-width flex-col gap-space-5">
      <Skeleton shape={SkeletonShape.heading} />
      <Skeleton lines={4} />
      <Skeleton shape={SkeletonShape.field} />
    </div>
  ),
};
