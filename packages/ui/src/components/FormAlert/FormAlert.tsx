import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ERROR_MESSAGE_CLASSES, ErrorIcon } from '../Field/ErrorIcon.tsx';

export interface FormAlertProps {
  readonly children: ReactNode;
}

/** What went wrong with the whole form, in a box under a vermillion rule, announced as soon as it appears. */
export function FormAlert({ children }: FormAlertProps) {
  return (
    <p
      role="alert"
      className={classNames(
        ERROR_MESSAGE_CLASSES,
        'border-t-attention border-vermillion bg-surface p-space-4 text-body',
      )}
    >
      <ErrorIcon />
      {children}
    </p>
  );
}
