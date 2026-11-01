import { OTPField } from '@base-ui/react/otp-field';
import { interpolate } from '../../i18n/interpolate.ts';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { CODE_LENGTH } from './code-digits.ts';
import { useCodeInput } from './use-code-input.ts';

const SLOT_POSITIONS = Array.from({ length: CODE_LENGTH }, (_, position) => position + 1);

const SLOT_CLASSES =
  'h-button-height w-button-height min-w-0 border-hair border-field bg-bg p-0 text-center font-mono text-heading-xs font-medium text-ink data-invalid:border-select data-invalid:border-ink data-disabled:cursor-not-allowed data-disabled:bg-surface data-disabled:text-ink-muted';

export interface CodeInputProps
  extends Omit<
    OTPField.Root.Props,
    | 'className'
    | 'render'
    | 'children'
    | 'length'
    | 'validationType'
    | 'value'
    | 'defaultValue'
    | 'onValueChange'
    | 'onValueComplete'
  > {
  /** The digits typed so far, at most six. */
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (code: string) => void;
  /** Called once the six digits are there, typed, pasted or offered by the phone. */
  readonly onComplete?: (code: string) => void;
  readonly className?: string;
}

/**
 * A one-time code of six digits in six slots, inside a Field that names it: typed, pasted, or
 * offered by the phone from a mail or a message. A whole code replaces the one already there.
 */
export function CodeInput({
  value,
  defaultValue,
  onValueChange,
  onComplete,
  className,
  ...props
}: CodeInputProps) {
  const messages = useMessages();
  const { rootProps, slotProps } = useCodeInput({ value, defaultValue, onValueChange, onComplete });
  return (
    <OTPField.Root
      {...props}
      {...rootProps}
      length={CODE_LENGTH}
      validationType="numeric"
      className={classNames('flex w-fit max-w-full gap-space-2', className)}
    >
      {SLOT_POSITIONS.map((position) => (
        <OTPField.Input
          key={position}
          {...slotProps}
          // The first slot is named by the Field's label.
          aria-label={
            position === 1
              ? undefined
              : interpolate(messages['codeInput.slot'], { position, count: CODE_LENGTH })
          }
          className={SLOT_CLASSES}
        />
      ))}
    </OTPField.Root>
  );
}
