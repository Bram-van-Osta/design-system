import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { IconButton } from '../IconButton/IconButton.tsx';
import { TextInput, type TextInputProps } from '../TextInput/TextInput.tsx';

export type PasswordInputProps = Omit<TextInputProps, 'type'>;

/** A password, hidden until its reader shows it. Its `autoComplete` is `current-password` or `new-password`. */
export function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
  const messages = useMessages();
  const [isShown, setIsShown] = useState(false);
  return (
    <div className={classNames('relative', className)}>
      <TextInput
        {...props}
        disabled={disabled}
        type={isShown ? 'text' : 'password'}
        className="pr-space-7"
      />
      <IconButton
        icon={isShown ? EyeSlashIcon : EyeIcon}
        label={isShown ? messages['passwordInput.hide'] : messages['passwordInput.show']}
        disabled={disabled}
        onClick={() => setIsShown((wasShown) => !wasShown)}
        className="absolute top-1/2 right-space-1 -translate-y-1/2"
      />
    </div>
  );
}
