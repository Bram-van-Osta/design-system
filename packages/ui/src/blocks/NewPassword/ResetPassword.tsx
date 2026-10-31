import { NewPasswordBlock, type NewPasswordProps } from './NewPasswordBlock.tsx';
import type { NewPasswordTexts } from './new-password.ts';

const TEXTS: NewPasswordTexts = {
  kicker: 'resetPassword.kicker',
  heading: 'resetPassword.heading',
  lead: 'resetPassword.lead',
  label: 'resetPassword.label',
  submit: 'resetPassword.submit',
};

export type ResetPasswordProps = NewPasswordProps;

/** A new password, from the link of a forgotten one. */
export function ResetPassword(props: ResetPasswordProps) {
  return <NewPasswordBlock {...props} texts={TEXTS} />;
}
