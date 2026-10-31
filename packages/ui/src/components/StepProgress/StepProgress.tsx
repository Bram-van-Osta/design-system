import { classNames } from '../../utils/class-names.ts';

export interface StepProgressProps {
  /** How many steps the journey has: one segment each. */
  readonly max: number;
  /** How many are done. */
  readonly value: number;
  /** What the bar follows, for screen readers: "Your request's progress". */
  readonly label: string;
  /** Where the person stands, in words: "Question 2 of 8". */
  readonly valueText: string;
  readonly className?: string;
}

/** The progress of a journey in segments, the done ones in Delft blue, across the page under its header. */
export function StepProgress({ max, value, label, valueText, className }: StepProgressProps) {
  const doneCount = Math.min(Math.max(value, 0), max);
  const steps = Array.from({ length: max }, (_, index) => index + 1);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={doneCount}
      aria-valuetext={valueText}
      className={classNames('flex w-full gap-space-1', className)}
    >
      {steps.map((step) => (
        <span
          key={step}
          data-done={step <= doneCount || undefined}
          className="h-progress-height flex-1 bg-line data-done:bg-delft"
        />
      ))}
    </div>
  );
}
