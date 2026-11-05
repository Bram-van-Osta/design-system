import { CircleNotchIcon } from '@phosphor-icons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  expectNoPartPreview,
  expectPartFolded,
  expectPartMotionOnlyWhenAllowed,
  expectPartOpen,
  expectPartPreview,
  expectPartRow,
  expectRingInsidePanel,
  panelOf,
} from '../../testing/expect-disclosure-part.ts';
import { expectOnFirstLine, lineCount } from '../../testing/expect-first-line.ts';
import { expectFocusRing } from '../../testing/expect-focus-ring.ts';
import { expectHeightAtLeast } from '../../testing/expect-height.ts';
import { tokenColor } from '../../testing/token-color.ts';
import { tokenPixels } from '../../testing/token-pixels.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import { Link } from '../Link/Link.tsx';
import { StatusMark, StatusMarkLevel } from '../StatusMark/StatusMark.tsx';
import { Text } from '../Text/Text.tsx';
import { Disclosure } from './Disclosure.tsx';
import { DisclosureVariant } from './disclosure-variant.ts';

const PARTS = [
  'Who is responsible',
  'What we collect',
  'Why, and on what basis',
  'The AI tools',
  'Who else processes it',
  'How long',
  'Your rights',
] as const;

const SUMMARY = `Contents · ${PARTS.length} parts`;

// REF-T10-02-Sommaire-M: the privacy policy's contents, folded at the top of the page on a phone.
const contents = (
  <nav aria-label="Contents">
    <ul>
      {PARTS.map((part, index) => (
        <li key={part}>
          <Link href={`#part-${index + 1}`} className="px-space-3">
            {part}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

const meta = {
  title: 'Layout/Disclosure',
  component: Disclosure,
  args: {
    summary: SUMMARY,
    children: contents,
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Folded: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: SUMMARY });
    await expectHeightAtLeast(trigger, 'button-height');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('link', { name: 'Your rights' })).not.toBeInTheDocument();
    await userEvent.tab();
    await expectFocusRing(trigger);
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const firstPart = canvas.getByRole('link', { name: 'Who is responsible' });
    await expect(firstPart).toBeVisible();
    await expectHeightAtLeast(firstPart, 'target-min');
    await userEvent.tab();
    await expectFocusRing(firstPart);
    await userEvent.tab({ shift: true });
    await userEvent.keyboard(' ');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await waitFor(() =>
      expect(canvas.queryByRole('link', { name: 'Who is responsible' })).not.toBeInTheDocument(),
    );
  },
};

export const Unfolded: Story = {
  args: { isDefaultOpen: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: SUMMARY })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getAllByRole('link')).toHaveLength(PARTS.length);
  },
};

