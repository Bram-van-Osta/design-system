export const ResendStatus = {
  idle: 'idle',
  pending: 'pending',
  sent: 'sent',
} as const;
export type ResendStatus = (typeof ResendStatus)[keyof typeof ResendStatus];
