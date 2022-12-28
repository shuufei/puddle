import type { FC } from 'react';
import { memo } from 'react';
import { Heart } from 'react-feather';

export const ImportantIcon: FC<{ size: string }> = memo(function ImportantIcon({
  size,
}) {
  return <Heart size={size} color={'transparent'} fill={'#f87171'} />;
});
