import { Input } from '@base-ui/react/input';
import { classNames } from '../../utils/class-names.ts';
import { CODE_LENGTH } from './code-digits.ts';
import { useCodeInput } from './use-code-input.ts';

const CELL_POSITIONS = Array.from({ length: CODE_LENGTH }, (_, position) => position);

// The cells follow the input, their peer: its focus, its error and its disabled state.
const CELL_CLASSES =
  'flex h-button-height w-button-height min-w-0 items-center justify-center border-hair border-field bg-bg font-mono text-heading-xs font-medium text-ink peer-data-invalid:border-select peer-data-invalid:border-ink peer-data-disabled:bg-surface peer-data-disabled:text-ink-muted peer-focus-visible:data-active:outline-2 peer-focus-visible:data-active:outline-offset-2 peer-focus-visible:data-active:outline-focus';

export interface CodeInputProps
  extends Omit<
    Input.Props,
    | 'className'
    | 'render'
    | 'type'
    | 'inputMode'
    | 'maxLength'
    | 'value'
    | 'defaultValue'
    | 'onValueChange'
    | 'onSelect'
    | 'onFocus'
    | 'onClick'
    | 'onPaste'
  > {
  /** The digits typed so far, at most six. */
  readonly value?: string;
  readonly defaultValue?: string;
  /** Called with the digits only: letters, spaces and dashes are dropped. */
  readonly onValueChange?: (code: string) => void;
  readonly className?: string;
}

/**
 * A one-time code of six digits, inside a Field that names it. One input under six cells: it takes
 * typing, pasting, Backspace, the arrows and the code the phone offers from a mail or a message.
 */
export function CodeInput({
  value,
  defaultValue,
  onValueChange,
  className,
  ...props
}: CodeInputProps) {
  const { code, activePosition, inputProps } = useCodeInput({
    value,
    defaultValue,
    onValueChange,
  });
  return (
    <div className={classNames('relative flex w-fit max-w-full gap-space-2', className)}>
      <Input
        autoComplete="one-time-code"
        {...props}
        {...inputProps}
        inputMode="numeric"
        className="peer absolute inset-0 size-full cursor-text opacity-0 data-disabled:cursor-not-allowed"
      />
      {CELL_POSITIONS.map((position) => (
        <span
          key={position}
          aria-hidden
          data-active={position === activePosition || undefined}
          className={CELL_CLASSES}
        >
          {code[position]}
        </span>
      ))}
    </div>
  );
}
