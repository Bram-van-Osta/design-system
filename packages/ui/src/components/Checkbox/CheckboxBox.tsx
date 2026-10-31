import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckIcon } from '@phosphor-icons/react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { CHOICE_CONTROL_CLASSES } from '../Field/choice-classes.ts';

const BOX_CLASSES = classNames(
  CHOICE_CONTROL_CLASSES,
  'text-on-delft data-checked:border-delft data-checked:bg-delft',
);

export type CheckboxBoxProps = Omit<
  BaseCheckbox.Root.Props,
  'className' | 'render' | 'nativeButton' | 'children'
>;

/** The square box of a yes or a no, with its check once ticked. */
export function CheckboxBox(props: CheckboxBoxProps) {
  return (
    <BaseCheckbox.Root {...props} className={BOX_CLASSES}>
      <BaseCheckbox.Indicator className="flex data-unchecked:hidden">
        <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}
