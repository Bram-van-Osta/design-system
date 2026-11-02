import { Input } from '@base-ui/react/input';
import { classNames } from '../../utils/class-names.ts';
import { CONTROL_CLASSES } from './control-classes.ts';

export interface TextInputProps extends Omit<Input.Props, 'className' | 'render'> {
  readonly className?: string;
}

/** A line of text, inside a Field. `type`, `autoComplete` and `inputMode` say what it holds. */
export function TextInput({ className, ...props }: TextInputProps) {
  return <Input {...props} className={classNames(CONTROL_CLASSES, className)} />;
}
