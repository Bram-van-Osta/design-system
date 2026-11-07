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
  play: async ({ canvas }) => {
    const bubble = canvas.getByRole('figure');
    await expect(bubble.querySelector('figcaption')).toHaveTextContent('Bram · yesterday');
    const quote = canvas.getByText(/No worries if the holidays/);
    await expect(quote.tagName).toBe('BLOCKQUOTE');
    await expect(getComputedStyle(quote).backgroundColor).toBe(tokenColor('surface', quote));
    await expect(getComputedStyle(bubble).alignItems).toBe('normal');
  },
};

const OWN = 'I do not have the cake photos yet. Can I send them later?';

// T14-S7-Echanges-D and -M: the client's own message in Delft at the right, Bram's on surface.
export const TheReadersOwn: Story = {
  render: () => (
    <div className="flex max-w-reading-width flex-col gap-space-4">
      <MessageBubble author="Bram" sentAt="Wednesday">
        Thank you Jeanne, here we go. I am preparing your questionnaire.
      </MessageBubble>
      <MessageBubble author="You" sentAt="Friday" isOwn>
        {OWN}
      </MessageBubble>
    </div>
  ),
  play: async ({ canvas }) => {
    const [other, own] = canvas.getAllByRole('figure');
    if (other === undefined || own === undefined) {
      throw new Error('Both messages are drawn.');
    }
    const thread = own.parentElement;
    const quote = canvas.getByText(OWN);
    const { backgroundColor, color, borderRadius } = getComputedStyle(quote);
    await expect({ backgroundColor, color, borderRadius }).toEqual({
      backgroundColor: tokenColor('delft', quote),
      color: tokenColor('on-delft', quote),
      borderRadius: '0px',
    });
    await expect(own.getBoundingClientRect().right).toBe(thread?.getBoundingClientRect().right);
    await expect(own.querySelector('figcaption')?.getBoundingClientRect().right).toBe(
      own.getBoundingClientRect().right,
    );
    await expect(own.querySelector('figcaption')).toHaveTextContent('You · Friday');
    await expect(other.getBoundingClientRect().left).toBe(thread?.getBoundingClientRect().left);
    const otherQuote = canvas.getByText(/here we go/);
    await expect(getComputedStyle(otherQuote).backgroundColor).toBe(
      tokenColor('surface', otherQuote),
    );
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
