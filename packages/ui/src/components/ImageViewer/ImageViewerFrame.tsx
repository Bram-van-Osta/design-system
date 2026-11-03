import { useScrollToTop } from './use-scroll-to-top.ts';

export interface ImageViewerFrameProps {
  readonly src: string;
  readonly alt: string;
}

/**
 * The whole image at the frame's width, a tall one scrolled from its top, back to it with each new
 * image. The frame takes the focus, so that the keyboard scrolls it too.
 */
export function ImageViewerFrame({ src, alt }: ImageViewerFrameProps) {
  const scrollerRef = useScrollToTop(src);
  return (
    <div
      ref={scrollerRef}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the keyboard reaches the frame to scroll it.
      tabIndex={0}
      className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain border-hair border-line bg-surface md:h-image-viewer-height md:flex-initial"
    >
      <img src={src} alt={alt} className="block h-auto w-full" />
    </div>
  );
}
