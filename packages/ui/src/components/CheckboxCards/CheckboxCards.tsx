import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { useControllableValue } from '../../utils/use-controllable-value.ts';
import { CheckboxBox } from '../Checkbox/CheckboxBox.tsx';
import { ChoiceCard } from '../ChoiceCard/ChoiceCard.tsx';
import { ChoiceDetailField } from '../ChoiceCard/ChoiceDetailField.tsx';
import type { ChoiceCardOption, ChoiceDetail } from '../ChoiceCard/choice-card.ts';
import { ChoiceColumns, ChoiceSize, choiceGridClassesOf } from '../ChoiceCard/choice-grid.ts';
import { useChoiceDetail } from '../ChoiceCard/use-choice-detail.ts';
import { ChoiceLegend } from '../Field/ChoiceLegend.tsx';
import { FieldError } from '../Field/FieldError.tsx';
import type { FieldMarker } from '../Field/field-marker.ts';

const NO_VALUES: readonly string[] = [];

export interface CheckboxCardsProps {
  /** The question the cards answer: a label, or the page's heading. */
  readonly legend: ReactNode;
  readonly options: readonly ChoiceCardOption[];
  readonly value?: readonly string[];
  readonly defaultValue?: readonly string[];
  readonly onValueChange?: (value: string[]) => void;
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
  /** The text field of "Other…", across the grid under the cards, once it is ticked. */
  readonly detail?: ChoiceDetail;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Every answer that applies, among cards in two columns where there is room, or in one as a list. */
export function CheckboxCards({
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
  disabled,
  className,
}: CheckboxCardsProps) {
  const isInvalid = hasContent(error);
  const [chosenValues, setChosenValues] = useControllableValue(value, defaultValue ?? NO_VALUES);
  const choiceDetail = useChoiceDetail({ detail, chosenValues });
  return (
    <BaseField.Root
      name={name}
      disabled={disabled}
      invalid={isInvalid}
      className={classNames('@container flex flex-col gap-space-2', className)}
    >
      <Fieldset.Root
        render={
          <CheckboxGroup
            {...choiceDetail.groupProps}
            value={value && [...value]}
            defaultValue={defaultValue && [...defaultValue]}
            onValueChange={(nextValue: string[]) => {
              setChosenValues(nextValue);
              onValueChange?.(nextValue);
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
                <CheckboxBox
                  value={option.value}
                  aria-controls={choiceDetail.controlsFor(option.value)}
                  onCheckedChange={(isChecked: boolean) => {
                    if (isChecked) {
                      choiceDetail.onChoose(option.value);
                    }
                  }}
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
