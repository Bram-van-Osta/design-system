import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { CHOICE_CONTROL_CLASSES, CHOICE_LABEL_CLASSES } from '../Field/choice-classes.ts';
import { FieldError } from '../Field/FieldError.tsx';
import { FieldMarkerText } from '../Field/FieldMarkerText.tsx';
import type { FieldMarker } from '../Field/field-marker.ts';

const RADIO_CLASSES = classNames(
  CHOICE_CONTROL_CLASSES,
  'rounded-round data-checked:border-select data-checked:border-delft',
);

export interface RadioOption {
  readonly value: string;
  readonly label: ReactNode;
  /** An example or a precision under the label. */
  readonly description?: ReactNode;
  readonly disabled?: boolean;
}

export interface RadioGroupProps {
  /** The question the options answer. */
  readonly legend: ReactNode;
  readonly options: readonly RadioOption[];
  readonly value?: string | null;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly description?: ReactNode;
  readonly error?: ReactNode;
  readonly marker?: FieldMarker;
  readonly name?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** One answer among a few, all visible: the arrow keys move between them. */
export function RadioGroup({
  legend,
  options,
  value,
  defaultValue,
  onValueChange,
  description,
  error,
  marker,
  name,
  required,
  disabled,
  className,
}: RadioGroupProps) {
  const isInvalid = hasContent(error);
  return (
    <BaseField.Root
      name={name}
      disabled={disabled}
      invalid={isInvalid}
      className={classNames('flex flex-col gap-space-2', className)}
    >
      <Fieldset.Root
        render={
          <BaseRadioGroup
            value={value}
            defaultValue={defaultValue}
            required={required}
            onValueChange={(nextValue: unknown) => {
              if (typeof nextValue === 'string') {
                onValueChange?.(nextValue);
              }
            }}
          />
        }
        className="flex flex-col gap-space-1"
      >
        <RadioGroupLegend legend={legend} marker={marker} description={description} />
        {options.map((option) => (
          <RadioItem key={option.value} option={option} />
        ))}
      </Fieldset.Root>
      {isInvalid && <FieldError>{error}</FieldError>}
    </BaseField.Root>
  );
}

interface RadioGroupLegendProps {
  readonly legend: ReactNode;
  readonly marker: FieldMarker | undefined;
  readonly description: ReactNode;
}

function RadioGroupLegend({ legend, marker, description }: RadioGroupLegendProps) {
  return (
    <>
      <Fieldset.Legend className="mb-space-1 text-label text-ink">
        {legend}
        {marker && <FieldMarkerText marker={marker} />}
      </Fieldset.Legend>
      {hasContent(description) && (
        <BaseField.Description className="mb-space-1 text-body-s text-ink-muted">
          {description}
        </BaseField.Description>
      )}
    </>
  );
}

interface RadioItemProps {
  readonly option: RadioOption;
}

function RadioItem({ option }: RadioItemProps) {
  return (
    <BaseField.Item disabled={option.disabled}>
      <BaseField.Label className={CHOICE_LABEL_CLASSES}>
        <Radio.Root value={option.value} className={RADIO_CLASSES}>
          <Radio.Indicator className="size-2.5 rounded-round bg-delft data-unchecked:hidden" />
        </Radio.Root>
        <span className="flex flex-col">
          {option.label}
          {hasContent(option.description) && (
            <span className="text-body-s text-ink-muted">{option.description}</span>
          )}
        </span>
      </BaseField.Label>
    </BaseField.Item>
  );
}
