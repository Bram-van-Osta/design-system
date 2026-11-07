import { Collapsible } from '@base-ui/react/collapsible';
import { CaretDownIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import {
  CHEVRON_SLOT_CLASSES,
  CONTENT_CLASSES,
  ITEM_CLASSES,
  LINE_CLASSES,
  TEXT_CLASSES,
  TIME_CLASSES,
} from './thread-classes.ts';

export interface ThreadLineProps {
  /** When, in mono in its column: "9:14". */
  readonly time: ReactNode;
  /** The event on one line: who did what, and its gist. */
  readonly children: ReactNode;
  /**
   * What the line unfolds under its text: the agent's words, the figures, a link to the document.
   * Without it, the line stays still, without its chevron.
   */
  readonly content?: ReactNode;
  /** Unfolded at first, and the reader folds it. */
  readonly isDefaultOpen?: boolean;
  /** The unfolded state, when the app keeps it. */
  readonly isOpen?: boolean;
  readonly onOpenChange?: (isOpen: boolean) => void;
}

/**
 * An event of a thread on one line, its time, its text and a chevron: a button that unfolds its
 * content in place, indented under its text; without content, a still line.
 */
export function ThreadLine({
  time,
  children,
  content,
  isDefaultOpen = false,
  isOpen,
  onOpenChange,
}: ThreadLineProps) {
  if (!hasContent(content)) {
    return (
      <li className={ITEM_CLASSES}>
        <div className={LINE_CLASSES}>
          <LineParts time={time}>{children}</LineParts>
          <span aria-hidden className={CHEVRON_SLOT_CLASSES} />
        </div>
      </li>
    );
  }
  return (
    <li className={ITEM_CLASSES}>
      <Collapsible.Root
        defaultOpen={isDefaultOpen}
        open={isOpen}
        onOpenChange={(nextOpen: boolean) => onOpenChange?.(nextOpen)}
      >
        <Collapsible.Trigger
          className={classNames(LINE_CLASSES, 'group cursor-pointer data-panel-open:pb-space-2')}
        >
          <LineParts time={time}>{children}</LineParts>
          <span className={CHEVRON_SLOT_CLASSES}>
            <CaretDownIcon
              size={ICON_SIZE.inline}
              weight={ICON_WEIGHT}
              aria-hidden
              className="group-data-panel-open:rotate-180"
            />
          </span>
        </Collapsible.Trigger>
        <Collapsible.Panel className={CONTENT_CLASSES}>{content}</Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}

interface LinePartsProps {
  readonly time: ReactNode;
  readonly children: ReactNode;
}

// The spaces between the parts, which the layout drops, part their words in a button's name.
function LineParts({ time, children }: LinePartsProps) {
  return (
    <>
      <span className={TIME_CLASSES}>{time}</span> <span className={TEXT_CLASSES}>{children}</span>
    </>
  );
}
