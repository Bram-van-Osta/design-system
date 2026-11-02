import { Input } from '@base-ui/react/input';
import { classNames } from '../../utils/class-names.ts';
import { CONTROL_CLASSES } from '../TextInput/control-classes.ts';
import { useAutoSize } from './use-auto-size.ts';

const DEFAULT_ROWS = 3;

export interface TextAreaProps extends Omit<Input.Props, 'className' | 'render'> {
  /** How many lines it shows at least; it grows with its text, up to most of the screen. */
  readonly rows?: number;
  readonly className?: string;
}

/**
 * A few sentences, inside a Field. `maxLength` bounds them; `onValueChange` gives the text. Its
 * text is at the body size, the one under which iOS zooms on a field it focuses.
 */
export function TextArea({ rows = DEFAULT_ROWS, className, ref, ...props }: TextAreaProps) {
  const autoSizeRef = useAutoSize(ref);
  return (
    <Input
      {...props}
      render={<textarea ref={autoSizeRef} rows={rows} />}
      className={classNames(CONTROL_CLASSES, 'resize-none py-space-3 text-body', className)}
    />
  );
}
