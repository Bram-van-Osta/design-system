import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Logo } from './Logo.tsx';
import { LogoVariant } from './logo-geometry.ts';

const meta = {
  title: 'Identity/Logo',
  component: Logo,
  argTypes: {
    variant: { control: 'inline-radio', options: Object.values(LogoVariant) },
    size: { control: { type: 'number', min: 13 } },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lockup: Story = {
  args: { size: 20 },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Bram van Osta')).toBeVisible();
    const tulip = canvasElement.querySelector('svg');
    await expect(tulip).toHaveAttribute('aria-hidden', 'true');
    await expect(tulip?.getBoundingClientRect().height).toBeCloseTo(28);
  },
};

export const Tulip: Story = {
  args: { variant: LogoVariant.tulip },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Bram van Osta' })).toBeVisible();
  },
};

export const TulipAtItsSmallest: Story = {
  args: { variant: LogoVariant.tulip, size: 8 },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('img', { name: 'Bram van Osta' }).getBoundingClientRect().width,
    ).toBe(16);
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-space-6">
      <Logo size={34} />
      <Logo size={20} />
      <Logo size={13} />
      <Logo variant={LogoVariant.tulip} size={96} />
      <Logo variant={LogoVariant.tulip} size={24} />
      <Logo variant={LogoVariant.tulip} size={16} />
    </div>
  ),
};
