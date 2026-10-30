import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { FieldError } from './FieldError.tsx';
import { FieldMarkerText } from './FieldMarkerText.tsx';
import type { FieldMarker } from './field-marker.ts';

export interface FieldProps {
  readonly label: ReactNode;
  /** The help under the field. */
  readonly description?: ReactNode;
  /** What is wrong, in words: shown under the field, which becomes invalid. */
  readonly error?: ReactNode;
  readonly marker?: FieldMarker;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  /** The control: a TextInput, a PasswordInput or a Select. */
  readonly children: ReactNode;
}

/** A control with its label above, then its error and its help under it, all wired for screen readers. */
export function Field({
  label,
  description,
  error,
  marker,
  name,
  disabled,
  className,
  children,
}: FieldProps) {
  const isInvalid = hasContent(error);
  return (
    <BaseField.Root
      name={name}
      disabled={disabled}
      invalid={isInvalid}
      className={classNames('flex flex-col gap-space-2', className)}
    >
      {/* Not a <label>: the control may be a Select's button, which a native label would press. */}
      <BaseField.Label
        nativeLabel={false}
        render={<div />}
        className="text-label text-ink data-disabled:text-ink-muted"
      >
        {label}
        {marker && <FieldMarkerText marker={marker} />}
      </BaseField.Label>
      {children}
      {isInvalid && <FieldError>{error}</FieldError>}
      {hasContent(description) && (
        <BaseField.Description className="text-body-s text-ink-muted">
          {description}
        </BaseField.Description>
      )}
    </BaseField.Root>
  );
}
