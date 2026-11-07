import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { isOnAComputer } from '../../testing/is-on-a-computer.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { Link } from '../Link/Link.tsx';
import { Text, TextTone, TextVariant } from '../Text/Text.tsx';
import { CalmCard } from './CalmCard.tsx';
import { WaitingCard } from './WaitingCard.tsx';

const READ = 'Read the pre-analysis';
const TOUCH_UP = 'Touch up the pre-analysis';
const WAITING = 'What awaits you';

// T13-A2-Accueil-PreAnalyse-D and T13-C2-Accueil-M: two things wait for the operator.
const meta = {
  title: 'Layout/WaitingCard',
  component: WaitingCard,
  args: {
    label: WAITING,
    rows: [
      {
        id: 'pre-analysis',
        heading: 'Read the pre-analysis, then decide',
        children: (
          <Text variant={TextVariant.bodySmall} tone={TextTone.muted}>
            Size M, 11 points · 3 points of attention · one question that changes the price.
          </Text>
        ),
        actions: <Button onClick={fn()}>{READ}</Button>,
      },
      {
        id: 'precision',
        heading: 'A note from Jeanne, after the reading',
        children: (
          <Text variant={TextVariant.bodySmall} tone={TextTone.muted}>
            "Cake orders are mostly for holidays and communions."
          </Text>
        ),
        actions: (
          <>
            <Button onClick={fn()}>{TOUCH_UP}</Button>
            <Button variant={ButtonVariant.quiet} onClick={fn()}>
              Leave it
            </Button>
          </>
        ),
      },
    ],
  },
  argTypes: {
    rows: { control: false },
  },
} satisfies Meta<typeof WaitingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoThingsWait: Story = {
  play: async ({ canvas }) => {
    const card = canvas.getByRole('list', { name: WAITING });
    const style = getComputedStyle(card);
    await expect({
      borderTopWidth: Number.parseFloat(style.borderTopWidth),
      borderTopColor: style.borderTopColor,
      backgroundColor: style.backgroundColor,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
    }).toEqual({
      borderTopWidth: tokenPixels('border-attention'),
      borderTopColor: tokenColor('vermillion', card),
      backgroundColor: tokenColor('surface', card),
      borderRadius: '0px',
      boxShadow: 'none',
    });
    const [first, second] = within(card).getAllByRole('listitem');
    await expect(getComputedStyle(first ?? card).borderTopWidth).toBe('0px');
    await expect(second && getComputedStyle(second).borderTopColor).toBe(tokenColor('line', card));
    await expect(within(card).getAllByRole('heading', { level: 3 })).toHaveLength(2);

    const read = canvas.getByRole('button', { name: READ });
    const touchUp = canvas.getByRole('button', { name: TOUCH_UP });
    await expectHeightAtLeast(read, 'button-height');
    await userEvent.tab();
    await expectFocusRing(read);
    await userEvent.tab();
    await expectFocusRing(touchUp);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Leave it' })).toHaveFocus();
  },
};

// On a phone, a row's main action under its lines, the whole width; beside them on a computer.
export const MainActionOnAPhone: Story = {
  play: async ({ canvas }) => {
    const card = canvas.getByRole('list', { name: WAITING });
    const read = canvas.getByRole('button', { name: READ });
    const leave = canvas.getByRole('button', { name: 'Leave it' });
    const rowWidth = within(card).getAllByRole('listitem')[0]?.getBoundingClientRect().width ?? 0;
    if (isOnAComputer()) {
      await expect(read.getBoundingClientRect().width).toBeLessThan(rowWidth / 2);
    } else {
      await expect(read.getBoundingClientRect().width).toBe(rowWidth);
      await expect(leave.getBoundingClientRect().width).toBeLessThan(rowWidth);
    }
  },
};

// T13-A3-Accueil-OffreEnvoyee-D: nothing waits, a sentence says who has the ball.
export const Calm: Story = {
  render: () => (
    <CalmCard
      heading="Nothing for now."
      actions={
        <>
          <Link href="#offer">See the offer sent</Link>
          <Link href="#write">Write to Jeanne</Link>
        </>
      }
    >
      <Text variant={TextVariant.bodySmall} tone={TextTone.muted}>
        The offer has been with Jeanne since Monday; she read it last night. Her answer will arrive
        here.
      </Text>
    </CalmCard>
  ),
  play: async ({ canvas }) => {
    const card = canvas.getByRole('region', { name: 'Nothing for now.' });
    const style = getComputedStyle(card);
    await expect({
      borderTopWidth: style.borderTopWidth,
      backgroundColor: style.backgroundColor,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow,
    }).toEqual({
      borderTopWidth: '0px',
      backgroundColor: tokenColor('surface', card),
      borderRadius: '0px',
      boxShadow: 'none',
    });
    await expect(canvas.getByRole('heading', { level: 3 })).toHaveTextContent('Nothing for now.');
    const offer = canvas.getByRole('link', { name: 'See the offer sent' });
    await expectHeightAtLeast(offer, 'target-min');
    await userEvent.tab();
    await expectFocusRing(offer);
  },
};
