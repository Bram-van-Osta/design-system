import { interpolate } from '../../i18n/interpolate.ts';
import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';
import { stepPositionOf, stepStateAt } from './step-band.ts';
import { stepBarClassesOf } from './step-bar-classes.ts';

export interface StepBandCompactProps {
  /** How many steps the journey has: one short bar each. */
  readonly count: number;
  /** The current step's index, from 0; the steps before it are done, every one past the last. */
  readonly currentIndex: number;
  /** What a screen reader hears in place of the bars; "step 2 of 6" by default. */
  readonly label?: string;
  readonly className?: string;
}

/**
 * A step band's compact form, in a list's row: its short bars without their names, a done step's in
 * Delft and the current one's in pale Delft, read as the current step's position.
 */
export function StepBandCompact({ count, currentIndex, label, className }: StepBandCompactProps) {
  const messages = useMessages();
  const name =
    label ??
    interpolate(messages['stepBand.position'], {
      position: stepPositionOf(currentIndex, count),
      count,
    });
  return (
    <span
      role="img"
      aria-label={name}
      className={classNames('inline-flex gap-0.5 align-middle', className)}
    >
      {Array.from({ length: count }, (_, index) => index).map((step) => {
        const state = stepStateAt(step, currentIndex);
        return (
          <span
            key={step}
            data-state={state}
            className={classNames('w-3', stepBarClassesOf(state))}
          />
        );
      })}
    </span>
  );
}
