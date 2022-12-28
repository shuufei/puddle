import type { FC } from 'react';
import { memo } from 'react';

export const Tab: FC<{
  label: string;
  isActive?: boolean;
  onClick: () => void;
}> = memo(function Tab({ label, isActive = false, onClick }) {
  return (
    <button
      className={`py-1 px-3 text-sm font-semibold border-2 border-b-0 rounded rounded-b-none ${
        isActive ? 'border-gray-900' : 'border-transparent'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
});
