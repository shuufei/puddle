import type { FC, ReactNode } from 'react';
import { memo } from 'react';

type Variant = 'fill' | 'ghost';

const getClassNameByVariant = (variant: Variant): string => {
  switch (variant) {
    case 'ghost':
      return 'text-gray-900 hover:bg-gray-100 active:bg-gray-300';
    case 'fill':
    default:
      return 'bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-500';
  }
};

export const Button: FC<{
  children: ReactNode;
  variant?: Variant;
  onClick?: () => void;
}> = memo(function Button({ children, variant = 'fill', onClick }) {
  const variantClassName = getClassNameByVariant(variant);
  return (
    <button
      className={`flex items-center py-2 px-4 gap-1 rounded-md text-sm font-semibold ${variantClassName}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
});
