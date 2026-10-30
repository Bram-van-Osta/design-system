import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, BadgeTone } from './Badge.tsx';

const meta = {
  title: 'Feedback/Badge',
  component: Badge,
  args: {
    children: 'pre-analysis ready',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: Object.values(BadgeTone) },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Attention: Story = {
  args: { tone: BadgeTone.attention },
};

export const Neutral: Story = {
  args: { children: 'analysis running' },
};

export const InAList: Story = {
  render: () => (
    <ul className="flex max-w-reading-width flex-col">
      <li className="flex items-center justify-between border-t-hair border-line py-space-3">
        Boulangerie du Port <Badge tone={BadgeTone.attention}>pre-analysis ready</Badge>
      </li>
      <li className="flex items-center justify-between border-t-hair border-line py-space-3">
        Jeanne Martin <Badge>analysis running</Badge>
      </li>
      <li className="flex items-center justify-between border-y-hair border-line py-space-3">
        To review <Badge tone={BadgeTone.attention}>3</Badge>
      </li>
    </ul>
  ),
};
