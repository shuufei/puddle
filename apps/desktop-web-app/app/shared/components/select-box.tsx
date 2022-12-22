import type { FC } from 'react';
import { useField } from 'react-aria';

export type SelectOption = {
  value: string;
  label: string;
};

export const SelectBox: FC<{
  label: string;
  options: SelectOption[];
  onChange?: (value: SelectOption['value']) => void;
}> = ({ label, options, onChange }) => {
  const { labelProps, fieldProps } = useField({ label });
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-900" {...labelProps}>
        {label}
      </label>
      <select
        className="py-1 px-1.5 text-sm w-full border border-gray-400 rounded-sm"
        {...fieldProps}
        onChange={(value) => {
          onChange?.(value.target.value);
        }}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};
