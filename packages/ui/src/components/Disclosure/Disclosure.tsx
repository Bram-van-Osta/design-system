import { Collapsible } from '@base-ui/react/collapsible';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import type { HeadingLevel } from '../Heading/Heading.tsx';
import { DisclosureBoxTrigger } from './DisclosureBoxTrigger.tsx';
import { DisclosurePartTrigger } from './DisclosurePartTrigger.tsx';
import { DisclosureVariant } from './disclosure-variant.ts';

interface DisclosureCommonProps {
  /** What the content holds, always shown: "Contents · 7 parts", or a part's label. */
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

export interface DisclosureBoxProps extends DisclosureCommonProps {
  /** `box` by default: a summary row on the surface. */
  readonly variant?: typeof DisclosureVariant.box;
}

export interface DisclosurePartProps extends DisclosureCommonProps {
  /** A part of a page: its label over an ink rule, and a press on the whole row folds its content. */
  readonly variant: typeof DisclosureVariant.part;
  /** The label's level in the page's outline: the button sits inside an `h2` to `h6`. */
  readonly headingLevel: HeadingLevel;
  /** The heading's id, which the app's section is labelled by. */
  readonly headingId?: string;
}

export type DisclosureProps = DisclosureBoxProps | DisclosurePartProps;

// The part's panel animates its height, but for a system that asks for less motion. Its box reaches
// past the content by the focus ring's 4 px, by a padding its negative margin takes back, so that
// clipping the content as it unfolds never cuts a ring.
const PANEL_CLASSES: Readonly<Record<DisclosureVariant, string>> = {
  box: 'px-space-1 pb-space-3',
  part: '-m-space-1 h-(--collapsible-panel-height) overflow-clip p-space-1 data-ending-style:h-0 data-starting-style:h-0 motion-safe:transition-[height]',
};

/** Content folded under its summary, a long page's contents or a page's part: a press unfolds it. */
export function Disclosure(props: DisclosureProps) {
  const { summary, children, isDefaultOpen = false, isOpen, onOpenChange, className } = props;
  const variant = props.variant ?? DisclosureVariant.box;
  return (
    <Collapsible.Root
      defaultOpen={isDefaultOpen}
      open={isOpen}
      onOpenChange={(nextOpen: boolean) => onOpenChange?.(nextOpen)}
      className={classNames(variant === DisclosureVariant.box && 'bg-surface', className)}
    >
      {props.variant === DisclosureVariant.part ? (
        <DisclosurePartTrigger level={props.headingLevel} id={props.headingId}>
          {summary}
        </DisclosurePartTrigger>
      ) : (
        <DisclosureBoxTrigger>{summary}</DisclosureBoxTrigger>
      )}
      <Collapsible.Panel className={PANEL_CLASSES[variant]}>{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}
