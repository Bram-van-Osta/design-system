import type { MessageKey } from '../../i18n/messages.ts';

export const SignInStatus = {
  idle: 'idle',
  pending: 'pending',
  invalidCredentials: 'invalid-credentials',
  locked: 'locked',
  noAccount: 'no-account',
} as const;
export type SignInStatus = (typeof SignInStatus)[keyof typeof SignInStatus];

export const SIGN_IN_ALERTS: Readonly<Partial<Record<SignInStatus, MessageKey>>> = {
  'invalid-credentials': 'signIn.invalidCredentials',
  locked: 'signIn.locked',
  'no-account': 'signIn.noAccount',
};
