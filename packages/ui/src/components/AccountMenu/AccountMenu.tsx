import { Avatar } from '../Avatar/Avatar.tsx';
import { Menu, type MenuItem, MenuTriggerVariant } from '../Menu/Menu.tsx';

export interface AccountMenuProps {
  /** The account's name: the button shows it beside the avatar, and is named by it. */
  readonly name: string;
  readonly items: readonly MenuItem[];
}

/**
 * The account's actions, behind an outlined button with its avatar and its name; on a phone, the
 * avatar alone, so the header keeps its room.
 */
export function AccountMenu({ name, items }: AccountMenuProps) {
  return (
    <Menu
      triggerVariant={MenuTriggerVariant.outlined}
      items={items}
      trigger={
        <>
          {/* The button is named by the name beside it, which the avatar would repeat. */}
          <span aria-hidden className="flex">
            <Avatar name={name} />
          </span>
          {/* Hidden on a phone but still read, it names the button there too. */}
          <span className="sr-only md:not-sr-only">
            <span className="block max-w-account-name-width truncate pr-space-1">{name}</span>
          </span>
        </>
      }
    />
  );
}
