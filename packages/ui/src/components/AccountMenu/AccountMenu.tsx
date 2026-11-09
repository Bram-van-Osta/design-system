import { Avatar } from '../Avatar/Avatar.tsx';
import { Menu, type MenuItem } from '../Menu/Menu.tsx';

export interface AccountMenuProps {
  /** The account's name: the button shows it beside the avatar, and is named by it. */
  readonly name: string;
  readonly items: readonly MenuItem[];
  /**
   * A navigation column's row: the button its column's width, the avatar at its left and the name
   * shown at every width.
   */
  readonly isFullWidth?: boolean;
}

/**
 * The account's actions, behind a button with its avatar and its name, on the surface on hover and
 * while open; on a phone, the avatar alone, so the header keeps its room, unless the button is a
 * navigation's full-width row.
 */
export function AccountMenu({ name, items, isFullWidth = false }: AccountMenuProps) {
  return (
    <Menu
      items={items}
      isFullWidth={isFullWidth}
      trigger={
        <span
          className={`flex min-w-0 items-center gap-space-2 text-body-s font-medium text-ink ${isFullWidth ? 'px-3' : 'px-space-2'}`}
        >
          {/* The button is named by the name beside it, which the avatar would repeat. */}
          <span aria-hidden className="flex">
            <Avatar name={name} />
          </span>
          {/* Hidden on a phone but still read, it names the button there too. */}
          <span className={isFullWidth ? 'min-w-0' : 'sr-only md:not-sr-only'}>
            <span className="block max-w-account-name-width truncate pr-space-1">{name}</span>
          </span>
        </span>
      }
    />
  );
}
