import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useId, useRef } from 'react';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import type { CopyListItem, CopyListTexts } from './copy-list.ts';
import { CopyOutcome, useCopy } from './use-copy.ts';

interface CopyListRowProps {
  readonly item: CopyListItem;
  readonly texts: CopyListTexts;
}

export function CopyListRow({ item, texts }: CopyListRowProps) {
  const labelId = useId();
  const actionId = useId();
  const valueRef = useRef<HTMLSpanElement>(null);
  const { result, copy } = useCopy({ text: item.copyValue ?? item.value, valueRef });
  const isCopied = result?.outcome === CopyOutcome.copied;
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
        {/* Both texts take the same cell, so that the button keeps its width. */}
        <span className="grid">
          <span id={actionId} className="col-start-1 row-start-1">
            {isCopied ? texts.copied : texts.copy}
          </span>
          <span aria-hidden className="invisible col-start-1 row-start-1">
            {isCopied ? texts.copy : texts.copied}
          </span>
        </span>
      </Button>
      <span role="status" className="sr-only">
        {result !== null && (
          <span key={result.count}>
            {result.outcome === CopyOutcome.copied ? texts.copied : texts.failed}
          </span>
        )}
      </span>
    </li>
  );
}
