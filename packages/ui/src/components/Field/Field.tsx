import { Field as BaseField } from '@base-ui/react/field';
import type { ReactNode } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { AgentMark } from '../AgentMark/AgentMark.tsx';
import { SOURCE_MARK_CLASSES } from '../SourceMark/source-mark.ts';
import { FieldError } from './FieldError.tsx';
import { FieldMarkerText } from './FieldMarkerText.tsx';
import { FieldLabelSize } from './field-label-size.ts';
import type { FieldMarker } from './field-marker.ts';

const ROOT_CLASSES: Readonly<Record<FieldLabelSize, string>> = {
  regular: 'flex flex-col gap-space-2',
  small: 'flex flex-col gap-space-1',
};

const LABEL_CLASSES: Readonly<Record<FieldLabelSize, string>> = {
  regular: 'text-label text-ink data-disabled:text-ink-muted',
  small: 'font-mono text-kicker text-ink-muted',
};

export interface FieldProps {
  readonly label: ReactNode;
  /** `regular` by default; `small` for a search field's label, in muted mono. */
  readonly labelSize?: FieldLabelSize;
  /** The help under the field. */
  readonly description?: ReactNode;
  /**
   * Where the value comes from, in a SourceMark right under the control, which it describes: "from
   * your text", on a value filled for the reader from their own words. The app leaves it out once
   * the reader changes the value.
   */
  readonly source?: ReactNode;
  /** What is wrong, in words: shown under the field, which becomes invalid. */
  readonly error?: ReactNode;
  readonly marker?: FieldMarker;
  /**
   * The value is the agent's draft, which the reader has not changed: its words beside the label
   * ("drafted by the agent, to edit") and the agent's rule at the control's left, for the operator
   * alone. The app leaves it out once the value changes.
   */
  readonly agentDraft?: ReactNode;
  readonly name?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  /** The control: a TextInput, a TextArea, a PasswordInput or a Select. */
  readonly children: ReactNode;
}

/** A control with its label above, then its error and its help under it, all wired for screen readers. */
export function Field({
  label,
  labelSize = FieldLabelSize.regular,
  description,
  source,
  error,
  marker,
  agentDraft,
  name,
  disabled,
  className,
  children,
}: FieldProps) {
  const isInvalid = hasContent(error);
  const isAgentDraft = hasContent(agentDraft);
  return (
    <BaseField.Root
      data-agent-draft={isAgentDraft || undefined}
      name={name}
      disabled={disabled}
      invalid={isInvalid}
      className={classNames(ROOT_CLASSES[labelSize], className)}
    >
      {/* Not a <label>: the control may be a Select's button, which a native label would press. */}
      <BaseField.Label
        nativeLabel={false}
        render={<div />}
        className={classNames(
          LABEL_CLASSES[labelSize],
          isAgentDraft && 'flex flex-wrap items-baseline justify-between gap-x-space-3',
        )}
      >
        <span>
          {label}
          {marker && <FieldMarkerText marker={marker} />}
        </span>
        {isAgentDraft && (
          <>
            {' '}
            <AgentMark>{agentDraft}</AgentMark>
          </>
        )}
      </BaseField.Label>
      {children}
      {hasContent(source) && (
        <BaseField.Description render={<span />} data-source-mark className={SOURCE_MARK_CLASSES}>
          {source}
        </BaseField.Description>
      )}
      {isInvalid && <FieldError>{error}</FieldError>}
      {hasContent(description) && (
        <BaseField.Description render={<div />} className="text-body-s text-ink-muted">
          {description}
        </BaseField.Description>
      )}
    </BaseField.Root>
  );
}
