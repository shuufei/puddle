import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { Folder } from '~/domain/folder';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { getFolders } from '~/features/folder/api/get-folders.server';
import type { FolderNavigationState } from '~/features/folder/components/folder-list-navigation';
import { FolderListNavigation } from '~/features/folder/components/folder-list-navigation';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

type LoaderData = {
  folders: Folder[];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { userId } = await getRequestUserId(request);
    const res = await getFolders(userId);
    const folders = res.data.data as Folder[];
    const response: LoaderData = { folders };
    return json(response);
  } catch (error) {
    return handleLoaderError(error);
  }
};

const FoldersLayout: FC = () => {
  const { folders } = useLoaderData<LoaderData>();

  const folderNavigationStates: FolderNavigationState[] = useMemo(() => {
    return folders.reduce((acc, current) => {
      const state: FolderNavigationState = {
        data: current,
        opened: false, // TODO: 開閉状態を永続化
      };
      return [...acc, state];
    }, [] as FolderNavigationState[]);
  }, [folders]);

  const rootFolderNavigationStates: FolderNavigationState[] = useMemo(() => {
    return folderNavigationStates.filter(
      (v) => v.data.parent_folder_id == null
    );
  }, [folderNavigationStates]);

  return (
    <div className="flex gap-6">
      <nav className="p-4 max-w-xs">
        <FolderListNavigation
          folderStates={rootFolderNavigationStates}
          allFolderStates={folderNavigationStates}
        />
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default FoldersLayout;
