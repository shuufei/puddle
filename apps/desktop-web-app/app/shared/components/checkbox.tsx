import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { useCheckbox } from 'react-aria';
import { useToggleState } from 'react-stately';

export const Checkbox: FC<{
  children: ReactNode;
  label: string;
  onChange?: (value: boolean) => void;
}> = ({ children, label, onChange }) => {
  const state = useToggleState({ onChange });
  const ref = useRef(null);
  const { inputProps } = useCheckbox({ 'aria-label': label }, state, ref);
  return (
    <label className=" text-sm text-gray-900 flex gap-1 items-center">
      <input {...inputProps} ref={ref} />
      <span className="">{children}</span>
    </label>
  );
};
