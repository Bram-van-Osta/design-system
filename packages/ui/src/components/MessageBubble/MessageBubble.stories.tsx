import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { tokenColor } from '../../testing/token-color.ts';
import { MessageBubble } from './MessageBubble.tsx';

const QUESTION = '"Can the holiday order be picked up in the shop, without paying online?"';

// REF-T8-08-ReponseClient-O: the client's question, quoted for the operator.
const meta = {
  title: 'Feedback/MessageBubble',
  component: MessageBubble,
  args: {
    author: 'Jeanne Martin, a question',
    sentAt: '2 hours ago',
    children: QUESTION,
  },
} satisfies Meta<typeof MessageBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FromTheClient: Story = {
  play: async ({ canvas }) => {
    const bubble = canvas.getByRole('figure');
    const quote = canvas.getByText(QUESTION);
    await expect(bubble).toContainElement(quote);
    await expect(bubble.querySelector('figcaption')).toHaveTextContent(
      'Jeanne Martin, a question · 2 hours ago',
    );
    await expect(quote.tagName).toBe('BLOCKQUOTE');
    const { backgroundColor, borderRadius } = getComputedStyle(quote);
    await expect(backgroundColor).toBe(tokenColor('surface', quote));
    await expect(borderRadius).toBe('0px');
    await expect(getComputedStyle(canvas.getByText('Jeanne Martin, a question')).color).toBe(
      tokenColor('ink', quote),
    );
  },
};

// REF-T6-E-Espace-D: the studio's message looks the same; its caption names it.
export const FromTheStudio: Story = {
  args: {
    author: 'Bram',
    sentAt: 'yesterday',
    children:
      'No worries if the holidays take all your time: we can also finish together on the phone, twenty minutes are enough.',
  },
};

// Its line breaks are kept, and a long address wraps rather than widening the page.
export const Long: Story = {
  args: {
    author: 'Jeanne Martin',
    sentAt: <time dateTime="2026-10-31T10:12">31 Oct., 10:12</time>,
    children:
      'Hello,\nhere is the menu we hand out in the shop:\nhttps://example.com/boulangerie-du-port/menus/holiday-menu-2026-final-version.pdf\nJeanne',
  },
  play: async ({ canvas }) => {
    const quote = canvas.getByText(/here is the menu/);
    await expect(quote.scrollWidth).toBeLessThanOrEqual(quote.clientWidth);
    await expect(quote.innerText.split('\n')).toHaveLength(4);
  },
};
