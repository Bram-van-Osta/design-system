import { Collapsible } from '@base-ui/react/collapsible';
import { CaretDownIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

export interface DisclosureBoxTriggerProps {
  readonly children: ReactNode;
}

export function DisclosureBoxTrigger({ children }: DisclosureBoxTriggerProps) {
  return (
    <Collapsible.Trigger className="group flex min-h-button-height w-full cursor-pointer items-center justify-between gap-space-3 px-space-4 text-left text-body font-semibold text-ink">
      {children}
      <CaretDownIcon
        size={ICON_SIZE.inline}
        weight={ICON_WEIGHT}
        aria-hidden
        className="shrink-0 group-data-panel-open:rotate-180"
      />
    </Collapsible.Trigger>
  );
}
