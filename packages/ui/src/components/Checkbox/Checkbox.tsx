import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Field as BaseField } from '@base-ui/react/field';
import { CheckIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { hasContent } from '../../utils/has-content.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { CHOICE_CONTROL_CLASSES, CHOICE_LABEL_CLASSES } from '../Field/choice-classes.ts';
import { FieldError } from '../Field/FieldError.tsx';

const BOX_CLASSES = classNames(
  CHOICE_CONTROL_CLASSES,
  'text-on-delft data-checked:border-delft data-checked:bg-delft',
);

export interface CheckboxProps
  extends Omit<BaseCheckbox.Root.Props, 'className' | 'render' | 'nativeButton' | 'children'> {
  /** The sentence beside the box, which names it. */
  readonly label: ReactNode;
  /** What is wrong, in words, under the box. */
  readonly error?: ReactNode;
  readonly className?: string;
}

/** A yes or a no, with its sentence beside it: the whole line is the target. */
export function Checkbox({ label, error, name, disabled, className, ...props }: CheckboxProps) {
  const isInvalid = hasContent(error);
  return (
    <BaseField.Root
      name={name}
      disabled={disabled}
      invalid={isInvalid}
      className={classNames('flex flex-col gap-space-1', className)}
    >
      <BaseField.Label className={CHOICE_LABEL_CLASSES}>
        <span className={FIRST_LINE_SLOT_CLASSES}>
          <BaseCheckbox.Root {...props} className={BOX_CLASSES}>
            <BaseCheckbox.Indicator className="flex data-unchecked:hidden">
              <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
            </BaseCheckbox.Indicator>
          </BaseCheckbox.Root>
        </span>
        {label}
      </BaseField.Label>
      {isInvalid && <FieldError>{error}</FieldError>}
    </BaseField.Root>
  );
}
