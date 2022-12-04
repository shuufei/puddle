import { NavLink, useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder as FolderIcon,
  Heart,
} from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import type { FoldersLoaderData } from '~/routes/folders';
import type { FolderNavigationState } from '.';
import { FolderListNavigation } from '.';

const FolderCondition: FC<{ folder: Folder; collections: Collection[] }> = memo(
  function FolderCondition({ folder, collections }) {
    const collectionTitle = collections.find(
      (v) => v._id === folder.collectionId
    )?.title;
    return (
      <div className="text-xs font-semibold text-gray-500 flex gap-x-1 gap-y-0 items-center flex-wrap">
        {collectionTitle && <span>{collectionTitle}:</span>}
        {folder.tags.map((v) => (
          <span key={v}>{`#${v}`}</span>
        ))}
        {folder.include_important ? (
          <Heart size={'0.75rem'} color={'transparent'} fill={'#f87171'} />
        ) : null}
      </div>
    );
  }
);

export const NavigationItem: FC<{
  folderState: FolderNavigationState;
  allFolderStates: FolderNavigationState[]; // recoildなどで一元管理する
}> = memo(function NavigatioinItem({ folderState, allFolderStates }) {
  const { collections } = useLoaderData<FoldersLoaderData>();
  const [opened, setOpened] = useState(folderState.opened);
  const subFolderStates = useMemo(() => {
    return allFolderStates.filter(
      (v) => v.data.parent_folder_id === folderState.data.id
    );
  }, [allFolderStates, folderState.data.id]);
  return (
    <>
      <NavLink
        to={`/folders/${folderState.data.id}`}
        className={({ isActive }) => {
          const common =
            'flex gap-1.5 items-center hover:bg-gray-100 px-2 py-1 pr-6 rounded-sm border-solid border break-words';
          return isActive
            ? `${common} bg-gray-100 border-gray-900`
            : `${common} border-transparent`;
        }}
      >
        {subFolderStates.length > 0 ? (
          <button
            className="text-sm p-0.5 text-gray-900 hover:text-white hover:bg-gray-900 rounded-sm"
            onClick={(event) => {
              event.preventDefault();
              setOpened(!opened);
            }}
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
        <div className="flex gap-2 items-center text-gray-900 flex-1">
          <FolderIcon size={'1.9rem'} />
          <div className="flex flex-col flex-1">
            <span className="text-sm font-semibold whitespace-nowrap">
              {folderState.data.title}
            </span>
            <FolderCondition
              folder={folderState.data}
              collections={collections}
            />
          </div>
        </div>
      </NavLink>
      {opened && subFolderStates.length > 0 && (
        <div className="pl-6 mt-1">
          <FolderListNavigation
            folderStates={subFolderStates}
            allFolderStates={allFolderStates}
          />
        </div>
      )}
    </>
  );
});
