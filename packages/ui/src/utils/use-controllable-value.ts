import { useState } from 'react';

/** The app's value when it controls it; otherwise the component's own, from its default. */
export function useControllableValue<Value>(value: Value | undefined, defaultValue: Value) {
  const [ownValue, setOwnValue] = useState(defaultValue);
  return [value === undefined ? ownValue : value, setOwnValue] as const;
}
