import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Field as BaseField } from '@base-ui/react/field';
import { CheckIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { FieldError } from '../Field/FieldError.tsx';
import { hasContent } from '../Field/has-content.ts';

const BOX_CLASSES =
  'mt-0.5 flex size-5 shrink-0 items-center justify-center border-hair border-ink-muted bg-bg text-on-delft data-checked:border-delft data-checked:bg-delft data-disabled:border-line data-disabled:bg-surface';

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
      <BaseField.Label className="flex min-h-target-min cursor-pointer items-start gap-space-3 py-space-2 text-body text-ink data-disabled:cursor-not-allowed data-disabled:text-ink-muted">
        <BaseCheckbox.Root {...props} className={BOX_CLASSES}>
          <BaseCheckbox.Indicator className="flex data-unchecked:hidden">
            <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
          </BaseCheckbox.Indicator>
        </BaseCheckbox.Root>
        {label}
      </BaseField.Label>
      {isInvalid && <FieldError>{error}</FieldError>}
    </BaseField.Root>
  );
}
