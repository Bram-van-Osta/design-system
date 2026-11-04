import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { CheckIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { pressedValueProps } from './pressed-value.ts';
import { ToggleGroupTone } from './toggle-group-tone.ts';

export interface ToggleGroupOption {
  /** Unique among the group's options. */
  readonly value: string;
  readonly label: ReactNode;
}

export interface ToggleGroupProps {
  /** The group's name, read by screen readers, such as what the views show; or `labelledBy`. */
  readonly label?: string;
  /** The ids of what names the group on the page in place of `label`, such as a question and the sentence it asks about. */
  readonly labelledBy?: string;
  readonly options: readonly ToggleGroupOption[];
  /** The pressed option's value; `null` for none, which only answers start with. */
  readonly value?: string | null;
  /** The option pressed at first: the first option's when none is given, except for answers. */
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  /** Delft for a Delft band, the default; ink on the page's own background; answer for a question's answers. */
  readonly tone?: ToggleGroupTone;
  /** The whole group unavailable, in the line color, its pressed option kept. */
  readonly disabled?: boolean;
}

// Unavailable, on any tone: in the line color, as a disabled primary button.
const DISABLED_CLASSES =
  'data-disabled:cursor-not-allowed data-disabled:border-line data-disabled:bg-surface data-disabled:text-ink-muted data-disabled:data-pressed:bg-line data-disabled:data-pressed:text-ink-muted';

const GROUP_CLASSES: Readonly<Record<ToggleGroupTone, string>> = {
  delft: 'inline-flex border-hair border-on-delft data-disabled:border-line',
  ink: 'flex w-full border-hair border-ink data-disabled:border-line md:inline-flex md:w-auto',
  answer: 'grid auto-cols-fr grid-flow-col gap-space-2 md:gap-space-3',
};
// The group draws the outer hair, each segment after the first the one before it.
const SEGMENT_BASE_CLASSES = `inline-flex min-h-target-min cursor-pointer items-center justify-center whitespace-nowrap px-space-3 text-body-s font-semibold not-first:border-l-hair ${DISABLED_CLASSES}`;
// Each answer in its own hair; its label may take two lines on a phone, centered in its column.
const ANSWER_CLASSES = `group inline-flex min-h-button-height min-w-0 cursor-pointer items-center justify-center gap-space-2 border-hair border-ink bg-bg px-space-2 py-space-2 text-center text-body-s font-medium text-ink md:px-space-4 md:text-body md:font-medium hover:not-data-pressed:not-data-disabled:bg-surface data-pressed:bg-delft data-pressed:font-semibold data-pressed:text-on-delft hover:data-pressed:not-data-disabled:bg-delft-deep ${DISABLED_CLASSES}`;
const SEGMENT_CLASSES: Readonly<Record<ToggleGroupTone, string>> = {
  delft: `${SEGMENT_BASE_CLASSES} border-on-delft bg-delft text-on-delft focus-visible:outline-on-delft hover:not-data-pressed:not-data-disabled:bg-delft-deep data-pressed:bg-on-delft data-pressed:text-ink`,
  ink: `${SEGMENT_BASE_CLASSES} flex-1 border-ink bg-bg text-ink md:flex-none hover:not-data-pressed:not-data-disabled:bg-surface data-pressed:bg-ink data-pressed:text-bg`,
  answer: ANSWER_CLASSES,
};

/** The first option is pressed at first, except among answers, which wait for the reader's. */
function firstPressedValueOf(
  tone: ToggleGroupTone,
  options: readonly ToggleGroupOption[],
): string | undefined {
  return tone === ToggleGroupTone.answer ? undefined : options[0]?.value;
}

/**
 * A few options side by side, one pressed: the arrow keys move between them, and pressing the
 * pressed one again keeps it. Views on a Delft band or in ink on the page's own background; or a
 * question's answers, none pressed until one is chosen.
 */
export function ToggleGroup({
  label,
  labelledBy,
  options,
  value,
  defaultValue,
  onValueChange,
  tone = ToggleGroupTone.delft,
  disabled,
}: ToggleGroupProps) {
  const pressed = pressedValueProps({
    value,
    defaultValue,
    firstValue: firstPressedValueOf(tone, options),
    onValueChange,
  });
  return (
    <BaseToggleGroup
      aria-label={label}
      aria-labelledby={labelledBy}
      value={pressed.value}
      defaultValue={pressed.defaultValue}
      onValueChange={pressed.onValueChange}
      disabled={disabled}
      className={GROUP_CLASSES[tone]}
    >
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} className={SEGMENT_CLASSES[tone]}>
          {tone === ToggleGroupTone.answer && (
            <CheckIcon
              size={ICON_SIZE.inline}
              weight={ICON_WEIGHT}
              className="hidden shrink-0 md:group-data-pressed:block"
              aria-hidden
            />
          )}
          {option.label}
        </Toggle>
      ))}
    </BaseToggleGroup>
  );
}
