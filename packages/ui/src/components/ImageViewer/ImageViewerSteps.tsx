import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useMessages } from '../../i18n/use-messages.ts';
import { Button, ButtonVariant } from '../Button/Button.tsx';
import type { ImageSteps } from './use-step-keys.ts';

/**
 * Previous and Next, each there when the app passes its handler, disabled at either end without
 * losing the focus. On a phone they come last, under the image, side by side, each half.
 */
export function ImageViewerSteps({ onPrevious, onNext, hasPrevious, hasNext }: ImageSteps) {
  const messages = useMessages();
  return (
    <div className="order-last grid grid-cols-2 gap-space-2 md:order-none md:ml-auto md:flex">
      {onPrevious && (
        <Button
          variant={ButtonVariant.secondary}
          icon={ArrowLeftIcon}
          disabled={!hasPrevious}
          isFocusableWhenDisabled
          onClick={onPrevious}
        >
          {messages['imageViewer.previous']}
        </Button>
      )}
      {onNext && (
        <Button
          variant={ButtonVariant.secondary}
          hasArrow
          disabled={!hasNext}
          isFocusableWhenDisabled
          onClick={onNext}
          className="col-start-2"
        >
          {messages['imageViewer.next']}
        </Button>
      )}
    </div>
  );
}
