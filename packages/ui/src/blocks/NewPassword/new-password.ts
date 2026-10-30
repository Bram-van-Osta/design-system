import type { MessageKey } from '../../i18n/messages.ts';

export const NewPasswordStatus = {
  idle: 'idle',
  pending: 'pending',
  /** The link that led here was already used, or expired. */
  invalidLink: 'invalid-link',
} as const;
export type NewPasswordStatus = (typeof NewPasswordStatus)[keyof typeof NewPasswordStatus];

/** A rule of the app's password policy, beyond its minimum length. */
export interface PasswordRule {
  /** Its sentence, from the app's texts. */
  readonly label: string;
  readonly isMet: (password: string) => boolean;
}

export interface CheckedPasswordRule {
  readonly label: string;
  readonly isMet: boolean;
}

export interface NewPasswordValues {
  readonly password: string;
}

/** The texts that tell a first password from a new one. */
export interface NewPasswordTexts {
  readonly heading: MessageKey;
  readonly lead: MessageKey;
  readonly label: MessageKey;
  readonly submit: MessageKey;
}
