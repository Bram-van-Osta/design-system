import { useMessages } from '../../i18n/use-messages.ts';
import { classNames } from '../../utils/class-names.ts';

/** Between two squares of the wave. */
const WAVE_STEP_MILLISECONDS = 150;

// Still, for a system that asks for less motion, the squares fade from the first to the last.
const SQUARE_OPACITIES = ['opacity-100', 'opacity-60', 'opacity-25'] as const;

interface ReadingIndicatorProps {
  readonly isReading: boolean;
  /** Its word, the package's by default: "updating". */
  readonly label?: string;
}

/**
 * While a reading runs: three delft squares in a wave, and its word. Its place is kept, hidden, while
 * none runs: the title beside it never reflows as a reading comes and goes.
 */
export function ReadingIndicator({ isReading, label }: ReadingIndicatorProps) {
  const messages = useMessages();
  return (
    <span
      data-reading={isReading || undefined}
      className={classNames(
        'inline-flex shrink-0 items-center gap-space-2 whitespace-nowrap font-mono text-ink-muted text-kicker',
        !isReading && 'invisible',
      )}
    >
      <span aria-hidden className="inline-flex gap-space-1">
        {SQUARE_OPACITIES.map((opacity, index) => (
          <span
            key={opacity}
            data-reading-square
            style={{ animationDelay: `${index * WAVE_STEP_MILLISECONDS}ms` }}
            className={classNames(
              'size-1.5 bg-delft',
              opacity,
              isReading && 'motion-safe:animate-wave',
            )}
          />
        ))}
      </span>
      {label ?? messages['pointColumn.reading']}
    </span>
  );
}
