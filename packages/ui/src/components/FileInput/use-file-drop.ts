import { type DragEvent, useState } from 'react';

/** Files dropped on a zone, as if they had been chosen: the app checks them the same way. */
export function useFileDrop(onFiles: (files: readonly File[]) => void, isDisabled: boolean) {
  const [isDragging, setIsDragging] = useState(false);
  return {
    isDragging,
    dropProps: {
      onDragOver: (event: DragEvent) => {
        if (!isDisabled) {
          event.preventDefault();
          setIsDragging(true);
        }
      },
      onDragLeave: () => setIsDragging(false),
      onDrop: (event: DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0 && !isDisabled) {
          onFiles(files);
        }
      },
    },
  };
}
