import type { FC, ReactNode } from 'react';
import { useContext, useRef } from 'react';
import { useRadio } from 'react-aria';
import type { RadioGroupState } from 'react-stately';
import { RadioContext } from './radio-context';

export const Radio: FC<{ children: ReactNode; value: string }> = ({
  children,
  value,
}) => {
  const state = useContext(RadioContext) as RadioGroupState;
  const ref = useRef(null);
  const { inputProps } = useRadio({ value, 'aria-label': value }, state, ref);
  return (
    <label className="block text-sm text-gray-900">
      <input {...inputProps} ref={ref} />
      <span className="ml-1">{children}</span>
    </label>
  );
};
