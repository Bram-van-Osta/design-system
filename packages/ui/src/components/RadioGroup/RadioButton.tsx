import { Radio } from '@base-ui/react/radio';
import { classNames } from '../../utils/class-names.ts';
import { CHOICE_CONTROL_CLASSES } from '../Field/choice-classes.ts';

const RADIO_CLASSES = classNames(
  CHOICE_CONTROL_CLASSES,
  'rounded-round data-checked:border-select data-checked:border-delft',
);

export type RadioButtonProps = Omit<Radio.Root.Props, 'className' | 'render' | 'children'>;

/** The round box of one answer, inside a radio group. */
export function RadioButton(props: RadioButtonProps) {
  return (
    <Radio.Root {...props} className={RADIO_CLASSES}>
      <Radio.Indicator className="size-2.5 rounded-round bg-delft data-unchecked:hidden" />
    </Radio.Root>
  );
}
