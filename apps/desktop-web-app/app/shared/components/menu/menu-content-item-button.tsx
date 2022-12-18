import type { FC, ReactNode } from 'react';

export const MenuContentItemButton: FC<{
  label: string;
  icon?: ReactNode;
  role?: 'normal' | 'danger';
}> = ({ label, icon, role = 'normal' }) => {
  return (
    <button
      className={`flex items-center text-xs pl-2 pr-4 py-1 rounded-sm hover:bg-gray-100 ${
        role === 'normal' ? 'text-gray-900' : 'text-red-500'
      } ${icon != null ? 'gap-2' : ''}`}
    >
      {icon && icon}
      {label}
    </button>
  );
};
