import { Link } from '@remix-run/react';
import type { FC } from 'react';
import { memo, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, Folder as FolderIcon } from 'react-feather';
import type { FolderNavigationState } from '.';
import { FolderListNavigation } from '.';

export const NavigationItem: FC<{
  folderState: FolderNavigationState;
  allFolderStates: FolderNavigationState[]; // recoildなどで一元管理する
}> = memo(function NavigatioinItem({ folderState, allFolderStates }) {
  const [opened, setOpened] = useState(folderState.opened);
  const subFolderStates = useMemo(() => {
    return allFolderStates.filter(
      (v) => v.data.parent_folder_id === folderState.data.id
    );
  }, [allFolderStates, folderState.data.id]);
  return (
    <>
      <div className="flex gap-1.5 items-center hover:bg-gray-100 px-2 py-1 pr-6 rounded-sm">
        {subFolderStates.length > 0 ? (
          <button
            className="text-sm p-0.5 text-gray-900 hover:text-white hover:bg-gray-900 rounded-sm"
            onClick={() => {
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
          <div className="p-1">
            <div className="w-4 h-4"></div>
          </div>
        )}
        <Link
          to={`/folders/${folderState.data.id}`}
          className="flex gap-1.5 items-center text-gray-900 flex-1"
        >
          <FolderIcon size={'1.25rem'} />
          <p className="text-sm font-semibold whitespace-nowrap">
            {folderState.data.title}
          </p>
        </Link>
      </div>
      {opened && subFolderStates.length > 0 && (
        <div className="pl-6 mt-0.5">
          <FolderListNavigation
            folderStates={subFolderStates}
            allFolderStates={allFolderStates}
          />
        </div>
      )}
    </>
  );
});
