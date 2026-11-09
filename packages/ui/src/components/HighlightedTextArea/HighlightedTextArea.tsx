import { Input } from '@base-ui/react/input';
import type { ReactNode, Ref } from 'react';
import { classNames } from '../../utils/class-names.ts';
import { hasContent } from '../../utils/has-content.ts';
import { useControllableValue } from '../../utils/use-controllable-value.ts';
import { useAutoSize } from '../TextArea/use-auto-size.ts';
import { CONTROL_FRAME_CLASSES } from '../TextInput/control-classes.ts';
import { PassageText } from './PassageText.tsx';
import type { TextPassage } from './passage-ranges.ts';
import { useMirror } from './use-mirror.ts';

const DEFAULT_ROWS = 6;
// The last line of the layer, which a text ending in a line break would otherwise lose.
const LAST_LINE = '\u200b';

// The layer has the text area's box, frame and type, so that its words fall under the typed ones;
// its own text is transparent, only its passages' tints and underlines show through.
const MIRROR_CLASSES =
  'pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap wrap-break-word border-hair border-transparent px-space-4 py-space-3 text-body text-transparent';

type InputProps = Omit<
  Input.Props,
  'className' | 'render' | 'ref' | 'value' | 'defaultValue' | 'onValueChange'
>;

export interface HighlightedTextAreaProps extends InputProps {
  /** The text area itself, which an app focuses or measures. */
  readonly ref?: Ref<HTMLTextAreaElement>;
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  /** The passages to paint, by their words: one whose words are gone loses its tint. */
  readonly passages: readonly TextPassage[];
  /** The passage whose point is hovered or focused, in the strong tint. */
  readonly emphasizedId?: string | null;
  /** How many lines it shows at least; it grows with its text, up to most of the screen. */
  readonly rows?: number;
  /** A band stuck to the field's bottom, inside its frame: a PointBand on a phone. */
  readonly footer?: ReactNode;
  readonly className?: string;
}

/**
 * The reader's own words, inside a Field, with the passages a reading found in them tinted and
 * underlined. A real text area over a layer that mirrors its text and paints the passages: nothing
 * moves as the reader types but their letters.
 */
export function HighlightedTextArea({
  ref,
  value,
  defaultValue,
  onValueChange,
  passages,
  emphasizedId = null,
  rows = DEFAULT_ROWS,
  footer,
  className,
  ...props
}: HighlightedTextAreaProps) {
  const [text, setText] = useControllableValue(value, defaultValue ?? '');
  const { textAreaRef, mirrorRef } = useMirror(ref);
  const autoSizeRef = useAutoSize(textAreaRef);
  return (
    <div className={classNames('flex flex-col', className)}>
      <div className="relative bg-bg has-data-disabled:bg-surface">
        <div ref={mirrorRef} aria-hidden data-passages-layer className={MIRROR_CLASSES}>
          <PassageText text={text} passages={passages} emphasizedId={emphasizedId} isArrivalShown />
          {LAST_LINE}
        </div>
        <Input
          {...props}
          value={value}
          defaultValue={defaultValue}
          onValueChange={(nextValue: string) => {
            setText(nextValue);
            onValueChange?.(nextValue);
          }}
          render={<textarea ref={autoSizeRef} rows={rows} />}
          className={classNames(
            CONTROL_FRAME_CLASSES,
            'relative block resize-none bg-transparent py-space-3',
          )}
        />
      </div>
      {hasContent(footer) && <div className="border-hair border-field border-t-0">{footer}</div>}
    </div>
  );
}
