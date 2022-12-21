import type { FC, ReactNode } from 'react';
import { useRadioGroup } from 'react-aria';
import { useRadioGroupState } from 'react-stately';
import { RadioContext } from './radio-context';

export const RadioGroup: FC<{
  children: ReactNode;
  label: string;
}> = ({ children, label }) => {
  const state = useRadioGroupState({ label });
  const { radioGroupProps, labelProps } = useRadioGroup({ label }, state);
  return (
    <div {...radioGroupProps}>
      <span className="text-sm text-gray-900" {...labelProps}>
        {label}
      </span>
      <RadioContext.Provider value={state}>
        <div className="mt-1">{children}</div>
      </RadioContext.Provider>
    </div>
  );
};
