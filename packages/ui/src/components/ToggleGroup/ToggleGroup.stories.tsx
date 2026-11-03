import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import {
  expectFocusOnDelft,
  expectInkGroup,
  expectPressed,
  expectSegmentedGroup,
} from '../../testing/expect-toggle-group.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { ToggleGroup } from './ToggleGroup.tsx';
import { ToggleGroupTone } from './toggle-group-tone.ts';

const PREVIEW_ON = 'Preview on';
const COMPUTER = 'Computer';
const PHONE = 'Phone';

// C-05-BasculeApercu, direction 1: the operator's preview of a page as the client will see it.
const meta = {
  title: 'Actions/ToggleGroup',
  component: ToggleGroup,
  args: {
    label: PREVIEW_ON,
    options: [
      { value: 'computer', label: COMPUTER },
      { value: 'phone', label: PHONE },
    ],
    onValueChange: fn(),
  },
  argTypes: {
    options: { control: false },
  },
  decorators: [
    // A Delft band by default; the page's own background for the ink tone.
    (Story, { args }) => (
      <div
        className={
          args.tone === ToggleGroupTone.ink
            ? '-m-space-5 bg-bg p-space-5'
            : '-m-space-5 flex justify-end bg-delft px-space-4 py-space-2'
        }
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComputerPressed: Story = {
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: PREVIEW_ON });
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await expectSegmentedGroup(group, [computer, phone]);
    await expectPressed(computer, [phone]);
  },
};

export const PhonePressed: Story = {
  args: { defaultValue: 'phone' },
  play: async ({ canvas }) => {
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await expectPressed(phone, [computer]);
  },
};

export const Pointer: Story = {
  play: async ({ canvas, args }) => {
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await userEvent.click(phone);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('phone');
    await expectPressed(phone, [computer]);
    await userEvent.click(phone);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expectPressed(phone, [computer]);
  },
};

export const Keyboard: Story = {
  play: async ({ canvas, args }) => {
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await userEvent.tab();
    await expectFocusOnDelft(computer);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusOnDelft(phone);
    await expectPressed(computer, [phone]);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('phone');
    await expectPressed(phone, [computer]);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expectPressed(phone, [computer]);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusOnDelft(computer);
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('computer');
    await expectPressed(computer, [phone]);
    await userEvent.keyboard('{ArrowLeft}');
    await expectFocusOnDelft(phone);
  },
};

// C-27-SiteActuel: the views of a capture, in a dialog on the page's own background.
export const InkOnThePage: Story = {
  args: { tone: ToggleGroupTone.ink },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: PREVIEW_ON });
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await expectInkGroup(group, computer, [phone]);
    await expect(phone.getBoundingClientRect().left).toBe(computer.getBoundingClientRect().right);
    await expect(getComputedStyle(phone).borderLeftColor).toBe(tokenColor('ink', phone));
  },
};

export const InkKeyboard: Story = {
  args: { tone: ToggleGroupTone.ink },
  play: async ({ canvas, args }) => {
    const group = canvas.getByRole('group', { name: PREVIEW_ON });
    const computer = canvas.getByRole('button', { name: COMPUTER });
    const phone = canvas.getByRole('button', { name: PHONE });
    await userEvent.tab();
    await expectFocusRing(computer);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusRing(phone);
    await userEvent.keyboard(' ');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('phone');
    await expectInkGroup(group, phone, [computer]);
  },
};
