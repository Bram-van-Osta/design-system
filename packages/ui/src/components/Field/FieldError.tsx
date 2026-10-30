import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ERROR_MESSAGE_CLASSES, ErrorIcon } from './ErrorIcon.tsx';

interface FieldErrorProps {
  readonly children: ReactNode;
}

export function FieldError({ children }: FieldErrorProps) {
  return (
    <BaseField.Error match className={classNames(ERROR_MESSAGE_CLASSES, 'text-body-s')}>
      <ErrorIcon />
      {children}
    </BaseField.Error>
  );
}
