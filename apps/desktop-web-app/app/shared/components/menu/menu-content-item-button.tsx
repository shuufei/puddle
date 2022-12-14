import type { FC, ReactNode } from 'react';
import { memo } from 'react';

export const MenuContentItemButton: FC<{
  label: string;
  icon?: ReactNode;
  role?: 'normal' | 'danger';
  onClick?: () => void;
}> = memo(function MenuContentItemButton({
  label,
  icon,
  role = 'normal',
  onClick,
}) {
  return (
    <button
      className={`flex items-center text-xs pl-2 pr-4 py-1 rounded-sm hover:bg-gray-100 active:bg-gray-200 ${
        role === 'normal' ? 'text-gray-900' : 'text-red-500'
      } ${icon != null ? 'gap-2' : ''}`}
      onClick={onClick}
    >
      {icon && icon}
      {label}
    </button>
  );
});
