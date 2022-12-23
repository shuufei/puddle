import { NavLink } from '@remix-run/react';
import type { FC, MouseEvent } from 'react';
import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ChevronDown, ChevronRight, Folder as FolderIcon } from 'react-feather';
import type { Folder } from '~/domain/folder';
import { FolderListNavigation } from '.';
import { FoldersStateContext } from '../../states/folders-state-context';
import { FolderConditions } from '../folder-conditions';
import { FolderMenu } from '../folder-menu';

type FolderNavigationState = {
  opened: boolean;
};

export const NavigationItem: FC<{
  folder: Folder;
  onClickCreateMenu: (parentFolder?: Folder) => void;
  onClickDeleteMenu: (folder: Folder) => void;
}> = memo(function NavigatioinItem({
  folder,
  onClickCreateMenu,
  onClickDeleteMenu,
}) {
  const { folders: allFolders } = useContext(FoldersStateContext);
  const folderStateKey = `navstate/folder/${folder.id}`;
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
            'flex gap-1.5 items-center hover:bg-gray-100 px-2 py-1 rounded-sm border-solid border-2 break-words w-full group';
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
            <FolderConditions folder={folder} />
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100">
          <FolderMenu
            position="left"
            onClickCreateMenu={() => {
              onClickCreateMenu(folder);
            }}
            onClickEditMenu={() => {}}
            onClickDeleteMenu={() => {
              onClickDeleteMenu(folder);
            }}
          />
        </div>
      </NavLink>
      {opened && subFolders.length > 0 && (
        <div className="pl-6 mt-1">
          <FolderListNavigation
            folders={subFolders}
            onClickCreateMenu={onClickCreateMenu}
            onClickDeleteMenu={onClickDeleteMenu}
          />
        </div>
      )}
    </>
  );
});
