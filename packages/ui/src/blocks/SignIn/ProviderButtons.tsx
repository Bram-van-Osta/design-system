import type { Icon } from '@phosphor-icons/react';
import { Button, ButtonVariant } from '../../components/Button/Button.tsx';

export interface SignInProvider {
  /** Its identifier, for the app. */
  readonly id: string;
  /** Its button's label, from the app's texts: "Continue with Google". */
  readonly label: string;
  /** A Phosphor icon before the label. */
  readonly icon?: Icon;
  readonly onSelect: () => void;
  /** The app is leaving for the provider. */
  readonly isPending?: boolean;
}

interface ProviderButtonsProps {
  readonly providers: readonly SignInProvider[];
  readonly isDisabled: boolean;
  /** Without a password, the first provider is what the page expects: the primary button. */
  readonly isFirstPrimary: boolean;
}

export function ProviderButtons({ providers, isDisabled, isFirstPrimary }: ProviderButtonsProps) {
  return (
    <ul className="flex flex-col gap-space-3">
      {providers.map((provider, index) => (
        <li key={provider.id}>
          <ProviderButton
            provider={provider}
            isDisabled={isDisabled}
            isPrimary={isFirstPrimary && index === 0}
          />
        </li>
      ))}
    </ul>
  );
}

interface ProviderButtonProps {
  readonly provider: SignInProvider;
  readonly isDisabled: boolean;
  readonly isPrimary: boolean;
}

function ProviderButton({ provider, isDisabled, isPrimary }: ProviderButtonProps) {
  return (
    <Button
      variant={isPrimary ? ButtonVariant.primary : ButtonVariant.secondary}
      hasArrow={isPrimary}
      icon={isPrimary ? undefined : provider.icon}
      isPending={provider.isPending}
      disabled={isDisabled}
      onClick={provider.onSelect}
      className="w-full"
    >
      {provider.label}
    </Button>
  );
}
