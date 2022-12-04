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

  const rootFolders: Folder[] = useMemo(() => {
    return folders.filter((v) => v.parent_folder_id == null);
  }, [folders]);

  return (
    <div className="flex gap-6">
      <nav className="p-4 w-80">
        <FolderListNavigation folders={rootFolders} allFolders={folders} />
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default FoldersLayout;
