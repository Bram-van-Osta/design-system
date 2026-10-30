import { CheckCircleIcon, CircleIcon } from '@phosphor-icons/react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import type { CheckedPasswordRule } from './new-password.ts';

interface PasswordRulesProps {
  readonly rules: readonly CheckedPasswordRule[];
}

/** The rules of the password, each one ticked in Delft blue once the password follows it. */
export function PasswordRules({ rules }: PasswordRulesProps) {
  const messages = useMessages();
  return (
    <ul aria-label={messages['newPassword.rules']} className="flex flex-col gap-space-1">
      {rules.map((rule) => (
        <li
          key={rule.label}
          className={classNames(
            'flex items-start gap-space-2',
            rule.isMet ? 'text-ink' : 'text-ink-muted',
          )}
        >
          <RuleIcon isMet={rule.isMet} />
          {rule.label}
          <span className="sr-only">
            {' '}
            {rule.isMet ? messages['newPassword.ruleMet'] : messages['newPassword.ruleUnmet']}
          </span>
        </li>
      ))}
    </ul>
  );
}

interface RuleIconProps {
  readonly isMet: boolean;
}

function RuleIcon({ isMet }: RuleIconProps) {
  const Icon = isMet ? CheckCircleIcon : CircleIcon;
  return (
    <Icon
      size={ICON_SIZE.inline}
      weight={ICON_WEIGHT}
      className={classNames('mt-0.5 shrink-0', isMet && 'text-delft')}
      aria-hidden
    />
  );
}
