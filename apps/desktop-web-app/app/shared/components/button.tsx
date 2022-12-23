import type { FC, ReactNode } from 'react';
import { memo } from 'react';

type Variant = 'fill' | 'ghost';
type Role = 'default' | 'danger';

const getClassNameByVariantAndRole = (variant: Variant, role: Role): string => {
  const fillBgColor = role === 'default' ? 'bg-gray-900' : 'bg-red-700';
  const fillBgColorHover =
    role === 'default' ? 'hover:bg-gray-700' : 'hover:bg-red-600';
  const fillBgColorActive =
    role === 'default' ? 'active:bg-gray-500' : 'active:bg-red-500';
  const fillBgColorDisabled =
    role === 'default' ? 'disabled:bg-gray-400' : 'disabled:bg-red-300';
  const ghostTextColor = role === 'default' ? 'text-gray-900' : 'text-red-700';
  const ghostTextColorDisabled =
    role === 'default' ? 'disabled:text-gray-400' : 'disabled:text-red-400';
  const ghostBgColorHover =
    role === 'default' ? 'hover:bg-gray-100' : 'hover:bg-red-100';
  const ghostBgColorActive =
    role === 'default' ? 'active:bg-gray-300' : 'active:bg-red-300';
  switch (variant) {
    case 'ghost':
      return `${ghostTextColor} ${ghostBgColorHover} ${ghostBgColorActive} ${ghostTextColorDisabled}`;
    case 'fill':
    default:
      return `${fillBgColor} text-white ${fillBgColorHover} ${fillBgColorActive} ${fillBgColorDisabled}`;
  }
};

export const Button: FC<{
  children: ReactNode;
  variant?: Variant;
  role?: Role;
  disabled?: boolean;
  onClick?: () => void;
}> = memo(function Button({
  children,
  variant = 'fill',
  role = 'default',
  disabled,
  onClick,
}) {
  const variantClassName = getClassNameByVariantAndRole(variant, role);
  return (
    <button
      className={`flex items-center py-2 px-4 gap-1 rounded-md text-sm font-semibold ${variantClassName} disabled:pointer-events-none`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
