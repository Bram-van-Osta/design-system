import type { ReactNode } from 'react';
import { hasContent } from '../../utils/has-content.ts';
import { ImageViewerSteps } from './ImageViewerSteps.tsx';
import type { ImageSteps } from './use-step-keys.ts';

export interface ImageViewerBarProps extends ImageSteps {
  readonly controls?: ReactNode;
}

/**
 * The app's controls on the left, Previous and Next on the right. On a phone the bar dissolves:
 * the controls take the width above the image, and the steps go under it.
 */
export function ImageViewerBar({ controls, ...steps }: ImageViewerBarProps) {
  const hasSteps = steps.onPrevious !== undefined || steps.onNext !== undefined;
  if (!hasContent(controls) && !hasSteps) {
    return null;
  }
  return (
    <div className="contents md:flex md:flex-wrap md:items-center md:gap-space-3">
      {hasContent(controls) && (
        <div className="flex flex-wrap items-center gap-space-3">{controls}</div>
      )}
      {hasSteps && <ImageViewerSteps {...steps} />}
    </div>
  );
}
