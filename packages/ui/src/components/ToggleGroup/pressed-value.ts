import type { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';

interface PressedValueOptions {
  readonly value: string | undefined;
  readonly defaultValue: string | undefined;
  readonly firstValue: string | undefined;
  readonly onValueChange: ((value: string) => void) | undefined;
}

function pressedValuesOf(value: string | undefined): readonly string[] | undefined {
  return value === undefined ? undefined : [value];
}

/**
 * Holds one pressed value in Base UI's group of values: the first option's when none is given, and
 * pressing the pressed one again is canceled, so that one always stays pressed.
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
