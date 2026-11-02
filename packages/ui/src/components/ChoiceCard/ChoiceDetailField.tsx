import { Field as BaseField } from '@base-ui/react/field';
import type { KeyboardEvent } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { FieldError } from '../Field/FieldError.tsx';
import { TextInput } from '../TextInput/TextInput.tsx';
import { type ChoiceDetail, ChoiceDetailPlacement } from './choice-card.ts';
import type { ChoiceDetailInput } from './use-choice-detail.ts';

const PLACEMENT_CLASSES: Readonly<Record<ChoiceDetailPlacement, string>> = {
  beside: '',
  below: 'col-span-full',
};

// Inside a radio group, the arrow keys would leave the text for the radios at its first or its
// last character.
function keepArrowKeysInText(event: KeyboardEvent) {
  if (event.key.startsWith('Arrow')) {
    event.stopPropagation();
  }
}

interface ChoiceDetailFieldProps {
  readonly detail: ChoiceDetail;
  readonly input: ChoiceDetailInput;
  readonly disabled: boolean | undefined;
}

export function ChoiceDetailField({ detail, input, disabled }: ChoiceDetailFieldProps) {
  const isInvalid = hasContent(detail.error);
  const placement = detail.placement ?? ChoiceDetailPlacement.below;
  return (
    <BaseField.Root
      name={detail.name}
      disabled={disabled}
      invalid={isInvalid}
      className={classNames('flex min-w-0 flex-col gap-space-2', PLACEMENT_CLASSES[placement])}
    >
      <BaseField.Label className={detail.isLabelVisible ? 'text-body-s text-ink-muted' : 'sr-only'}>
        {detail.label}
      </BaseField.Label>
      <TextInput
        ref={input.inputRef}
        id={input.inputId}
        value={input.text}
        onValueChange={input.onTextChange}
        placeholder={detail.placeholder}
        maxLength={detail.maxLength}
        onKeyDown={keepArrowKeysInText}
      />
      {isInvalid && <FieldError>{detail.error}</FieldError>}
    </BaseField.Root>
  );
}
