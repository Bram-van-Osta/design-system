import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Heading } from '../Heading/Heading.tsx';
import { Text, TextVariant } from '../Text/Text.tsx';
import { Kicker, KickerTone } from './Kicker.tsx';

const meta = {
  title: 'Identity/Kicker',
  component: Kicker,
  args: {
    children: 'Your project · the second milestone',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: Object.values(KickerTone) },
    render: { control: false },
  },
} satisfies Meta<typeof Kicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Attention: Story = {
  play: async ({ canvas }) => {
    const kicker = canvas.getByText('Your project · the second milestone');
    await expect(getComputedStyle(kicker).fontFamily).toContain('IBM Plex Mono');
  },
};

export const OnASurface: Story = {
  args: { tone: KickerTone.muted },
  decorators: [
    (Story) => (
      <div className="bg-surface p-space-5">
        <Story />
      </div>
    ),
  ],
};

export const AboveAHeading: Story = {
  render: (args) => (
    <div className="flex flex-col gap-space-3">
      <Kicker {...args} />
      <Heading level={1}>Your proposal is ready.</Heading>
      <Text variant={TextVariant.lead}>
        Allow about twenty minutes, in one go or several: everything is kept.
      </Text>
    </div>
  ),
};
