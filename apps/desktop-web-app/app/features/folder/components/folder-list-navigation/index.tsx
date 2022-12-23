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
  // onClickEditMenu: () => void;
  onClickDeleteMenu: (folder: Folder) => void;
}> = memo(function FolderListNavigation({
  folders,
  onClickCreateMenu,
  onClickDeleteMenu,
}) {
  return (
    <ul>
      {folders.map((folder) => {
        return (
          <li key={folder.id} className="mb-1">
            <NavigationItem
              folder={folder}
              onClickCreateMenu={onClickCreateMenu}
              // onClickEditMenu={onClickEditMenu}
              onClickDeleteMenu={onClickDeleteMenu}
            />
          </li>
        );
      })}
    </ul>
  );
});
