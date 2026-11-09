import { XIcon } from '@phosphor-icons/react';
import { IconButton } from '../IconButton/IconButton.tsx';
import { isNoted, type NotedPoint } from './noted-point.ts';

interface PointSlotProps {
  readonly point: NotedPoint;
  /** When its value arrives, so that two points of one reading come one after the other. */
  readonly arrivalDelay: number;
  readonly onRemove?: (id: string) => void;
  readonly onEmphasize?: (id: string | null) => void;
}

/**
 * A point in its place: a rule that turns delft from the left once noted, its name, then its
 * example in grey, or its value, rising as it fades in, with the cross that removes it.
 */
export function PointSlot({ point, arrivalDelay, onRemove, onEmphasize }: PointSlotProps) {
  const isPointNoted = isNoted(point);
  const arrival = { animationDelay: `${arrivalDelay}ms` };
  const emphasize = () => onEmphasize?.(point.id);
  const release = () => onEmphasize?.(null);
  return (
    <li
      data-point={point.id}
      data-noted={isPointNoted || undefined}
      onMouseEnter={emphasize}
      onMouseLeave={release}
      className="flex flex-col gap-space-1"
    >
      <span aria-hidden className="mb-space-2 block h-progress-height bg-line">
        {isPointNoted && (
          <span
            data-point-rule
            style={arrival}
            className="block h-full origin-left bg-delft motion-safe:animate-grow"
          />
        )}
      </span>
      <span className="font-mono text-kicker text-ink-muted">{point.label}</span>
      {isPointNoted ? (
        <span
          data-point-value
          style={arrival}
          className="flex items-start justify-between gap-space-2 motion-safe:animate-rise"
        >
          <span className="min-w-0 pt-space-2 text-label text-ink">{point.value}</span>
          {point.removeLabel !== undefined && (
            <IconButton
              icon={XIcon}
              label={point.removeLabel}
              onClick={() => onRemove?.(point.id)}
              onFocus={emphasize}
              onBlur={release}
              className="-me-space-3 text-ink-muted"
            />
          )}
        </span>
      ) : (
        <span className="text-body-s text-ink-muted">{point.example}</span>
      )}
    </li>
  );
}
