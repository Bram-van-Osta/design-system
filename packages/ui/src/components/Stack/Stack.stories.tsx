import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { Stack } from './Stack.tsx';
import { StackAlign, StackDirection, StackJustify } from './stack-classes.ts';

function Block({ label }: { readonly label: string }) {
  return <div className="bg-surface px-space-4 py-space-3 text-body">{label}</div>;
}

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: {
    gap: 'space-3',
    children: [
      <Block key="1" label="First" />,
      <Block key="2" label="Second" />,
      <Block key="3" label="Third" />,
    ],
  },
  argTypes: {
    direction: { control: 'inline-radio', options: Object.values(StackDirection) },
    align: { control: 'inline-radio', options: Object.values(StackAlign) },
    justify: { control: 'inline-radio', options: Object.values(StackJustify) },
    children: { control: false },
    render: { control: false },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {
  play: async ({ canvas }) => {
    const first = canvas.getByText('First').getBoundingClientRect();
    const second = canvas.getByText('Second').getBoundingClientRect();
    await expect(second.top - first.bottom).toBe(12);
  },
};

export const Row: Story = {
  args: { direction: StackDirection.row, gap: 'space-5', isWrapping: true },
};

export const Actions: Story = {
  args: {
    direction: StackDirection.row,
    gap: 'space-5',
    align: StackAlign.center,
    justify: StackJustify.end,
    isWrapping: true,
    children: [
      <Button key="back" variant={ButtonVariant.quiet}>
        Previous question
      </Button>,
      <Button key="next" hasArrow>
        Continue
      </Button>,
    ],
  },
};

export const AsAList: Story = {
  args: {
    render: <ul />,
    gap: 'space-2',
    children: [
      <li key="1">Your business</li>,
      <li key="2">Your clients</li>,
      <li key="3">Your site</li>,
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};
