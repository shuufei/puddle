import type { FC } from 'react';
import { Heart } from 'react-feather';

export const ImportantIcon: FC<{ size: string }> = ({ size }) => {
  return <Heart size={size} color={'transparent'} fill={'#f87171'} />;
};
