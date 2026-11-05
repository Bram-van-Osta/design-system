import { Collapsible } from '@base-ui/react/collapsible';
import { CaretDownIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { ICON_SIZE, ICON_WEIGHT } from '../../utils/icon.ts';
import { HEADING_TAGS, type HeadingLevel } from '../Heading/Heading.tsx';
import { DisclosurePartPreview } from './DisclosurePartPreview.tsx';

export interface DisclosurePartTriggerProps {
  readonly level: HeadingLevel;
  readonly id?: string;
  readonly preview?: ReactNode;
  readonly previewMark?: ReactNode;
  readonly children: ReactNode;
}

// The heading stays in the outline, its button inside it. It is positioned so that it stays above
// the panel, whose box reaches up into the row by the focus ring's 4 px.
export function DisclosurePartTrigger({
  level,
  id,
  preview,
  previewMark,
  children,
}: DisclosurePartTriggerProps) {
  const HeadingTag = HEADING_TAGS[level];
  return (
    <HeadingTag id={id} className="relative border-t-select border-ink">
      <Collapsible.Trigger className="group flex min-h-target-min w-full cursor-pointer flex-col gap-space-1 pt-space-3 text-left text-small font-semibold uppercase tracking-widest text-ink-muted hover:text-ink">
        <span className="flex w-full items-start justify-between gap-space-3">
          <span className="min-w-0">{children}</span>
          <span className={FIRST_LINE_SLOT_CLASSES}>
            <CaretDownIcon
              size={ICON_SIZE.inline}
              weight={ICON_WEIGHT}
              aria-hidden
              className="group-data-panel-open:rotate-180 motion-safe:transition-transform"
            />
          </span>
        </span>
        {preview !== undefined && (
          <DisclosurePartPreview mark={previewMark}>{preview}</DisclosurePartPreview>
        )}
      </Collapsible.Trigger>
    </HeadingTag>
  );
}
