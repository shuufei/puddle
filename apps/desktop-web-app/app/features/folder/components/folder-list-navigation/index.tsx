import type { FC } from 'react';
import { memo } from 'react';
import type { Folder } from '~/domain/folder';
import { NavigationItem } from './navigation-item';

export type FolderNavigationState = {
  data: Folder;
  opened: boolean;
};

export const FolderListNavigation: FC<{
  folders: Folder[];
  onClickCreateMenu: (parentFolder?: Folder) => void;
  onClickDeleteMenu: (folder: Folder) => void;
  onClickEditMenu: (folder: Folder) => void;
}> = memo(function FolderListNavigation({
  folders,
  onClickCreateMenu,
  onClickDeleteMenu,
  onClickEditMenu,
}) {
  return (
    <ul>
      {folders.map((folder) => {
        return (
          <li key={folder.id} className="mb-1">
            <NavigationItem
              folder={folder}
              onClickCreateMenu={onClickCreateMenu}
              onClickDeleteMenu={onClickDeleteMenu}
              onClickEditMenu={onClickEditMenu}
            />
          </li>
        );
      })}
    </ul>
  );
});
