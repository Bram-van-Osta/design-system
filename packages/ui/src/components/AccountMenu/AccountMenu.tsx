import { Avatar } from '../Avatar/Avatar.tsx';
import { Menu, type MenuItem } from '../Menu/Menu.tsx';

export interface AccountMenuProps {
  /** The account's name: the button shows it beside the avatar, and is named by it. */
  readonly name: string;
  readonly items: readonly MenuItem[];
}

/**
 * The account's actions, behind a button with its avatar and its name, on the surface on hover and
 * while open; on a phone, the avatar alone, so the header keeps its room.
 */
export function AccountMenu({ name, items }: AccountMenuProps) {
  return (
    <Menu
      items={items}
      trigger={
        <span className="flex items-center gap-space-2 px-space-2 text-body-s font-medium text-ink">
          {/* The button is named by the name beside it, which the avatar would repeat. */}
          <span aria-hidden className="flex">
            <Avatar name={name} />
          </span>
          {/* Hidden on a phone but still read, it names the button there too. */}
          <span className="sr-only md:not-sr-only">
            <span className="block max-w-account-name-width truncate pr-space-1">{name}</span>
          </span>
        </span>
      }
    />
  );
}
