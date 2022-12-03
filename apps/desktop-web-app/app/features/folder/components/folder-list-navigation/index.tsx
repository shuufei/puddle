import type { FC } from 'react';
import { memo } from 'react';
import type { Folder } from '~/domain/folder';
import { NavigationItem } from './navigation-item';

export type FolderNavigationState = {
  data: Folder;
  opened: boolean;
};

export const FolderListNavigation: FC<{
  folderStates: FolderNavigationState[];
  allFolderStates: FolderNavigationState[]; // recoildなどで一元管理する
}> = memo(function FolderListNavigation({ folderStates, allFolderStates }) {
  return (
    <ul>
      {folderStates.map((folder) => {
        return (
          <li key={folder.data.id} className="mb-0.5">
            <NavigationItem
              folderState={folder}
              allFolderStates={allFolderStates}
            />
          </li>
        );
      })}
    </ul>
  );
});
