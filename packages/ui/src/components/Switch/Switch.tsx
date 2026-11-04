import { Field as BaseField } from '@base-ui/react/field';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { type ReactNode, useId } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { FIRST_LINE_SLOT_CLASSES } from '../../utils/first-line.ts';
import { hasContent } from '../../utils/has-content.ts';

// A row of a settings list: the whole line is the target, the switch on the label's first line.
const LINE_CLASSES =
  'group flex min-h-target-min cursor-pointer items-start justify-between gap-space-5 border-t-hair border-line py-space-4 text-label text-ink data-disabled:cursor-not-allowed data-disabled:text-ink-muted';

// Off, an ink outline on the background; on, Delft without an outline. Pointing at the line deepens
// the track; once disabled, it fades and points at nothing.
const TRACK_CLASSES = classNames(
  'relative block h-switch-height w-switch-width bg-bg',
  'before:absolute before:inset-0 before:border-hair before:border-ink data-checked:bg-delft data-checked:before:hidden',
  'group-hover:not-data-disabled:bg-surface group-hover:not-data-disabled:data-checked:bg-delft-deep',
  'data-disabled:bg-surface data-disabled:before:border-line data-disabled:data-checked:bg-field',
);

// The knob moves alone, from space-1 to the track's width less the knob and space-1 (space-5).
const KNOB_CLASSES =
  'absolute top-space-1 left-0 block size-switch-knob translate-x-space-1 bg-ink-muted data-checked:translate-x-space-5 data-checked:bg-bg data-disabled:bg-field data-disabled:data-checked:bg-bg motion-safe:transition-transform';

export interface SwitchProps {
  /** What the switch turns on or off, which names it. */
  readonly label: ReactNode;
  /** A short sentence under the label, which describes the switch. */
  readonly description?: ReactNode;
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
  readonly disabled?: boolean;
  readonly name?: string;
  readonly className?: string;
}

/** A setting turned on or off at once: its label on the left, the switch on the right. */
export function Switch({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  className,
}: SwitchProps) {
  const labelId = useId();
  return (
    <BaseField.Root name={name} disabled={disabled} className={className}>
      <BaseField.Label className={LINE_CLASSES}>
        <span className="flex min-w-0 flex-col gap-space-1">
          <span id={labelId}>{label}</span>
          {hasContent(description) && (
            <BaseField.Description render={<span />} className="text-body-s text-ink-muted">
              {description}
            </BaseField.Description>
          )}
        </span>
        <span className={FIRST_LINE_SLOT_CLASSES}>
          <BaseSwitch.Root
            aria-labelledby={labelId}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={(isChecked) => onCheckedChange?.(isChecked)}
            className={TRACK_CLASSES}
          >
            <BaseSwitch.Thumb className={KNOB_CLASSES} />
          </BaseSwitch.Root>
        </span>
      </BaseField.Label>
    </BaseField.Root>
  );
}
