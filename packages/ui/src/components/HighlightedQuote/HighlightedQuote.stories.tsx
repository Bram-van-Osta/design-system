import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';
import { PASSAGES, WORDS } from '../../testing/first-contact-fixture.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Disclosure } from '../Disclosure/Disclosure.tsx';
import { HighlightedQuote } from './HighlightedQuote.tsx';

const PHONE = { value: 'mobile1' };
const SUMMARY = 'Your project, in your words · 5 points noted out of 7';

function passageOf(root: HTMLElement, id: string): HTMLElement {
  const passage = root.querySelector(`[data-passage="${id}"]`);
  if (!(passage instanceof HTMLElement)) {
    throw new Error(`The quote marks the passage ${id}.`);
  }
  return passage;
}

// T12-M2-Compris-D: the reader's text beside what was understood of it, its passages marked.
const meta = {
  title: 'Forms/HighlightedQuote',
  component: HighlightedQuote,
  args: { text: WORDS, passages: PASSAGES },
  decorators: [
    (Story) => (
      <div className="max-w-aside-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HighlightedQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Quote: Story = {
  play: async ({ canvasElement }) => {
    const quote = canvasElement.querySelector('blockquote');
    if (quote === null) {
      throw new Error('The text is a quote.');
    }
    await expect(getComputedStyle(quote).backgroundColor).toBe(tokenColor('surface', quote));
    await expect(getComputedStyle(quote).whiteSpace).toBe('pre-wrap');
    await expect(quote.textContent).toBe(WORDS);
    const activity = passageOf(canvasElement, 'activity');
    await expect(getComputedStyle(activity).backgroundColor).toBe(
      tokenColor('highlight', activity),
    );
    await expect(getComputedStyle(activity).color).toBe(tokenColor('ink', activity));
    await expect(getComputedStyle(activity).animationName).toBe('none');
  },
};

export const Emphasized: Story = {
  args: { emphasizedId: 'when' },
  play: async ({ canvasElement }) => {
    const when = passageOf(canvasElement, 'when');
    await expect(getComputedStyle(when).backgroundColor).toBe(tokenColor('highlight-strong', when));
  },
};

// T12-B3-Precisions-M: on a phone, the text folded above the questions left.
export const Folded: Story = {
  globals: { viewport: PHONE },
  render: (args) => (
    <Disclosure summary={SUMMARY}>
      <HighlightedQuote {...args} />
    </Disclosure>
  ),
  play: async ({ canvas }) => {
    const summary = canvas.getByRole('button', { name: SUMMARY });
    await expect(summary).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText(/We run a bakery/)).toBeNull();
    await userEvent.click(summary);
    await expect(summary).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(/We run/)).toBeVisible();
  },
};
