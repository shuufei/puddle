import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { useMemo } from 'react';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import { getRequestRaindropAccessToken } from '~/features/auth/get-request-raindrop-access-token.server';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { getCollections } from '~/features/folder/api/get-collections.server';
import { getFolders } from '~/features/folder/api/get-folders.server';
import type { FolderNavigationState } from '~/features/folder/components/folder-list-navigation';
import { FolderListNavigation } from '~/features/folder/components/folder-list-navigation';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

export type FoldersLoaderData = {
  folders: Folder[];
  collections: Collection[];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const [{ userId }, { accessToken }] = await Promise.all([
      getRequestUserId(request),
      getRequestRaindropAccessToken(request),
    ]);
    const [foldersRes, collectionsRes] = await Promise.all([
      getFolders(userId),
      getCollections({ userId, raindropAccessToken: accessToken }),
    ]);
    const folders = foldersRes.data.data as Folder[];
    const collections = collectionsRes.collections;
    const response: FoldersLoaderData = { folders, collections };
    return json(response);
  } catch (error) {
    return handleLoaderError(error);
  }
};

const FoldersLayout: FC = () => {
  const { folders } = useLoaderData<FoldersLoaderData>();

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
