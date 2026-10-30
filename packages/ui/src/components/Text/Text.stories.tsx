import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, TextTone, TextVariant } from './Text.tsx';

const meta = {
  title: 'Identity/Text',
  component: Text,
  args: {
    children: 'No worries if the holidays take up all your time.',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: Object.values(TextVariant) },
    tone: { control: 'inline-radio', options: Object.values(TextTone) },
    render: { control: false },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {};

export const Lead: Story = {
  args: { variant: TextVariant.lead, children: 'Everything you wrote is kept.' },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-space-4">
      <Text variant={TextVariant.lead}>Everything you wrote is kept.</Text>
      <Text>No worries if the holidays take up all your time.</Text>
      <Text variant={TextVariant.bodySmall}>
        For example: it is ten years old, it is slow, it looks dated.
      </Text>
      <Text variant={TextVariant.small} tone={TextTone.muted}>
        Saved just now.
      </Text>
      <Text variant={TextVariant.meta} tone={TextTone.muted}>
        Four days ago · questionnaire started
      </Text>
    </div>
  ),
};
