import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { Icon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { tokenPixels } from '../../utils/token-pixels.ts';

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

export interface MenuProps {
  /** What the button shows, such as an Avatar, which names it. */
  readonly trigger: ReactNode;
  /** The button's name, read by screen readers, when what it shows has none. */
  readonly label?: string;
  readonly items: readonly MenuItem[];
}

// The group lets an Avatar inside the button leave the surface it shows on hover and while open.
const TRIGGER_CLASSES =
  'group/menu-trigger inline-flex min-h-target-min min-w-target-min shrink-0 cursor-pointer items-center justify-center hover:bg-surface data-popup-open:bg-surface';
const ITEM_CLASSES =
  'flex min-h-target-min cursor-pointer items-center gap-space-2 whitespace-nowrap px-space-4 text-body text-ink focus-visible:-outline-offset-2 data-highlighted:bg-surface';

// Detached from the button, so that its line and the button's never touch.
const POPUP_GAP_TOKEN = 'space-1';

function popupGap(): number {
  return tokenPixels(POPUP_GAP_TOKEN);
}

/** A few actions behind one button, such as the account's behind its avatar, with the pointer or the keyboard. */
export function Menu({ trigger, label, items }: MenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger aria-label={label} className={TRIGGER_CLASSES}>
        {trigger}
      </BaseMenu.Trigger>
      <BaseMenu.Portal>
        <BaseMenu.Positioner align="end" sideOffset={popupGap} className="z-10">
          <BaseMenu.Popup className="border-hair border-line bg-bg py-space-1">
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
