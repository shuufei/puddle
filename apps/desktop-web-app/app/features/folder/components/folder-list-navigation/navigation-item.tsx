import { NavLink, useLoaderData } from '@remix-run/react';
import type { FC, MouseEvent } from 'react';
import { useCallback, useEffect } from 'react';
import { memo, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Folder as FolderIcon } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { FoldersLoaderData } from '~/routes/folders';
import { FolderListNavigation } from '.';
import { FolderConditions } from '../folder-conditions';

type FolderNavigationState = {
  opened: boolean;
};

export const NavigationItem: FC<{
  folder: Folder;
  allFolders: Folder[]; // recoildなどで一元管理する
}> = memo(function NavigatioinItem({ folder, allFolders }) {
  const folderStateKey = `navstate/folder/${folder.id}`;
  const { collections } = useLoaderData<FoldersLoaderData>();
  const [opened, setOpened] = useState<boolean | undefined>(undefined);

  const subFolders = useMemo(() => {
    return allFolders.filter((v) => v.parent_folder_id === folder.id);
  }, [allFolders, folder.id]);

  useEffect(() => {
    const navStateString = localStorage.getItem(folderStateKey);
    const navState =
      navStateString != null
        ? (JSON.parse(navStateString) as FolderNavigationState)
        : undefined;
    setOpened(navState?.opened ?? false);
  }, [folderStateKey]);

  const toggleOpen = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const updated = !opened;
      setOpened(updated);
      const navState: FolderNavigationState = { opened: updated };
      localStorage.setItem(folderStateKey, JSON.stringify(navState));
    },
    [folderStateKey, opened]
  );

  if (opened == null) {
    return null;
  }

  return (
    <>
      <NavLink
        to={`/folders/${folder.id}`}
        className={({ isActive }) => {
          const common =
            'flex gap-1.5 items-center hover:bg-gray-100 px-2 py-1 pr-6 rounded-sm border-solid border break-words w-full';
          return isActive
            ? `${common} bg-gray-100 border-gray-900`
            : `${common} border-transparent`;
        }}
      >
        {subFolders.length > 0 ? (
          <button
            className="text-sm p-0.5 text-gray-900 hover:text-white hover:bg-gray-900 rounded-sm"
            onClick={toggleOpen}
          >
            {opened ? (
              <ChevronDown size={'1rem'} />
            ) : (
              <ChevronRight size={'1rem'} />
            )}
          </button>
        ) : (
          <div className="p-0.5">
            <div className="w-4 h-4"></div>
          </div>
        )}
        <div className="flex gap-2 items-center text-gray-900 flex-1 overflow-hidden">
          <FolderIcon size={'1.9rem'} />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {folder.title}
            </p>
            <FolderConditions folder={folder} collections={collections} />
          </div>
        </div>
      </NavLink>
      {opened && subFolders.length > 0 && (
        <div className="pl-6 mt-1">
          <FolderListNavigation folders={subFolders} allFolders={allFolders} />
        </div>
      )}
    </>
  );
});