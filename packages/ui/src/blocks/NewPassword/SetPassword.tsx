import { NewPasswordBlock, type NewPasswordProps } from './NewPasswordBlock.tsx';
import type { NewPasswordTexts } from './new-password.ts';

const TEXTS: NewPasswordTexts = {
  kicker: 'setPassword.kicker',
  heading: 'setPassword.heading',
  lead: 'setPassword.lead',
  label: 'setPassword.label',
  submit: 'setPassword.submit',
};

export type SetPasswordProps = NewPasswordProps;

/** The first password, from the link of an invitation. */
export function SetPassword(props: SetPasswordProps) {
  return <NewPasswordBlock {...props} texts={TEXTS} />;
}
