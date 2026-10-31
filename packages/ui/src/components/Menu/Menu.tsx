import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';

export interface MenuItem {
  /** Unique among the menu's items. */
  readonly id: string;
  readonly label: ReactNode;
  readonly onSelect: () => void;
  /** A Phosphor icon before the label. */
  readonly icon?: Icon;
  /** The label's language, when it is not the page's: a language named in its own words. */
  readonly lang?: string;
}

export const MenuTriggerVariant = {
  /** The button's content alone, such as an avatar or an icon. */
  quiet: 'quiet',
  /** An outlined button, such as the account's with its avatar and its name. */
  outlined: 'outlined',
} as const;
export type MenuTriggerVariant = (typeof MenuTriggerVariant)[keyof typeof MenuTriggerVariant];

export interface MenuProps {
  /** What the button shows, such as an Avatar, which names it. */
  readonly trigger: ReactNode;
  readonly triggerVariant?: MenuTriggerVariant;
  /** The button's name, read by screen readers, when what it shows has none. */
  readonly label?: string;
  readonly items: readonly MenuItem[];
}

const TRIGGER_CLASSES: Readonly<Record<MenuTriggerVariant, string>> = {
  quiet:
    'inline-flex size-target-min shrink-0 cursor-pointer items-center justify-center hover:bg-surface data-popup-open:bg-surface',
  outlined:
    'inline-flex min-h-target-min min-w-target-min shrink-0 cursor-pointer items-center justify-center gap-space-2 border-hair border-line bg-bg px-space-2 text-body-s font-medium text-ink hover:border-ink data-popup-open:border-ink',
};
const ITEM_CLASSES =
  'flex min-h-target-min cursor-pointer items-center gap-space-2 whitespace-nowrap px-space-4 text-body text-ink focus-visible:-outline-offset-2 data-highlighted:bg-surface';

/** A few actions behind one button, such as the account's behind its avatar, with the pointer or the keyboard. */
export function Menu({
  trigger,
  triggerVariant = MenuTriggerVariant.quiet,
  label,
  items,
}: MenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger aria-label={label} className={TRIGGER_CLASSES[triggerVariant]}>
        {trigger}
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner align="end" className="z-10">
          <BaseMenu.Popup className="border-hair border-ink bg-bg py-space-1">
            {items.map(({ id, label: itemLabel, onSelect, icon: ItemIcon, lang }) => (
              <BaseMenu.Item key={id} lang={lang} onClick={onSelect} className={ITEM_CLASSES}>
                {ItemIcon && <ItemIcon size={ICON_SIZE.inline} weight={ICON_WEIGHT} aria-hidden />}
                {itemLabel}
              </BaseMenu.Item>
            ))}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
