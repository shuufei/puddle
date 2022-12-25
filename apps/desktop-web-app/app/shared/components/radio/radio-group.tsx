import type { FC, ReactNode } from 'react';
import { useRadioGroup } from 'react-aria';
import { useRadioGroupState } from 'react-stately';
import { RadioContext } from './radio-context';

export const RadioGroup: FC<{
  children: ReactNode;
  label: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}> = ({ children, label, defaultValue, onChange }) => {
  const state = useRadioGroupState({ label, defaultValue, onChange });
  const { radioGroupProps, labelProps } = useRadioGroup({ label }, state);
  return (
    <div {...radioGroupProps}>
      <span className="text-xs text-gray-900" {...labelProps}>
        {label}
      </span>
      <RadioContext.Provider value={state}>
        <div className="mt-1">{children}</div>
      </RadioContext.Provider>
    </div>
  );
};
