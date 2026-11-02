import { Select as BaseSelect } from '@base-ui/react/select';
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { CONTROL_CLASSES } from '../TextInput/control-classes.ts';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface SelectProps {
  readonly options: readonly SelectOption[];
  readonly value?: string | null;
  readonly defaultValue?: string | null;
  readonly onValueChange?: (value: string | null) => void;
  /** Shown while nothing is chosen; the package's "Choose…" otherwise. */
  readonly placeholder?: string;
  readonly name?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** One answer in a longer list, inside a Field. */
export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  name,
  required,
  disabled,
  className,
}: SelectProps) {
  const messages = useMessages();
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(nextValue: string | null) => onValueChange?.(nextValue)}
      name={name}
      required={required}
      disabled={disabled}
    >
      <BaseSelect.Trigger
        className={classNames(
          CONTROL_CLASSES,
          'flex cursor-pointer items-center justify-between gap-space-3 text-left',
          className,
        )}
      >
        <BaseSelect.Value
          placeholder={placeholder ?? messages['select.placeholder']}
          className="truncate data-placeholder:text-ink-muted"
        />
        <BaseSelect.Icon className="flex shrink-0">
          <CaretDownIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <SelectPopup options={options} />
    </BaseSelect.Root>
  );
}

interface SelectPopupProps {
  readonly options: readonly SelectOption[];
}

function SelectPopup({ options }: SelectPopupProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner className="z-10">
        <BaseSelect.Popup className="min-w-(--anchor-width) border-hair border-ink bg-bg">
          <BaseSelect.List className="max-h-(--available-height) overflow-y-auto">
            {options.map((option) => (
              <BaseSelect.Item
                key={option.value}
                value={option.value}
                className="flex min-h-target-min cursor-pointer items-center gap-space-3 px-space-4 text-body text-ink focus-visible:-outline-offset-2 data-highlighted:bg-surface data-selected:font-semibold"
              >
                <BaseSelect.ItemText className="flex-1">{option.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="flex text-delft">
                  <CheckIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}
