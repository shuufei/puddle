import type { FC } from 'react';
import { useRef } from 'react';
import { useTextField } from 'react-aria';

export const TextField: FC<{
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}> = ({ label, description, placeholder, defaultValue, onChange }) => {
  const inputRef = useRef(null);
  const { labelProps, inputProps, descriptionProps } = useTextField(
    {
      label,
      placeholder,
      defaultValue,
      onChange: (value) => {
        onChange?.(value);
      },
    },
    inputRef
  );
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-900" {...labelProps}>
        {label}
      </label>
      <input
        className="py-1 px-1.5 text-sm w-full border border-gray-400 rounded-sm"
        {...inputProps}
        ref={inputRef}
      />
      {description && (
        <p className="text-xs text-gray-600" {...descriptionProps}>
          {description}
        </p>
      )}
    </div>
  );
};
