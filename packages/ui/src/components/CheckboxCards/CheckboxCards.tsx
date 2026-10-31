import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { CheckboxBox } from '../Checkbox/CheckboxBox.tsx';
import { ChoiceCard } from '../ChoiceCard/ChoiceCard.tsx';
import { ChoiceDetailField } from '../ChoiceCard/ChoiceDetailField.tsx';
import type { ChoiceCardOption, ChoiceDetail } from '../ChoiceCard/choice-card.ts';
import { CHOICE_GRID_CLASSES } from '../ChoiceCard/choice-grid.ts';
import { useChoiceDetail } from '../ChoiceCard/use-choice-detail.ts';
import { ChoiceLegend } from '../Field/ChoiceLegend.tsx';
import { FieldError } from '../Field/FieldError.tsx';
import type { FieldMarker } from '../Field/field-marker.ts';

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
  /** The text field of "Other…", across the grid under the cards. */
  readonly detail?: ChoiceDetail;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** Every answer that applies, among cards in two columns where there is room. */
export function CheckboxCards({
  legend,
  options,
  value,
  defaultValue,
  onValueChange,
  description,
  error,
  marker,
  detail,
  name,
  disabled,
  className,
}: CheckboxCardsProps) {
  const isInvalid = hasContent(error);
  const choiceDetail = useChoiceDetail(detail);
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
            onValueChange={(nextValue: string[]) => onValueChange?.(nextValue)}
          />
        }
        className="flex flex-col gap-space-1"
      >
        <ChoiceLegend legend={legend} marker={marker} description={description} />
        <div className={CHOICE_GRID_CLASSES}>
          {options.map((option) => (
            <ChoiceCard
              key={option.value}
              option={option}
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
          {detail && (
            <ChoiceDetailField
              detail={detail}
              inputId={choiceDetail.inputId}
              inputRef={choiceDetail.inputRef}
              disabled={disabled}
            />
          )}
        </div>
      </Fieldset.Root>
      {isInvalid && <FieldError>{error}</FieldError>}
    </BaseField.Root>
  );
}