// The app keeps the state, and folds the contents once the reader follows a part's link.
export const FoldedOnceFollowed: Story = {
  render: function FoldedOnceFollowedStory(args) {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Disclosure {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
        <nav aria-label="Contents">
          <Link
            href="#part-7"
            onClick={(event) => {
              // The test page must not move: an app's router follows the link instead.
              event.preventDefault();
              setIsOpen(false);
            }}
          >
            Your rights
          </Link>
        </nav>
      </Disclosure>
    );
  },
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('link', { name: 'Your rights' }));
    await expect(canvas.getByRole('button', { name: SUMMARY })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

const PRE_ANALYSIS = "The agent's pre-analysis";
const CURRENT_SITE = 'The current site';
const PART_LEVEL = 2;
const READING_LINK = 'Open the full reading';
const UNFOLD_EVERY_PART = 'Unfold every part';

// The operator's request page: a long part folds under its label, its rule kept.
const preAnalysis = (
  <div className="flex flex-col gap-space-3 pt-space-1">
    <Text>
      The Boulangerie du Port wants a site of five pages in French and English, with its opening
      hours and a form to order a cake.
    </Text>
    <Link href="#reading">{READING_LINK}</Link>
  </div>
);

const LEGAL_NOTICE = 'Legal notice: the company, its registration and its host.';

const SITE_PAGES = [
  'Home: the shop, its bread and its hours, with three photos of the counter.',
  'Our bread: twelve breads, each with its flour, its weight and its price.',
  'Cakes to order: a list of eight cakes, and a phone number to call two days ahead.',
  'The team: four bakers, a sentence and a photo each.',
  'Contact: the address on the harbor, a map, and the mail address contact@example.com.',
  LEGAL_NOTICE,
] as const;

const currentSite = (
  <div className="flex flex-col gap-space-3 pt-space-1">
    <Link href="#site">example.com</Link>
    {SITE_PAGES.map((page) => (
      <Text key={page}>{page}</Text>
    ))}
    <Text>
      The site was built ten years ago. It loads slowly on a phone, its texts are images in places,
      and its contact form no longer sends anything. Most of its content can be kept, rewritten in
      shorter sentences, and its photos taken again in daylight.
    </Text>
  </div>
);

const partArgs = {
  variant: DisclosureVariant.part,
  headingLevel: PART_LEVEL,
  summary: PRE_ANALYSIS,
  children: preAnalysis,
} as const;

// A folded part's preview follows its label in its name: the part is found by its label.
function partTrigger(canvasElement: HTMLElement, label: string): HTMLElement {
  const name = (accessibleName: string) => accessibleName.startsWith(label);
  const heading = within(canvasElement).getByRole('heading', { level: PART_LEVEL, name });
  return within(heading).getByRole('button', { name });
}

export const PartOpen: Story = {
  args: { ...partArgs, isDefaultOpen: true },
  play: async ({ canvas, canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await expectPartRow(trigger, PART_LEVEL);
    await expectPartOpen(trigger);
    await expectPartMotionOnlyWhenAllowed(trigger);
    await expect(canvas.getByRole('link', { name: READING_LINK })).toBeVisible();
  },
};

export const PartFolded: Story = {
  args: partArgs,
  play: async ({ canvas, canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await expectPartRow(trigger, PART_LEVEL);
    await expectPartFolded(trigger, () => canvas.queryByRole('link', { name: READING_LINK }));
    await userEvent.click(trigger);
    await expectPartOpen(trigger);
    await userEvent.click(trigger);
    await expectPartFolded(trigger, () => canvas.queryByRole('link', { name: READING_LINK }));
  },
};

export const PartFocus: Story = {
  args: partArgs,
  play: async ({ canvas, canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await userEvent.tab();
    await expectFocusRing(trigger);
    await userEvent.keyboard('{Enter}');
    await expectPartOpen(trigger);
    const link = canvas.getByRole('link', { name: READING_LINK });
    await userEvent.tab();
    await expectFocusRing(link);
    await expectRingInsidePanel(link, trigger);
    await userEvent.tab({ shift: true });
    await expectFocusRing(trigger);
    await userEvent.keyboard(' ');
    await expectPartFolded(trigger, () => canvas.queryByRole('link', { name: READING_LINK }));
  },
};

export const PartWithLongContent: Story = {
  args: { ...partArgs, summary: CURRENT_SITE, children: currentSite, isDefaultOpen: true },
  play: async ({ canvas, canvasElement }) => {
    const trigger = partTrigger(canvasElement, CURRENT_SITE);
    await expectPartRow(trigger, PART_LEVEL);
    await expectPartOpen(trigger);
    const lastPage = canvas.getByText(LEGAL_NOTICE);
    await expect(lastPage).toBeVisible();
    await expect(panelOf(trigger).getBoundingClientRect().bottom).toBeGreaterThan(
      lastPage.getBoundingClientRect().bottom,
    );
  },
};

const LONG_LABEL =
  'The current site, its pages and what they hold, read on a computer then a phone';

export const PartOnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  args: { ...partArgs, summary: LONG_LABEL, children: currentSite },
  play: async ({ canvasElement }) => {
    const trigger = partTrigger(canvasElement, LONG_LABEL);
    await expect(lineCount(trigger)).toBeGreaterThan(1);
    await expectPartRow(trigger, PART_LEVEL);
    await userEvent.click(trigger);
    await expectPartOpen(trigger);
  },
};

// The app keeps the parts' state: one press unfolds every part of the page.
export const PartsControlled: Story = {
  args: partArgs,
  render: function PartsControlledStory() {
    const [openParts, setOpenParts] = useState<ReadonlySet<string>>(new Set());
    const onOpenChange = (part: string) => (isOpen: boolean) =>
      setOpenParts((parts) => {
        const next = new Set(parts);
        if (isOpen) {
          next.add(part);
        } else {
          next.delete(part);
        }
        return next;
      });
    return (
      <div className="flex flex-col gap-space-5">
        <Button
          variant={ButtonVariant.secondary}
          onClick={() => setOpenParts(new Set([PRE_ANALYSIS, CURRENT_SITE]))}
        >
          {UNFOLD_EVERY_PART}
        </Button>
        {[
          { label: PRE_ANALYSIS, content: preAnalysis },
          { label: CURRENT_SITE, content: currentSite },
        ].map(({ label, content }) => (
          <Disclosure
            key={label}
            variant={DisclosureVariant.part}
            headingLevel={PART_LEVEL}
            summary={label}
            isOpen={openParts.has(label)}
            onOpenChange={onOpenChange(label)}
          >
            {content}
          </Disclosure>
        ))}
      </div>
    );
  },
  play: async ({ canvas, canvasElement }) => {
    const preAnalysisTrigger = partTrigger(canvasElement, PRE_ANALYSIS);
    const currentSiteTrigger = partTrigger(canvasElement, CURRENT_SITE);
    await expect(preAnalysisTrigger).toHaveAttribute('aria-expanded', 'false');
    await expect(currentSiteTrigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(canvas.getByRole('button', { name: UNFOLD_EVERY_PART }));
    await expectPartOpen(preAnalysisTrigger);
    await expectPartOpen(currentSiteTrigger);
    await userEvent.click(preAnalysisTrigger);
    await expectPartFolded(preAnalysisTrigger, () =>
      canvas.queryByRole('link', { name: READING_LINK }),
    );
    await expect(currentSiteTrigger).toHaveAttribute('aria-expanded', 'true');
  },
};

// C-29-PartieRepliee, look A: folded, a part says where it stands in a line under its label.
const SUMMARY_PREVIEW = 'Size M · 7 pages · 3 points of attention · 2 questions to ask';
const RUNNING_PREVIEW = 'Pre-analysis running · requested at 9:17 · usually a few minutes';
const STOPPED_PREVIEW = 'Stopped: the site did not answer';
const LONG_PREVIEW =
  'example.com · WordPress · 16 pages found · 2 to fix · its contact form no longer sends anything';
const SPINNER_SIZE = 14;

const spinner = (
  <CircleNotchIcon
    size={SPINNER_SIZE}
    aria-hidden
    data-testid="spinner"
    className="motion-safe:animate-spin"
  />
);

const stoppedMark = <StatusMark level={StatusMarkLevel.poor} />;

async function unfoldWithoutPreview(trigger: HTMLElement, label: string): Promise<void> {
  await userEvent.click(trigger);
  await expectPartOpen(trigger);
  await expectNoPartPreview(trigger, label);
}

export const PartFoldedWithPreview: Story = {
  args: { ...partArgs, preview: SUMMARY_PREVIEW },
  play: async ({ canvas, canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await expectPartRow(trigger, PART_LEVEL);
    await expectPartPreview({ trigger, label: PRE_ANALYSIS, preview: SUMMARY_PREVIEW });
    await unfoldWithoutPreview(trigger, PRE_ANALYSIS);
    await userEvent.click(trigger);
    await expectPartFolded(trigger, () => canvas.queryByRole('link', { name: READING_LINK }));
    await expectPartPreview({ trigger, label: PRE_ANALYSIS, preview: SUMMARY_PREVIEW });
  },
};

export const PartFoldedWithSpinner: Story = {
  args: { ...partArgs, preview: RUNNING_PREVIEW, previewMark: spinner },
  play: async ({ canvas, canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await expectPartRow(trigger, PART_LEVEL);
    const line = await expectPartPreview({
      trigger,
      label: PRE_ANALYSIS,
      preview: RUNNING_PREVIEW,
    });
    await expectOnFirstLine(line, canvas.getByTestId('spinner'));
    await unfoldWithoutPreview(trigger, PRE_ANALYSIS);
    await expect(canvas.getByTestId('spinner')).not.toBeVisible();
  },
};

export const PartFoldedWithStatusMark: Story = {
  args: { ...partArgs, preview: STOPPED_PREVIEW, previewMark: stoppedMark },
  play: async ({ canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await expectPartRow(trigger, PART_LEVEL);
    const line = await expectPartPreview({
      trigger,
      label: PRE_ANALYSIS,
      preview: STOPPED_PREVIEW,
    });
    const mark = line.querySelector(`[data-level="${StatusMarkLevel.poor}"]`);
    await expectOnFirstLine(line, mark);
    if (mark?.firstElementChild) {
      await expect(getComputedStyle(mark.firstElementChild).backgroundColor).toBe(
        tokenColor('vermillion', mark),
      );
    }
  },
};

export const PartFoldedWithLongPreviewOnAPhone: Story = {
  globals: { viewport: { value: 'mobile1' } },
  args: {
    ...partArgs,
    summary: CURRENT_SITE,
    children: currentSite,
    preview: LONG_PREVIEW,
    previewMark: stoppedMark,
  },
  play: async ({ canvasElement }) => {
    const trigger = partTrigger(canvasElement, CURRENT_SITE);
    await expectPartRow(trigger, PART_LEVEL);
    const line = await expectPartPreview({ trigger, label: CURRENT_SITE, preview: LONG_PREVIEW });
    const text = within(line).getByText(LONG_PREVIEW);
    await expect(lineCount(text)).toBeGreaterThan(1);
    await expect(text.scrollWidth).toBeLessThanOrEqual(text.clientWidth);
    await expect(line.getBoundingClientRect().right).toBeLessThanOrEqual(
      trigger.getBoundingClientRect().right,
    );
    await expectOnFirstLine(line, line.querySelector(`[data-level="${StatusMarkLevel.poor}"]`));
    await unfoldWithoutPreview(trigger, CURRENT_SITE);
  },
};

export const PartOpenWithPreview: Story = {
  args: { ...partArgs, preview: SUMMARY_PREVIEW, previewMark: spinner, isDefaultOpen: true },
  play: async ({ canvas, canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await expectPartOpen(trigger);
    await expectNoPartPreview(trigger, PRE_ANALYSIS);
    await expect(canvas.getByTestId('spinner')).not.toBeVisible();
  },
};

export const PartFoldedWithoutPreview: Story = {
  args: partArgs,
  play: async ({ canvasElement }) => {
    const trigger = partTrigger(canvasElement, PRE_ANALYSIS);
    await expectPartRow(trigger, PART_LEVEL);
    await expectNoPartPreview(trigger, PRE_ANALYSIS);
    await expect(trigger.querySelector('[data-part-preview]')).toBeNull();
    await expect(Math.round(trigger.getBoundingClientRect().height)).toBe(
      tokenPixels('target-min'),
    );
  },
};
