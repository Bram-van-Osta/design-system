import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';

export const SkeletonShape = {
  text: 'text',
  heading: 'heading',
  field: 'field',
} as const;
export type SkeletonShape = (typeof SkeletonShape)[keyof typeof SkeletonShape];

const DEFAULT_LINES = 3;

const BAR_CLASSES = 'block bg-line motion-safe:animate-pulse';

export interface SkeletonProps {
  /** The shape of what is loading: lines of text, a heading or a field. */
  readonly shape?: SkeletonShape;
  /** The number of lines of a `text` skeleton. */
  readonly lines?: number;
  readonly className?: string;
}

/** The place of what is loading, read as "Loading…" by screen readers. */
export function Skeleton({
  shape = SkeletonShape.text,
  lines = DEFAULT_LINES,
  className,
}: SkeletonProps) {
  const messages = useMessages();
  return (
    <div role="status" className={classNames('flex flex-col gap-space-3', className)}>
      <span className="sr-only">{messages['skeleton.loading']}</span>
      <SkeletonBars shape={shape} lines={lines} />
    </div>
  );
}

interface SkeletonBarsProps {
  readonly shape: SkeletonShape;
  readonly lines: number;
}

function SkeletonBars({ shape, lines }: SkeletonBarsProps) {
  if (shape === SkeletonShape.heading) {
    return <span aria-hidden className={classNames(BAR_CLASSES, 'h-space-6 w-2/3')} />;
  }
  if (shape === SkeletonShape.field) {
    return <span aria-hidden className={classNames(BAR_CLASSES, 'h-button-height w-full')} />;
  }
  const lineNumbers = Array.from({ length: lines }, (_, index) => index + 1);
  return lineNumbers.map((lineNumber) => (
    <span
      key={lineNumber}
      aria-hidden
      className={classNames(BAR_CLASSES, 'h-space-4', lineNumber === lines ? 'w-2/3' : 'w-full')}
    />
  ));
}
