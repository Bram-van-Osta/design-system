import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { Button } from '../../components/Button/Button.tsx';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { PageFrame } from '../../testing/PageFrame.tsx';
import { AuthBlock } from './AuthBlock.tsx';

const confirm = fn();

// REF-T8-01-Confirmer-D and -M: the page a mail's link opens, with one action.
const meta = {
  title: 'Blocks/AuthBlock',
  component: AuthBlock,
  args: {
    kicker: 'Your request',
    heading: 'Confirm your address.',
    lead: 'One click, and your request reaches us. You then follow it from this link.',
    children: (
      <Button hasArrow onClick={confirm}>
        Confirm my address
      </Button>
    ),
  },
  render: (args) => (
    <PageFrame>
      <AuthBlock {...args} />
    </PageFrame>
  ),
} satisfies Meta<typeof AuthBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmAddress: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('region', { name: 'Confirm your address.' })).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Confirm your address.',
    );
    await userEvent.tab();
    const button = canvas.getByRole('button', { name: 'Confirm my address' });
    await expectFocusRing(button);
    await expectHeightAtLeast(button, 'button-height');
    await userEvent.keyboard('{Enter}');
    await expect(confirm).toHaveBeenCalled();
  },
};

// REF-T8-02-Reprendre-D: back from the mail, the request where it was left.
export const ResumeRequest: Story = {
  args: {
    heading: 'Resume your request where you left it.',
    lead: 'Your answers are kept. Three questions remain, about two minutes.',
    children: <Button hasArrow>Resume my request</Button>,
  },
};
