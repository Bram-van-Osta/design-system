import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { expectBackgroundToBecome } from '../../testing/expect-background.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import {
  expectAnimationOnlyWhenMotionAllowed,
  expectTransitionOnlyWhenMotionAllowed,
} from '../../testing/expect-motion.ts';
import {
  FIRST_READING,
  PASSAGES,
  POINT_COUNT,
  WORDS,
  WORDS_HELP,
  WORDS_LABEL,
} from '../../testing/first-contact-fixture.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Field } from '../Field/Field.tsx';
import { PointBand } from '../PointBand/PointBand.tsx';
import { HighlightedTextArea } from './HighlightedTextArea.tsx';

const PHONE = { value: 'mobile1' };
const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const UNDERLINE = '2px';
const LONG_WORDS = Array.from({ length: 40 }, (_, index) => `Line ${index + 1} of the text.`)
  .concat('And our site is ten years old.')
  .join('\n');

function textBoxOf(canvas: { getByRole: (role: string, options: object) => HTMLElement }) {
  const textArea = canvas.getByRole('textbox', { name: WORDS_LABEL });
  if (!(textArea instanceof HTMLTextAreaElement)) {
    throw new Error('The field is a textarea.');
  }
  return textArea;
}

function passageOf(root: Element, id: string): HTMLElement | null {
  const passage = root.querySelector(`[data-passage="${id}"]`);
  return passage instanceof HTMLElement ? passage : null;
}

function layerOf(root: Element): HTMLElement {
  const layer = root.querySelector('[data-passages-layer]');
  if (!(layer instanceof HTMLElement)) {
    throw new Error('The field holds the layer of its passages.');
  }
  return layer;
}

// T12-M1-Ecrire-D and T12-C1-Animations-D: the reader's own words, the passages a reading found in
// them tinted and underlined.
const meta = {
  title: 'Forms/HighlightedTextArea',
  component: HighlightedTextArea,
  args: {
    passages: [],
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-reading-width">
        <Field label={WORDS_LABEL} description={WORDS_HELP}>
          <Story />
        </Field>
      </div>
    ),
  ],
} satisfies Meta<typeof HighlightedTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const textArea = textBoxOf(canvas);
    await expect(textArea).toHaveAccessibleDescription(WORDS_HELP);
    await expect(getComputedStyle(textArea).backgroundColor).toBe(TRANSPARENT);
    await expect(layerOf(canvasElement)).toHaveAttribute('aria-hidden', 'true');
    await userEvent.tab();
    await expectFocusRing(textArea);
    await userEvent.keyboard('We run a bakery.');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('We run a bakery.');
    await expect(canvasElement.querySelector('[data-passage]')).toBeNull();
  },
};

// The first reading came back: its passages are tinted and underlined, under the typed words.
export const Highlighted: Story = {
  args: { defaultValue: WORDS, passages: PASSAGES.slice(0, FIRST_READING.length) },
  play: async ({ canvas, canvasElement }) => {
    const textArea = textBoxOf(canvas);
    const layer = layerOf(canvasElement);
    const activity = passageOf(layer, 'activity');
    if (activity === null) {
      throw new Error('The activity is tinted.');
    }
    await expect(activity).toHaveTextContent('a bakery and pastry shop');
    await expect(layer.querySelectorAll('[data-passage]')).toHaveLength(FIRST_READING.length);
    await expectBackgroundToBecome(activity, 'highlight');
    await expect(getComputedStyle(activity).backgroundSize).toContain(UNDERLINE);
    await expect(getComputedStyle(activity).color).toBe(TRANSPARENT);
    await expect(getComputedStyle(textArea).color).toBe(tokenColor('ink', layer));
    const layerBox = layer.getBoundingClientRect();
    const textAreaBox = textArea.getBoundingClientRect();
    await expect(layerBox.top).toBe(textAreaBox.top);
    await expect(layerBox.height).toBe(textAreaBox.height);
  },
};

// The reader writes around a passage, then over it: it keeps its tint while its words stay, and
// loses it once they are gone.
export const FoundByItsWords: Story = {
  args: { defaultValue: WORDS, passages: PASSAGES },
  play: async ({ canvas, canvasElement }) => {
    const textArea = textBoxOf(canvas);
    const layer = layerOf(canvasElement);
    const activity = passageOf(layer, 'activity');
    await userEvent.click(textArea);
    textArea.setSelectionRange(0, 0);
    await userEvent.keyboard('Hello! ');
    await expect(passageOf(layer, 'activity')).toBe(activity);
    await expect(passageOf(layer, 'activity')).toHaveTextContent('a bakery and pastry shop');

    const start = textArea.value.indexOf('pastry');
    textArea.setSelectionRange(start, start + 'pastry'.length);
    await userEvent.keyboard('cake');
    await expect(textArea.value).toContain('a bakery and cake shop');
    await expect(passageOf(layer, 'activity')).toBeNull();
    await expect(passageOf(layer, 'situation')).not.toBeNull();
  },
};

// A point is hovered or its cross focused: its passage darkens.
export const Emphasized: Story = {
  args: { defaultValue: WORDS, passages: PASSAGES, emphasizedId: 'situation' },
  play: async ({ canvasElement }) => {
    const situation = passageOf(canvasElement, 'situation');
    const activity = passageOf(canvasElement, 'activity');
    if (situation === null || activity === null) {
      throw new Error('Both passages are tinted.');
    }
    await expectBackgroundToBecome(situation, 'highlight-strong');
    await expectBackgroundToBecome(activity, 'highlight');
  },
};

// Longer than the field's bound: the layer scrolls with the text area.
export const Scrolled: Story = {
  args: { defaultValue: LONG_WORDS, passages: PASSAGES, rows: 3 },
  play: async ({ canvas, canvasElement }) => {
    const textArea = textBoxOf(canvas);
    const layer = layerOf(canvasElement);
    await expect(textArea.scrollHeight).toBeGreaterThan(textArea.clientHeight);
    textArea.scrollTop = textArea.scrollHeight;
    await waitFor(() => expect(layer.scrollTop).toBe(textArea.scrollTop));
    await expect(layer.scrollTop).toBeGreaterThan(0);
  },
};

// On a phone, the column's count stuck to the field's bottom.
export const WithItsBand: Story = {
  args: {
    defaultValue: WORDS,
    passages: PASSAGES.slice(0, FIRST_READING.length),
    footer: (
      <PointBand
        max={POINT_COUNT}
        value={FIRST_READING.length}
        label={`${FIRST_READING.length} noted out of ${POINT_COUNT}`}
      />
    ),
  },
  globals: { viewport: PHONE },
  play: async ({ canvas }) => {
    const textArea = textBoxOf(canvas);
    const band = canvas.getByText(`${FIRST_READING.length} noted out of ${POINT_COUNT}`);
    await expect(band.getBoundingClientRect().top).toBeGreaterThan(
      textArea.getBoundingClientRect().bottom - 1,
    );
  },
};

// Less motion: the passages show at once, their tint and underline without a transition.
export const ReducedMotion: Story = {
  args: { defaultValue: WORDS, passages: PASSAGES },
  play: async ({ canvasElement }) => {
    const activity = passageOf(canvasElement, 'activity');
    if (activity === null) {
      throw new Error('The activity is tinted.');
    }
    await expectAnimationOnlyWhenMotionAllowed(activity);
    await expectTransitionOnlyWhenMotionAllowed(activity);
  },
};
