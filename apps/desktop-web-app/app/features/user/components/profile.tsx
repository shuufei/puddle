import type { FC } from 'react';
import type { User } from '~/domain/user';

export const Profile: FC<{ me: User }> = ({ me }) => {
  return (
    <div className="flex gap-2 items-center p-2">
      <img
        src={me.avaterUrl}
        alt=""
        className="w-10 h-10 rounded-full border border-gray-900"
      />
      <div className="flex flex-col gap-0">
        <span className="text-gray-900 font-semibold text-sm">{me.name}</span>
        <span className="text-gray-600 text-xs">{me.email}</span>
      </div>
    </div>
  );
};
