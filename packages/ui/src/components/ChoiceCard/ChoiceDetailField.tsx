import { Field as BaseField } from '@base-ui/react/field';
import type { KeyboardEvent, RefObject } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { FieldError } from '../Field/FieldError.tsx';
import { TextInput } from '../TextInput/TextInput.tsx';
import { type ChoiceDetail, ChoiceDetailPlacement } from './choice-card.ts';

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
  readonly inputId: string;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly disabled: boolean | undefined;
}

export function ChoiceDetailField({ detail, inputId, inputRef, disabled }: ChoiceDetailFieldProps) {
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
        ref={inputRef}
        id={inputId}
        value={detail.value}
        defaultValue={detail.defaultValue}
        onValueChange={(nextValue: string) => detail.onValueChange?.(nextValue)}
        maxLength={detail.maxLength}
        onKeyDown={keepArrowKeysInText}
      />
      {isInvalid && <FieldError>{detail.error}</FieldError>}
    </BaseField.Root>
  );
}
