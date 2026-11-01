import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useId, useRef } from 'react';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import type { CopyListItem } from './copy-list.ts';
import { useCopy } from './use-copy.ts';

interface CopyListRowProps {
  readonly item: CopyListItem;
  readonly copyLabel: string;
  readonly copiedLabel: string;
}

export function CopyListRow({ item, copyLabel, copiedLabel }: CopyListRowProps) {
  const labelId = useId();
  const actionId = useId();
  const valueRef = useRef<HTMLSpanElement>(null);
  const { isCopied, copy } = useCopy({ text: item.copyValue ?? item.value, valueRef });
  return (
    <li className="flex items-center gap-space-3 border-t-hair border-line py-space-2">
      <div className="min-w-0 flex-1">
        <span id={labelId} className="block font-mono text-kicker text-ink-muted">
          {item.label}
        </span>
        <span
          ref={valueRef}
          className="block wrap-anywhere font-mono text-label font-medium text-ink"
        >
          {item.value}
        </span>
      </div>
      <Button
        variant={ButtonVariant.secondary}
        icon={isCopied ? CheckIcon : CopyIcon}
        aria-labelledby={`${actionId} ${labelId}`}
        onClick={copy}
        className="shrink-0"
      >
        <span id={actionId}>{isCopied ? copiedLabel : copyLabel}</span>
      </Button>
      <span role="status" className="sr-only">
        {isCopied ? copiedLabel : null}
      </span>
    </li>
  );
}
