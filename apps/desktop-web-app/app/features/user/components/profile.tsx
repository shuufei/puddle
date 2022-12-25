import { useNavigate } from '@remix-run/react';
import type { FC } from 'react';
import { useCallback } from 'react';
import type { User } from '~/domain/user';
import { Menu } from '~/shared/components/menu';
import { MenuContentItemButton } from '~/shared/components/menu/menu-content-item-button';

export const Profile: FC<{
  me: User;
}> = ({ me }) => {
  const navigate = useNavigate();
  const signOut = useCallback(async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    navigate('/auth/sign-in');
  }, [navigate]);
  return (
    <div className="flex gap-2 items-center justify-between p-2">
      <div className="flex gap-2 items-center">
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
      <div className="">
        <Menu position="top-left">
          <div className="flex flex-col gap-1">
            <MenuContentItemButton label="サインアウト" onClick={signOut} />
            <MenuContentItemButton label="アカウントを削除" role={'danger'} />
          </div>
        </Menu>
      </div>
    </div>
  );
};
