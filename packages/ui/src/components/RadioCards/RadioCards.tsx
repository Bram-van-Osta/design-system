import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { ChoiceCard } from '../ChoiceCard/ChoiceCard.tsx';
import { ChoiceDetailField } from '../ChoiceCard/ChoiceDetailField.tsx';
import type { ChoiceCardOption, ChoiceDetail } from '../ChoiceCard/choice-card.ts';
import { CHOICE_GRID_CLASSES } from '../ChoiceCard/choice-grid.ts';
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
  /** The text field of "Other…", or of any answer that asks for words. */
  readonly detail?: ChoiceDetail;
  readonly name?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
}

/** One answer among cards, in two columns where there is room: the arrow keys move between them. */
export function RadioCards({
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
  required,
  disabled,
  className,
}: RadioCardsProps) {
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
          <BaseRadioGroup
            {...choiceDetail.groupProps}
            value={value}
            defaultValue={defaultValue}
            required={required}
            onValueChange={(nextValue: unknown) => {
              if (typeof nextValue === 'string') {
                onValueChange?.(nextValue);
                choiceDetail.onChoose(nextValue);
              }
            }}
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
                <RadioButton
                  value={option.value}
                  aria-controls={choiceDetail.controlsFor(option.value)}
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
