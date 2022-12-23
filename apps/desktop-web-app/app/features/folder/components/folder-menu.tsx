import type { FC } from 'react';
import { Edit2, FolderPlus, Trash2 } from 'react-feather';
import type { MenuPorps } from '~/shared/components/menu';
import { Menu } from '~/shared/components/menu';
import { MenuContentItemButton } from '~/shared/components/menu/menu-content-item-button';

export const FolderMenu: FC<
  MenuPorps & {
    onClickCreateMenu: () => void;
    onClickEditMenu: () => void;
    onClickDeleteMenu: () => void;
  }
> = ({ position, onClickCreateMenu, onClickEditMenu, onClickDeleteMenu }) => {
  return (
    <Menu position={position}>
      <div className="flex flex-col gap-1">
        <MenuContentItemButton
          label="編集"
          icon={<Edit2 size={'1rem'} />}
          role={'normal'}
          onClick={() => {
            onClickCreateMenu();
          }}
        />
        <MenuContentItemButton
          label="サブフォルダを追加"
          icon={<FolderPlus size={'1rem'} />}
          role={'normal'}
          onClick={() => {
            onClickEditMenu();
          }}
        />
        <MenuContentItemButton
          label="削除"
          icon={<Trash2 size={'1rem'} />}
          role={'danger'}
          onClick={() => {
            onClickDeleteMenu();
          }}
        />
      </div>
    </Menu>
  );
};
