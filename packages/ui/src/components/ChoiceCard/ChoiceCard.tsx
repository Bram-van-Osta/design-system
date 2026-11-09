import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { hasContent } from '../../utils/has-content.ts';
import { SourceMark } from '../SourceMark/SourceMark.tsx';
import type { ChoiceCardOption } from './choice-card.ts';
import type { ChoiceSize } from './choice-grid.ts';

// Chosen, the border is 2 px: the hair plus a hair drawn inside it, so that the content keeps its
// place.
const CARD_CLASSES =
  'relative flex w-full cursor-pointer gap-space-3 border-hair border-field bg-bg text-ink has-data-checked:border-delft has-data-checked:before:pointer-events-none has-data-checked:before:absolute has-data-checked:before:inset-0 has-data-checked:before:border-hair has-data-checked:before:border-delft data-disabled:cursor-not-allowed data-disabled:text-ink-muted';

interface ChoiceSizeClasses {
  /** A card with an example under its label. */
  readonly described: string;
  /** A card with its label alone. */
  readonly labelOnly: string;
  readonly description: string;
}

const SIZE_CLASSES: Readonly<Record<ChoiceSize, ChoiceSizeClasses>> = {
  regular: {
    described: 'min-h-button-height items-start p-space-5 text-label',
    labelOnly: 'min-h-button-height items-center px-space-4 py-space-2 text-body',
    description: 'text-body-s text-ink-muted',
  },
  compact: {
    described: 'min-h-12 items-start px-space-4 py-space-3 text-body-s font-semibold',
    labelOnly: 'min-h-12 items-center px-space-4 py-space-2 text-body-s font-semibold',
    description: 'text-small font-normal text-ink-muted',
  },
};

const SET_APART_CLASSES = 'border-dashed border-ink-muted bg-surface has-data-checked:border-solid';

interface ChoiceCardProps {
  readonly option: ChoiceCardOption;
  /** The option's radio button or checkbox. */
  readonly control: ReactNode;
  readonly size: ChoiceSize;
}

/** One answer of a grid of cards: the whole card is the target. */
export function ChoiceCard({ option, control, size }: ChoiceCardProps) {
  const hasDescription = hasContent(option.description);
  const hasSource = hasContent(option.source);
  const isLarge = hasDescription || hasSource;
  const sizeClasses = SIZE_CLASSES[size];
  return (
    <BaseField.Item
      disabled={option.disabled}
      className={classNames('flex', option.isSetApart && 'col-span-full')}
    >
      <BaseField.Label
        className={classNames(
          CARD_CLASSES,
          isLarge ? sizeClasses.described : sizeClasses.labelOnly,
          option.isSetApart && SET_APART_CLASSES,
        )}
      >
        <span className={isLarge ? FIRST_LINE_SLOT_CLASSES : 'flex shrink-0'}>{control}</span>
        {isLarge ? (
          <span className="flex flex-col gap-space-1">
            {option.label}
            {hasDescription && (
              <span className={sizeClasses.description}>{option.description}</span>
            )}
            {hasSource && <SourceMark>{option.source}</SourceMark>}
          </span>
        ) : (
          option.label
        )}
      </BaseField.Label>
    </BaseField.Item>
  );
}
