import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { hasContent } from '../../utils/has-content.ts';
import type { ChoiceCardOption } from './choice-card.ts';

// Chosen, the border is 2 px: the hair plus a hair drawn inside it, so that the content keeps its
// place.
const CARD_CLASSES =
  'relative flex w-full min-h-button-height cursor-pointer gap-space-3 border-hair border-field bg-bg text-ink has-data-checked:border-delft has-data-checked:before:pointer-events-none has-data-checked:before:absolute has-data-checked:before:inset-0 has-data-checked:before:border-hair has-data-checked:before:border-delft data-disabled:cursor-not-allowed data-disabled:text-ink-muted';

const LARGE_CLASSES = 'items-start p-space-5 text-label';
const COMPACT_CLASSES = 'items-center px-space-4 py-space-2 text-body';
const SET_APART_CLASSES = 'border-dashed border-ink-muted bg-surface has-data-checked:border-solid';

interface ChoiceCardProps {
  readonly option: ChoiceCardOption;
  /** The option's radio button or checkbox. */
  readonly control: ReactNode;
}

/** One answer of a grid of cards: the whole card is the target. */
export function ChoiceCard({ option, control }: ChoiceCardProps) {
  const hasDescription = hasContent(option.description);
  return (
    <BaseField.Item
      disabled={option.disabled}
      className={classNames('flex', option.isSetApart && 'col-span-full')}
    >
      <BaseField.Label
        className={classNames(
          CARD_CLASSES,
          hasDescription ? LARGE_CLASSES : COMPACT_CLASSES,
          option.isSetApart && SET_APART_CLASSES,
        )}
      >
        <span className={hasDescription ? FIRST_LINE_SLOT_CLASSES : 'flex shrink-0'}>
          {control}
        </span>
        {hasDescription ? (
          <span className="flex flex-col gap-space-1">
            {option.label}
            <span className="text-body-s text-ink-muted">{option.description}</span>
          </span>
        ) : (
          option.label
        )}
      </BaseField.Label>
    </BaseField.Item>
  );
}
