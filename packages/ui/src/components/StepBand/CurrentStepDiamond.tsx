import { classNames } from '../../utils/class-names.ts';

export interface CurrentStepDiamondProps {
  readonly className?: string;
}

/** The current step's small vermilion diamond, before its name: the identity's attention touch. */
export function CurrentStepDiamond({ className }: CurrentStepDiamondProps) {
  return (
    <span
      aria-hidden
      data-current-step-diamond
      className={classNames('size-1.75 shrink-0 rotate-45 bg-vermillion', className)}
    />
  );
}
