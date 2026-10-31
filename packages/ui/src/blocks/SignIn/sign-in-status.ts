import type { MessageKey } from '../../i18n/messages.ts';

export const SignInStatus = {
  idle: 'idle',
  pending: 'pending',
  invalidCredentials: 'invalid-credentials',
  locked: 'locked',
  noAccount: 'no-account',
  /** The app could not sign in, for a reason the reader cannot act on. */
  failed: 'failed',
  /** A mailed link sent the browser back refused. */
  linkRefused: 'link-refused',
} as const;
export type SignInStatus = (typeof SignInStatus)[keyof typeof SignInStatus];

export const SIGN_IN_ALERTS: Readonly<Partial<Record<SignInStatus, MessageKey>>> = {
  'invalid-credentials': 'signIn.invalidCredentials',
  locked: 'signIn.locked',
  'no-account': 'signIn.noAccount',
  failed: 'signIn.failed',
  'link-refused': 'signIn.linkRefused',
};
