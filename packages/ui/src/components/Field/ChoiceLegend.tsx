import { Field as BaseField } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import type { ReactNode } from 'react';
import { hasContent } from '../../utils/has-content.ts';
import { FieldMarkerText } from './FieldMarkerText.tsx';
import type { FieldMarker } from './field-marker.ts';

interface ChoiceLegendProps {
  readonly legend: ReactNode;
  readonly marker: FieldMarker | undefined;
  readonly description: ReactNode;
}

/** The question a group of choices answers, and its help under it. */
export function ChoiceLegend({ legend, marker, description }: ChoiceLegendProps) {
  return (
    <>
      <Fieldset.Legend className="mb-space-1 text-label text-ink">
        {legend}
        {marker && <FieldMarkerText marker={marker} />}
      </Fieldset.Legend>
      {hasContent(description) && (
        <BaseField.Description className="mb-space-1 text-body-s text-ink-muted">
          {description}
        </BaseField.Description>
      )}
    </>
  );
}
