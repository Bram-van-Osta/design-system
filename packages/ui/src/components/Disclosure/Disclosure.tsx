import { Collapsible } from '@base-ui/react/collapsible';
import { CaretDownIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

export interface DisclosureProps {
  /** What the content holds, always shown: "Contents · 7 parts". */
  readonly summary: ReactNode;
  /** The folded content. */
  readonly children: ReactNode;
  /** Unfolded at first, and the reader folds it. */
  readonly isDefaultOpen?: boolean;
  /** The unfolded state, when the app keeps it: to fold it once a link is followed, say. */
  readonly isOpen?: boolean;
  readonly onOpenChange?: (isOpen: boolean) => void;
  readonly className?: string;
}

/** Content folded under its summary, such as a long page's contents on a phone: a press unfolds it. */
export function Disclosure({
  summary,
  children,
  isDefaultOpen = false,
  isOpen,
  onOpenChange,
  className,
}: DisclosureProps) {
  return (
    <Collapsible.Root
      defaultOpen={isDefaultOpen}
      open={isOpen}
      onOpenChange={(nextOpen: boolean) => onOpenChange?.(nextOpen)}
      className={classNames('bg-surface', className)}
    >
      <Collapsible.Trigger className="group flex min-h-button-height w-full cursor-pointer items-center justify-between gap-space-3 px-space-4 text-left text-body font-semibold text-ink">
        {summary}
        <CaretDownIcon
          size={ICON_SIZE.inline}
          weight={ICON_WEIGHT}
          aria-hidden
          className="shrink-0 group-data-panel-open:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Panel className="px-space-1 pb-space-3">{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}
