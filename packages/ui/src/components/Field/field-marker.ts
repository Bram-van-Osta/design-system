import type { MessageKey } from '../../i18n/messages.ts';

/** Marks the fields that differ from the others: the required one among optional ones, or the reverse. */
export const FieldMarker = {
  required: 'required',
  optional: 'optional',
} as const;
export type FieldMarker = (typeof FieldMarker)[keyof typeof FieldMarker];

export const FIELD_MARKER_MESSAGES: Readonly<Record<FieldMarker, MessageKey>> = {
  required: 'field.required',
  optional: 'field.optional',
};
