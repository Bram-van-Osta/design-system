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
}

export function ProviderButtons({ providers, isDisabled }: ProviderButtonsProps) {
  return (
    <ul className="flex flex-col gap-space-3">
      {providers.map((provider) => (
        <li key={provider.id}>
          <Button
            variant={ButtonVariant.secondary}
            icon={provider.icon}
            isPending={provider.isPending}
            disabled={isDisabled}
            onClick={provider.onSelect}
            className="w-full"
          >
            {provider.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}
