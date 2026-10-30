import { useMessages } from '../../i18n/use-messages.ts';
import { FIELD_MARKER_MESSAGES, type FieldMarker } from './field-marker.ts';

interface FieldMarkerTextProps {
  readonly marker: FieldMarker;
}

export function FieldMarkerText({ marker }: FieldMarkerTextProps) {
  const messages = useMessages();
  return (
    <span className="font-normal text-ink-muted"> {messages[FIELD_MARKER_MESSAGES[marker]]}</span>
  );
}
