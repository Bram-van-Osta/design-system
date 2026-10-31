import type { MessageKey } from '../../i18n/messages.ts';

export const ForgotPasswordStatus = {
  idle: 'idle',
  pending: 'pending',
  /** The app asked for the link: whether an account matches stays unsaid. */
  sent: 'sent',
  tooManyRequests: 'too-many-requests',
  failed: 'failed',
} as const;
export type ForgotPasswordStatus = (typeof ForgotPasswordStatus)[keyof typeof ForgotPasswordStatus];

export const FORGOT_PASSWORD_ALERTS: Readonly<Partial<Record<ForgotPasswordStatus, MessageKey>>> = {
  'too-many-requests': 'sendLink.tooManyRequests',
  failed: 'sendLink.failed',
};
