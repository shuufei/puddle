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
  allFolders: Folder[]; // recoildなどで一元管理する
}> = memo(function FolderListNavigation({ folders, allFolders }) {
  return (
    <ul>
      {folders.map((folder) => {
        return (
          <li key={folder.id} className="mb-1">
            <NavigationItem folder={folder} allFolders={allFolders} />
          </li>
        );
      })}
    </ul>
  );
});
