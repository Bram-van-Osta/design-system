import { Progress as BaseProgress } from '@base-ui/react/progress';
import { useLocale } from '../../i18n/use-locale.ts';
import { classNames } from '../../utils/class-names.ts';
import { PROGRESS_BAR_FILL_CLASSES, ProgressBarTone } from './progress-bar-tone.ts';

export { ProgressBarTone } from './progress-bar-tone.ts';

// The value is a share of the whole, read by screen readers as a percentage in their language.
const WHOLE = 1;

export interface ProgressBarProps {
  /** How much is done, from 0 to 1. */
  readonly value: number;
  /** What is being done, for screen readers: "Sending shop-front.jpg". */
  readonly label: string;
  /** `delft` by default, while it is sent; `muted` once paused; `vermilion` once it failed. */
  readonly tone?: ProgressBarTone;
  readonly className?: string;
}

/** A file's upload: a thin bar on the line color, filled as far as it went. */
export function ProgressBar({
  value,
  label,
  tone = ProgressBarTone.delft,
  className,
}: ProgressBarProps) {
  const locale = useLocale();
  return (
    <BaseProgress.Root
      value={value}
      min={0}
      max={WHOLE}
      locale={locale}
      aria-label={label}
      className={classNames('w-full', className)}
    >
      <BaseProgress.Track className="block h-progress-bar-height w-full overflow-hidden bg-line">
        <BaseProgress.Indicator
          className={classNames('block h-full', PROGRESS_BAR_FILL_CLASSES[tone])}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
