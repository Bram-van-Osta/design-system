import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ReactNode } from 'react';
import { ImageViewerBar } from './ImageViewerBar.tsx';
import { ImageViewerFooter } from './ImageViewerFooter.tsx';
import { ImageViewerFrame } from './ImageViewerFrame.tsx';
import { ImageViewerHead } from './ImageViewerHead.tsx';
import { useStepKeys } from './use-step-keys.ts';

// On a phone the whole screen; on a computer a box over the page, as tall as its content, which
// the window's height caps by shortening the image's frame.
const POPUP_CLASSES =
  'flex h-full w-full flex-col gap-space-3 bg-bg px-space-4 pt-space-3 pb-space-4 text-ink md:h-auto md:max-h-full md:max-w-image-viewer-width md:gap-space-4 md:border-hair md:border-ink md:p-space-5';

export interface ImageViewerProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  /** The image's name: "Home". */
  readonly title: ReactNode;
  /** A line of facts under it, in IBM Plex Mono: "example.com/ · computer, 1440 px · 1 of 8". */
  readonly description?: ReactNode;
  /** The image, often a full page much taller than wide: it shows whole at the frame's width. */
  readonly src: string;
  /** What the image shows, for screen readers. */
  readonly alt: string;
  /** Beside Previous and Next, the app's own controls, such as a `ToggleGroup` of views. */
  readonly controls?: ReactNode;
  /** Shows the previous image, from Previous and the left arrow key. Without it, no Previous. */
  readonly onPrevious?: () => void;
  /** Shows the next image, from Next and the right arrow key. Without it, no Next. */
  readonly onNext?: () => void;
  /** `false` on the first image: Previous stays displayed, disabled. */
  readonly hasPrevious?: boolean;
  /** `false` on the last image: Next stays displayed, disabled. */
  readonly hasNext?: boolean;
  /** The image's own address, opened alone in a new tab, on a computer. */
  readonly originalHref?: string;
  /** On a computer, in IBM Plex Mono at the bottom right: how to go from one image to the next. */
  readonly hint?: ReactNode;
}

/**
 * An image shown whole in a dialog, a tall one scrolled at the frame's width, and the walk from
 * one image to the next. Escape and the close button close it; the focus goes back to what opened
 * it. The app holds which image is shown: it changes `src` and the texts.
 */
export function ImageViewer({
  open,
  onOpenChange,
  title,
  description,
  src,
  alt,
  controls,
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
  originalHref,
  hint,
}: ImageViewerProps) {
  const steps = { onPrevious, onNext, hasPrevious, hasNext };
  const onKeyDown = useStepKeys(steps);
  return (
    <BaseDialog.Root open={open} onOpenChange={(nextOpen: boolean) => onOpenChange(nextOpen)}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 bg-bg/80" />
        <BaseDialog.Viewport className="fixed inset-0 flex items-center justify-center md:p-space-6">
          <BaseDialog.Popup onKeyDown={onKeyDown} className={POPUP_CLASSES}>
            <ImageViewerHead title={title} description={description} />
            <ImageViewerBar controls={controls} {...steps} />
            <ImageViewerFrame src={src} alt={alt} />
            <ImageViewerFooter originalHref={originalHref} hint={hint} />
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
