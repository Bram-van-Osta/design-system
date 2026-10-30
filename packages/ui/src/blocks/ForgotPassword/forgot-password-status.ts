export const ForgotPasswordStatus = {
  idle: 'idle',
  pending: 'pending',
  /** The app asked for the link: whether an account matches stays unsaid. */
  sent: 'sent',
} as const;
export type ForgotPasswordStatus = (typeof ForgotPasswordStatus)[keyof typeof ForgotPasswordStatus];
