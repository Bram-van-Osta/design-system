import type { ReactNode } from 'react';
import { Logo } from '../../components/Logo/Logo.tsx';
import { Text, TextTone, TextVariant } from '../../components/Text/Text.tsx';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';

// The lockup's text as the round 7 screens size it: 17 px on a phone, 20 px on a computer.
const LOGO_SIZE_ON_PHONE = 17;
const LOGO_SIZE_ON_COMPUTER = 20;

export interface BrandBarProps {
  /** Beside the logo: the app's role, such as "operator". */
  readonly role?: ReactNode;
  /** At the end of the bar: the language switch. */
  readonly end?: ReactNode;
  readonly className?: string;
}

/** The row at the top of a page outside an app's frame: the logo, the app's role, the language. */
export function BrandBar({ role, end, className }: BrandBarProps) {
  return (
    <div
      className={classNames(
        'flex min-h-target-min items-center justify-between gap-space-4',
        className,
      )}
    >
      <div className="flex items-center gap-space-3">
        <span className="flex md:hidden">
          <Logo size={LOGO_SIZE_ON_PHONE} />
        </span>
        <span className="hidden md:flex">
          <Logo size={LOGO_SIZE_ON_COMPUTER} />
        </span>
        {hasContent(role) && (
          <Text variant={TextVariant.meta} tone={TextTone.muted} render={<span />}>
            {role}
          </Text>
        )}
      </div>
      {end}
    </div>
  );
}
