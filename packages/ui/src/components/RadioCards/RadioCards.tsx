import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { useControllableValue } from '../../utils/use-controllable-value.ts';
import { ChoiceCard } from '../ChoiceCard/ChoiceCard.tsx';
import { ChoiceDetailField } from '../ChoiceCard/ChoiceDetailField.tsx';
import type { ChoiceCardOption, ChoiceDetail } from '../ChoiceCard/choice-card.ts';
import { ChoiceColumns, ChoiceSize, choiceGridClassesOf } from '../ChoiceCard/choice-grid.ts';
import { useChoiceDetail } from '../ChoiceCard/use-choice-detail.ts';
import { ChoiceLegend } from '../Field/ChoiceLegend.tsx';
import { FieldError } from '../Field/FieldError.tsx';
import type { FieldMarker } from '../Field/field-marker.ts';
import { RadioButton } from '../RadioGroup/RadioButton.tsx';

export interface RadioCardsProps {
  /** The question the cards answer: a label, or the page's heading. */
  readonly legend: ReactNode;
  readonly options: readonly ChoiceCardOption[];
  readonly value?: string | null;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly description?: ReactNode;
  readonly error?: ReactNode;
  readonly marker?: FieldMarker;
  /**
   * `auto` by default: two columns once the group is 28 rem wide; `one` for a list on every width;
   * `three` for single words, two then three columns.
   */
  readonly columns?: ChoiceColumns;
  /** `regular` by default; `compact` for short answers, with `columns` `three` for single words. */
  readonly size?: ChoiceSize;
  /** The text field of "Other…", or of any answer that asks for words, once it is chosen. */
  readonly detail?: ChoiceDetail;
  readonly name?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

/**
 * One answer among cards, in two columns where there is room, or in one as a list: the arrow keys
 * move between them.
 */
export function RadioCards({
  legend,
  options,
  value,
  defaultValue,
  onValueChange,
  description,
  error,
  marker,
  columns = ChoiceColumns.auto,
  size = ChoiceSize.regular,
  detail,
  name,
  required,
  disabled,
  className,
}: RadioCardsProps) {
  const isInvalid = hasContent(error);
  const [chosenValue, setChosenValue] = useControllableValue(value, defaultValue ?? null);
  const choiceDetail = useChoiceDetail({
    detail,
    chosenValues: chosenValue === null ? [] : [chosenValue],
  });
  return (
    <BaseField.Root
      name={name}
      disabled={disabled}
      invalid={isInvalid}
      className={classNames('@container flex flex-col gap-space-2', className)}
    >
      <Fieldset.Root
        render={
          <BaseRadioGroup
            {...choiceDetail.groupProps}
            value={value}
            defaultValue={defaultValue}
            required={required}
            onValueChange={(nextValue: unknown) => {
              if (typeof nextValue === 'string') {
                setChosenValue(nextValue);
                onValueChange?.(nextValue);
                choiceDetail.onChoose(nextValue);
              }
            }}
          />
        }
        className="flex flex-col gap-space-1"
      >
        <ChoiceLegend legend={legend} marker={marker} description={description} />
        <div className={choiceGridClassesOf(columns, size)}>
          {options.map((option) => (
            <ChoiceCard
              key={option.value}
              option={option}
              size={size}
              control={
                <RadioButton
                  value={option.value}
                  aria-controls={choiceDetail.controlsFor(option.value)}
                />
              }
            />
          ))}
          {detail && choiceDetail.isShown && (
            <ChoiceDetailField detail={detail} input={choiceDetail.input} disabled={disabled} />
          )}
        </div>
      </Fieldset.Root>
      {isInvalid && <FieldError>{error}</FieldError>}
    </BaseField.Root>
  );
}
