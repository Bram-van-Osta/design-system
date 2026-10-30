import type { ReactNode } from 'react';
import { ERROR_MESSAGE_CLASSES, ErrorIcon } from '../../components/Field/ErrorIcon.tsx';
import { classNames } from '../../utils/class-names.ts';

interface FormAlertProps {
  readonly children: ReactNode;
}

/** What went wrong with the whole form, announced as soon as it appears. */
export function FormAlert({ children }: FormAlertProps) {
  return (
    <p role="alert" className={classNames(ERROR_MESSAGE_CLASSES, 'text-body')}>
      <ErrorIcon />
      {children}
    </p>
  );
}
