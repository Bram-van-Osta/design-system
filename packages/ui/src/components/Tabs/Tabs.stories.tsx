import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectOpenTab, expectUnderlinedTabs, panelOf } from '../../testing/expect-tabs.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { MessageBubble } from '../MessageBubble/MessageBubble.tsx';
import { Text } from '../Text/Text.tsx';
import { TextArea } from '../TextArea/TextArea.tsx';
import { Tabs, type TabsItem } from './Tabs.tsx';

const YOUR_REQUEST = 'Your request';
const MESSAGES = 'Messages';
const WHERE = 'Where your request stands';
const MESSAGE_COUNT = 1;
// The count, joined to its label by no-break spaces.
const COUNTED = new RegExp(`^·\\s${MESSAGE_COUNT}$`);
const REPLY = 'Your reply';

const messages: TabsItem = {
  value: 'messages',
  label: MESSAGES,
  panel: (
    <div className="flex flex-col gap-space-3">
      <MessageBubble author="Bram" sentAt="2 hours ago">
        The address example.com does not seem to be your site's. Do you have one today?
      </MessageBubble>
      <TextArea aria-label={REPLY} />
    </div>
  ),
};

const progress: TabsItem = {
  value: 'progress',
  label: WHERE,
  panel: <Text>We are looking at your site. Our offer usually comes within two days.</Text>,
};

// C-18-Onglets, direction 3: the client's request on a phone, its messages beside its steps.
const meta = {
  title: 'Layout/Tabs',
  component: Tabs,
  args: {
    label: YOUR_REQUEST,
    tabs: [messages, progress],
    onValueChange: fn(),
  },
  argTypes: {
    tabs: { control: false },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function tabsIn(canvas: HTMLElement) {
  const scope = within(canvas);
  return {
    list: scope.getByRole('tablist', { name: YOUR_REQUEST }),
    messagesTab: scope.getByRole('tab', { name: MESSAGES }),
    whereTab: scope.getByRole('tab', { name: WHERE }),
  };
}

export const FirstOpen: Story = {
  play: async ({ canvasElement }) => {
    const { list, messagesTab, whereTab } = tabsIn(canvasElement);
    await expectUnderlinedTabs(list, [messagesTab, whereTab]);
    await expectOpenTab(messagesTab, [whereTab]);
    await expect(panelOf(messagesTab)).toHaveRole('tabpanel');
  },
};

export const SecondOpen: Story = {
  args: { defaultValue: 'progress' },
  play: async ({ canvasElement }) => {
    const { messagesTab, whereTab } = tabsIn(canvasElement);
    await expectOpenTab(whereTab, [messagesTab]);
  },
};

export const WithCount: Story = {
  args: { tabs: [{ ...messages, count: MESSAGE_COUNT }, progress] },
  play: async ({ canvas, canvasElement }) => {
    const list = canvas.getByRole('tablist', { name: YOUR_REQUEST });
    const messagesTab = canvas.getByRole('tab', {
      name: new RegExp(`^${MESSAGES}\\s·\\s${MESSAGE_COUNT}$`),
    });
    const whereTab = canvas.getByRole('tab', { name: WHERE });
    await expectUnderlinedTabs(list, [messagesTab, whereTab]);
    await expectOpenTab(messagesTab, [whereTab]);
    const count = within(messagesTab).getByText(COUNTED);
    await expect(getComputedStyle(count).color).toBe(tokenColor('ink-muted', canvasElement));
  },
};

// The labels wrap on a narrow phone; the row never overflows.
export const LongLabels: Story = {
  args: {
    tabs: [
      { ...messages, label: 'Messages with the studio', count: MESSAGE_COUNT },
      { ...progress, label: 'Where your request stands, step by step' },
    ],
  },
  play: async ({ canvas }) => {
    const list = canvas.getByRole('tablist', { name: YOUR_REQUEST });
    await expectUnderlinedTabs(list, canvas.getAllByRole('tab'));
    const count = within(canvas.getAllByRole('tab')[0] ?? list).getByText(COUNTED);
    // One line: each of its pieces sits at the same height.
    const lines = new Set([...count.getClientRects()].map((rect) => Math.round(rect.top)));
    await expect(lines.size).toBe(1);
  },
};

export const Pointer: Story = {
  play: async ({ canvasElement, args }) => {
    const { messagesTab, whereTab } = tabsIn(canvasElement);
    await userEvent.click(whereTab);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await expect(args.onValueChange).toHaveBeenLastCalledWith('progress');
    await expectOpenTab(whereTab, [messagesTab]);
    await userEvent.click(whereTab);
    await expect(args.onValueChange).toHaveBeenCalledOnce();
    await userEvent.click(messagesTab);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('messages');
    await expectOpenTab(messagesTab, [whereTab]);
  },
};

export const Keyboard: Story = {
  play: async ({ canvasElement, args }) => {
    const { messagesTab, whereTab } = tabsIn(canvasElement);
    await userEvent.tab();
    await expectFocusRing(messagesTab);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusRing(whereTab);
    await expect(args.onValueChange).toHaveBeenLastCalledWith('progress');
    await expectOpenTab(whereTab, [messagesTab]);
    await userEvent.keyboard('{ArrowRight}');
    await expectFocusRing(messagesTab);
    await expectOpenTab(messagesTab, [whereTab]);
    await userEvent.keyboard('{End}');
    await expectOpenTab(whereTab, [messagesTab]);
    await userEvent.keyboard('{Home}');
    await expectFocusRing(messagesTab);
    await expectOpenTab(messagesTab, [whereTab]);
    await userEvent.keyboard('{ArrowLeft}');
    await expectOpenTab(whereTab, [messagesTab]);
    await userEvent.tab();
    await expectFocusRing(panelOf(whereTab));
  },
};

// The app keeps the open tab: a reply asked from outside the tabs opens the messages, then their
// field takes the focus.
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState(progress.value);
    const replyRef = useRef<HTMLDivElement>(null);
    return (
      <div className="flex flex-col gap-space-5">
        <Button
          variant={ButtonVariant.secondary}
          onClick={() => {
            setValue(messages.value);
            requestAnimationFrame(() => replyRef.current?.querySelector('textarea')?.focus());
          }}
        >
          Reply
        </Button>
        <Tabs
          {...args}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
          }}
          tabs={[
            {
              ...messages,
              panel: (
                <div ref={replyRef}>
                  <TextArea aria-label={REPLY} />
                </div>
              ),
            },
            progress,
          ]}
        />
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const { messagesTab, whereTab } = tabsIn(canvasElement);
    await expectOpenTab(whereTab, [messagesTab]);
    await userEvent.click(canvas.getByRole('button', { name: 'Reply' }));
    await expectOpenTab(messagesTab, [whereTab]);
    const reply = canvas.getByRole('textbox', { name: REPLY });
    await waitFor(() => expect(reply).toHaveFocus());
  },
};

// A hidden panel stays mounted: what the reader typed in it is still there when they come back.
export const DraftKept: Story = {
  play: async ({ canvas, canvasElement }) => {
    const { messagesTab, whereTab } = tabsIn(canvasElement);
    const draft = 'Not yet, it is our first one.';
    await userEvent.type(canvas.getByRole('textbox', { name: REPLY }), draft);
    await userEvent.click(whereTab);
    await userEvent.click(messagesTab);
    await expect(canvas.getByRole('textbox', { name: REPLY })).toHaveValue(draft);
  },
};
