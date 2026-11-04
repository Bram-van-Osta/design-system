import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { expectOnFirstLine } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import {
  expectKnobMotionOnlyWhenAllowed,
  expectSwitchLook,
  expectSwitchShape,
  SWITCH_DISABLED_OFF,
  SWITCH_DISABLED_ON,
  SWITCH_OFF,
  SWITCH_ON,
} from '../../testing/expect-switch.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Switch } from './Switch.tsx';

const NEW_REQUEST = 'A new request';
const NEW_REQUEST_DESCRIPTION = 'As soon as its address is confirmed.';

// REF-T9-03-Notifications-O and -M: the operator's notifications, each on its own line.
const NOTIFICATIONS = [
  { name: 'new-request', label: NEW_REQUEST, description: NEW_REQUEST_DESCRIPTION },
  {
    name: 'pre-analysis-ready',
    label: 'A pre-analysis ready',
    description: 'The request awaits you, with its reading.',
  },
  {
    name: 'client-message',
    label: 'A message from a client',
    description: 'In their space or by email.',
  },
] as const;

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  args: {
    label: NEW_REQUEST,
    description: NEW_REQUEST_DESCRIPTION,
    onCheckedChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="max-w-reading-width">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

function lineOf(control: Element): Element {
  return control.closest('label') ?? control;
}

export const On: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas, args }) => {
    const control = canvas.getByRole('switch', { name: NEW_REQUEST });
    await expect(control).toBeChecked();
    await expect(control).toHaveAccessibleDescription(NEW_REQUEST_DESCRIPTION);
    await expectSwitchShape(control, true);
    await expectSwitchLook(control, SWITCH_ON);
    await expectHeightAtLeast(lineOf(control), 'target-min');
    await expectOnFirstLine(lineOf(control), control);
    await expectKnobMotionOnlyWhenAllowed(control);
    await userEvent.click(canvas.getByText(NEW_REQUEST_DESCRIPTION));
    await expect(control).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledOnce();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
  },
};

export const Off: Story = {
  play: async ({ canvas, args }) => {
    const control = canvas.getByRole('switch', { name: NEW_REQUEST });
    await expect(control).not.toBeChecked();
    await expectSwitchShape(control, false);
    await expectSwitchLook(control, SWITCH_OFF);
    await userEvent.click(control);
    await expect(control).toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await waitFor(() => expectSwitchShape(control, true));
  },
};

// Pointing anywhere on the line deepens the track: Delft turns deep Delft, the background turns to
// the surface. Seen in the Storybook with the pointer: the stories have no pseudo-state addon.
export const Hover: Story = {
  render: (args) => (
    <div>
      <Switch {...args} defaultChecked />
      <Switch {...args} label="A message from a client" description="In their space or by email." />
    </div>
  ),
};

export const FocusVisible: Story = {
  args: { defaultChecked: true },
  play: async ({ canvas, args }) => {
    const control = canvas.getByRole('switch', { name: NEW_REQUEST });
    await userEvent.tab();
    await expectFocusRing(control);
    await userEvent.keyboard(' ');
    await expect(control).not.toBeChecked();
    await expect(args.onCheckedChange).toHaveBeenCalledOnce();
    await userEvent.keyboard('{Enter}');
    await expect(control).toBeChecked();
  },
};

export const DisabledOn: Story = {
  args: { defaultChecked: true, disabled: true },
  play: async ({ canvas, args }) => {
    const control = canvas.getByRole('switch', { name: NEW_REQUEST });
    await expect(control).toHaveAttribute('aria-disabled', 'true');
    await expectSwitchLook(control, SWITCH_DISABLED_ON);
    await expect(getComputedStyle(canvas.getByText(NEW_REQUEST)).color).toBe(
      tokenColor('ink-muted', control),
    );
    await userEvent.click(canvas.getByText(NEW_REQUEST));
    await expect(control).toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const DisabledOff: Story = {
  args: { disabled: true },
  play: async ({ canvas, args }) => {
    const control = canvas.getByRole('switch', { name: NEW_REQUEST });
    await expectSwitchLook(control, SWITCH_DISABLED_OFF);
    await userEvent.click(control);
    await expect(control).not.toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};

export const WithoutDescription: Story = {
  args: { description: undefined, defaultChecked: true },
  play: async ({ canvas }) => {
    const control = canvas.getByRole('switch', { name: NEW_REQUEST });
    await expect(control).toHaveAccessibleDescription('');
    await expectHeightAtLeast(lineOf(control), 'target-min');
    await expectOnFirstLine(lineOf(control), control);
  },
};

function NotificationList() {
  return (
    <section className="flex flex-col">
      {NOTIFICATIONS.map(({ name, label, description }) => (
        <Switch key={name} name={name} label={label} description={description} defaultChecked />
      ))}
    </section>
  );
}

async function expectNotificationRows(controls: readonly HTMLElement[]): Promise<void> {
  const lines = controls.map(lineOf);
  for (const [index, line] of lines.entries()) {
    const style = getComputedStyle(line);
    await expect(style.borderTopColor).toBe(tokenColor('line', line));
    await expect(Number.parseFloat(style.borderTopWidth)).toBe(tokenPixels('border-hair'));
    await expect([style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth]).toEqual([
      '0px',
      '0px',
      '0px',
    ]);
    await expect(Number.parseFloat(style.paddingTop)).toBe(tokenPixels('space-4'));
    await expect(Number.parseFloat(style.paddingBottom)).toBe(tokenPixels('space-4'));
    await expect(Number.parseFloat(style.columnGap)).toBe(tokenPixels('space-5'));
    await expectOnFirstLine(line, controls[index] ?? null);
    const previous = lines[index - 1];
    if (previous !== undefined) {
      await expect(line.getBoundingClientRect().top).toBe(previous.getBoundingClientRect().bottom);
    }
  }
  for (const control of controls) {
    await expect(control.getBoundingClientRect().right).toBe(
      lineOf(control).getBoundingClientRect().right,
    );
  }
}

export const NotificationSettings: Story = {
  render: () => <NotificationList />,
  play: async ({ canvas }) => {
    const controls = canvas.getAllByRole('switch');
    await expect(controls).toHaveLength(NOTIFICATIONS.length);
    await expectNotificationRows(controls);
    const label = canvas.getByText(NEW_REQUEST);
    await expect(getComputedStyle(label).fontSize).toBe(`${tokenPixels('text-label')}px`);
    await expect(getComputedStyle(label).fontWeight).toBe('600');
    const description = canvas.getByText(NEW_REQUEST_DESCRIPTION);
    await expect(getComputedStyle(description).color).toBe(tokenColor('ink-muted', description));
  },
};

export const OnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  render: () => <NotificationList />,
  play: async ({ canvas }) => {
    await expectNotificationRows(canvas.getAllByRole('switch'));
  },
};
