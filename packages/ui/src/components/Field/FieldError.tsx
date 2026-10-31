import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ERROR_MESSAGE_CLASSES, ErrorIcon } from './ErrorIcon.tsx';

interface FieldErrorProps {
  /** For a control that Base UI does not wire to its field: it reads the error by this id. */
  readonly id?: string;
  readonly children: ReactNode;
}

export function FieldError({ id, children }: FieldErrorProps) {
  return (
    <BaseField.Error id={id} match className={classNames(ERROR_MESSAGE_CLASSES, 'text-body-s')}>
      <ErrorIcon />
      {children}
    </BaseField.Error>
  );
}
