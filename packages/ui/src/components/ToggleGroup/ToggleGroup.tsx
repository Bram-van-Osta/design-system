import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import { pressedValueProps } from './pressed-value.ts';
import { ToggleGroupTone } from './toggle-group-tone.ts';

export interface ToggleGroupOption {
  /** Unique among the group's options. */
  readonly value: string;
  readonly label: ReactNode;
}

export interface ToggleGroupProps {
  /** The group's name, read by screen readers, such as what the views show. */
  readonly label: string;
  readonly options: readonly ToggleGroupOption[];
  readonly value?: string;
  /** The view pressed at first; the first option's when none is given. */
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  /** Delft for a Delft band, the default; ink on the page's own background, such as a dialog. */
  readonly tone?: ToggleGroupTone;
}

const GROUP_CLASSES: Readonly<Record<ToggleGroupTone, string>> = {
  delft: 'inline-flex border-hair border-on-delft',
  ink: 'flex w-full border-hair border-ink md:inline-flex md:w-auto',
};
// The group draws the outer hair, each segment after the first the one before it.
const SEGMENT_BASE_CLASSES =
  'inline-flex min-h-target-min cursor-pointer items-center justify-center whitespace-nowrap px-space-3 text-body-s font-semibold not-first:border-l-hair';
const SEGMENT_CLASSES: Readonly<Record<ToggleGroupTone, string>> = {
  delft: `${SEGMENT_BASE_CLASSES} border-on-delft bg-delft text-on-delft focus-visible:outline-on-delft hover:not-data-pressed:bg-delft-deep data-pressed:bg-on-delft data-pressed:text-ink`,
  ink: `${SEGMENT_BASE_CLASSES} flex-1 border-ink bg-bg text-ink md:flex-none hover:not-data-pressed:bg-surface data-pressed:bg-ink data-pressed:text-bg`,
};

/**
 * A few views side by side, one pressed: the arrow keys move between them. On a Delft band, or in
 * ink on the page's own background.
 */
export function ToggleGroup({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  tone = ToggleGroupTone.delft,
}: ToggleGroupProps) {
  const pressed = pressedValueProps({
    value,
    defaultValue,
    firstValue: options[0]?.value,
    onValueChange,
  });
  return (
    <BaseToggleGroup
      aria-label={label}
      value={pressed.value}
      defaultValue={pressed.defaultValue}
      onValueChange={pressed.onValueChange}
      className={GROUP_CLASSES[tone]}
    >
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} className={SEGMENT_CLASSES[tone]}>
          {option.label}
        </Toggle>
      ))}
    </BaseToggleGroup>
  );
}
