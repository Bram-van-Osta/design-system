import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import type { ReactNode } from 'react';
import { pressedValueProps } from './pressed-value.ts';

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
}

const GROUP_CLASSES = 'inline-flex border-hair border-on-delft';
// The group draws the outer hair, each segment after the first the one before it.
const SEGMENT_CLASSES =
  'inline-flex min-h-target-min cursor-pointer items-center justify-center whitespace-nowrap border-on-delft bg-delft px-space-3 text-body-s font-semibold text-on-delft not-first:border-l-hair focus-visible:outline-on-delft hover:not-data-pressed:bg-delft-deep data-pressed:bg-on-delft data-pressed:text-ink';

/** A few views side by side on a Delft band, one pressed: the arrow keys move between them. */
export function ToggleGroup({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
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
      className={GROUP_CLASSES}
    >
      {options.map((option) => (
        <Toggle key={option.value} value={option.value} className={SEGMENT_CLASSES}>
          {option.label}
        </Toggle>
      ))}
    </BaseToggleGroup>
  );
}
