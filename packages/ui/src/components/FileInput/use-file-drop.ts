import { type DragEvent, useState } from 'react';

/** A file dropped on the zone, as if it had been chosen: the app checks it the same way. */
export function useFileDrop(onFile: (file: File) => void, isDisabled: boolean) {
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
        const file = event.dataTransfer.files[0];
        if (file && !isDisabled) {
          onFile(file);
        }
      },
    },
  };
}
