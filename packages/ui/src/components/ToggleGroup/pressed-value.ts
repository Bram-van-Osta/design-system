import type { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';

interface PressedValueOptions {
  readonly value: string | null | undefined;
  readonly defaultValue: string | undefined;
  /** The value pressed when none is given; none pressed when it is undefined too. */
  readonly firstValue: string | undefined;
  readonly onValueChange: ((value: string) => void) | undefined;
}

function pressedValuesOf(value: string | null | undefined): readonly string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  return value === null ? [] : [value];
}

/**
 * Holds one pressed value in Base UI's group of values, the first option's when none is given if
 * the group has one; pressing the pressed one again is canceled, so that a pressed one stays
 * pressed.
 */
export function pressedValueProps({
  value,
  defaultValue,
  firstValue,
  onValueChange,
}: PressedValueOptions) {
  return {
    value: pressedValuesOf(value),
    defaultValue: pressedValuesOf(defaultValue ?? firstValue),
    onValueChange: (
      groupValue: readonly string[],
      eventDetails: BaseToggleGroup.ChangeEventDetails,
    ) => {
      const [nextValue] = groupValue;
      if (nextValue === undefined) {
        eventDetails.cancel();
        return;
      }
      onValueChange?.(nextValue);
    },
  };
}
