import type { MessageKey } from '../../i18n/messages.ts';

export const ResendStatus = {
  idle: 'idle',
  pending: 'pending',
  sent: 'sent',
  tooManyRequests: 'too-many-requests',
  failed: 'failed',
} as const;
export type ResendStatus = (typeof ResendStatus)[keyof typeof ResendStatus];

export const RESEND_ALERTS: Readonly<Partial<Record<ResendStatus, MessageKey>>> = {
  'too-many-requests': 'sendLink.tooManyRequests',
  failed: 'sendLink.failed',
};
