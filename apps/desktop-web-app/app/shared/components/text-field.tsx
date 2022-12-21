import type { FC } from 'react';
import { useRef } from 'react';
import { useTextField } from 'react-aria';

export const TextField: FC<{ label: string }> = ({ label }) => {
  const inputRef = useRef(null);
  const { labelProps, inputProps } = useTextField(
    { label, placeholder: `${label}を入力してください` },
    inputRef
  );
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm" {...labelProps}>
        {label}
      </label>
      <input
        className="py-1 px-1.5 text-sm w-full border border-gray-400 rounded-sm"
        {...inputProps}
        ref={inputRef}
      />
    </div>
  );
};
