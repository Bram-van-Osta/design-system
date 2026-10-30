import { Field as BaseField } from '@base-ui/react/field';
import { WarningCircleIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

interface FieldErrorProps {
  readonly children: ReactNode;
}

// An error is written in words, in ink, under the field: never in blue, which acts.
export function FieldError({ children }: FieldErrorProps) {
  return (
    <BaseField.Error
      match
      className="flex items-start gap-space-2 text-body-s font-semibold text-ink"
    >
      <WarningCircleIcon
        size={ICON_SIZE.inline}
        weight={ICON_WEIGHT}
        className="mt-0.5 shrink-0"
        aria-hidden
      />
      {children}
    </BaseField.Error>
  );
}
