import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent } from 'storybook/test';
import { expectAnimationOnlyWhenMotionAllowed } from '../../testing/expect-motion.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Field } from '../Field/Field.tsx';
import { Text, TextVariant } from '../Text/Text.tsx';
import { TextArea } from '../TextArea/TextArea.tsx';
import { AgentAdvice } from './AgentAdvice.tsx';
import { AgentMark } from './AgentMark.tsx';
import { AgentWords } from './AgentWords.tsx';

const AGENT_RULE_WIDTH = '3px';
const DRAFTED = 'drafted by the agent, to review';
const MESSAGE = 'Your message';
const DRAFT =
  'Hello Jeanne, the cake photos can come later: the proposal will use those of the current site.';

function squareOf(mark: HTMLElement): HTMLElement {
  const square = mark.querySelector('[data-agent-square]');
  if (!(square instanceof HTMLElement)) {
    throw new Error('The mark holds its square.');
  }
  return square;
}

// T13-A2-Accueil-PreAnalyse-D and T13-B1-Fil-D: before what the agent did.
const meta = {
  title: 'Feedback/AgentMark',
  component: AgentMark,
  args: { children: 'the agent advises to accept and send the offer' },
} satisfies Meta<typeof AgentMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = {
  play: async ({ canvas }) => {
    const words = canvas.getByText('the agent advises to accept and send the offer');
    const { color, fontFamily } = getComputedStyle(words);
    await expect(color).toBe(tokenColor('agent', words));
    await expect(fontFamily).toContain('IBM Plex Mono');
    const square = squareOf(words);
    await expect(square).toHaveAttribute('aria-hidden', 'true');
    const box = square.getBoundingClientRect();
    await expect({ width: box.width, height: box.height }).toEqual({ width: 8, height: 8 });
    await expect(getComputedStyle(square).backgroundColor).toBe(tokenColor('agent', square));
    await expect(getComputedStyle(square).borderRadius).toBe('0px');
  },
};

// T13-E1-Arrivee-D: while an engine works, its ring turns, and stays still for less motion.
export const Running: Story = {
  args: { children: 'pre-analysis running · requested at 9:03', isRunning: true },
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-agent-ring]');
    if (ring === null) {
      throw new Error('A running mark holds its ring.');
    }
    await expect(canvasElement.querySelector('[data-agent-square]')).toBeNull();
    await expect(getComputedStyle(ring).color).toBe(tokenColor('agent', ring));
    await expectAnimationOnlyWhenMotionAllowed(ring);
  },
};

// T13-B1-Fil-D and T13-B2-PreAnalyse-D: the agent's words behind its rule, its advice on pale purple.
export const WordsAndAdvice: Story = {
  render: () => (
    <div className="flex max-w-reading-width flex-col gap-space-5">
      <AgentWords mark="what the agent says">
        <Text>
          A site rebuilt for the phone: the opening hours in view, the call in one tap, and cake
          orders the day before.
        </Text>
      </AgentWords>
      <AgentAdvice mark="the agent advises">
        <Text variant={TextVariant.bodySmall}>
          Accept the request and send the Standard package: the cake orders fit its budget.
        </Text>
      </AgentAdvice>
    </div>
  ),
  play: async ({ canvas }) => {
    const words = canvas.getByText(/A site rebuilt for the phone/).parentElement;
    if (words === null) {
      throw new Error('The words sit in their block.');
    }
    const wordsStyle = getComputedStyle(words);
    await expect({
      borderLeftWidth: wordsStyle.borderLeftWidth,
      borderLeftColor: wordsStyle.borderLeftColor,
      borderTopWidth: wordsStyle.borderTopWidth,
    }).toEqual({
      borderLeftWidth: AGENT_RULE_WIDTH,
      borderLeftColor: tokenColor('agent', words),
      borderTopWidth: '0px',
    });
    await expect(canvas.getByText('what the agent says')).toBeVisible();

    const advice = canvas.getByText(/Accept the request/).parentElement;
    if (advice === null) {
      throw new Error('The advice sits in its block.');
    }
    const adviceStyle = getComputedStyle(advice);
    await expect(adviceStyle.backgroundColor).toBe(tokenColor('agent-pale', advice));
    await expect(adviceStyle.borderRadius).toBe('0px');
    await expect(adviceStyle.boxShadow).toBe('none');
  },
};

// The app's side: the field holds the agent's draft until the operator changes it.
function DraftedMessage() {
  const [message, setMessage] = useState(DRAFT);
  const isDraft = message === DRAFT;
  return (
    <div className="max-w-reading-width">
      <Field label={MESSAGE} agentDraft={isDraft ? DRAFTED : undefined}>
        <TextArea value={message} onValueChange={setMessage} rows={4} />
      </Field>
    </div>
  );
}

// T13-E2-Ecrire-D and T13-G1-Ecrire-M: a field drafted by the agent, its mark by its label and its
// rule at the left, both gone once the operator edits it.
export const DraftedField: Story = {
  render: () => <DraftedMessage />,
  play: async ({ canvas, canvasElement }) => {
    // A probe inside a text area takes no style: the colors are read around it.
    const around = canvasElement;
    const field = canvas.getByRole('textbox', { name: `${MESSAGE} ${DRAFTED}` });
    const style = getComputedStyle(field);
    await expect({
      borderLeftWidth: style.borderLeftWidth,
      borderLeftColor: style.borderLeftColor,
      borderTopWidth: style.borderTopWidth,
      borderTopColor: style.borderTopColor,
    }).toEqual({
      borderLeftWidth: AGENT_RULE_WIDTH,
      borderLeftColor: tokenColor('agent', around),
      borderTopWidth: '1px',
      borderTopColor: tokenColor('field', around),
    });
    await expect(getComputedStyle(canvas.getByText(DRAFTED)).color).toBe(
      tokenColor('agent', around),
    );

    await userEvent.type(field, ' See you soon.');
    const edited = canvas.getByRole('textbox', { name: MESSAGE });
    await expect(canvas.queryByText(DRAFTED)).toBeNull();
    await expect(getComputedStyle(edited).borderLeftWidth).toBe('1px');
    await expect(getComputedStyle(edited).borderLeftColor).toBe(tokenColor('field', around));
  },
};
