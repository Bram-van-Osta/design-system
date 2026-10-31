import { Input } from '@base-ui/react/input';
import { classNames } from '../../utils/class-names.ts';
import { CONTROL_CLASSES } from '../TextInput/control-classes.ts';

const DEFAULT_ROWS = 3;

export interface TextAreaProps extends Omit<Input.Props, 'className' | 'render'> {
  /** How many lines it shows at first; the person can make it taller. */
  readonly rows?: number;
  readonly className?: string;
}

/** A few sentences, inside a Field. `maxLength` bounds them; `onValueChange` gives the text. */
export function TextArea({ rows = DEFAULT_ROWS, className, ...props }: TextAreaProps) {
  return (
    <Input
      {...props}
      render={<textarea rows={rows} />}
      className={classNames(CONTROL_CLASSES, 'resize-y py-space-3', className)}
    />
  );
}
