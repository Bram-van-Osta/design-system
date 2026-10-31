import type { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { hasContent } from '../../utils/has-content.ts';
import { CHOICE_LABEL_CLASSES } from '../Field/choice-classes.ts';
import { FieldError } from '../Field/FieldError.tsx';
import { CheckboxBox } from './CheckboxBox.tsx';

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
          <CheckboxBox {...props} />
        </span>
        {label}
      </BaseField.Label>
      {isInvalid && <FieldError>{error}</FieldError>}
    </BaseField.Root>
  );
}
