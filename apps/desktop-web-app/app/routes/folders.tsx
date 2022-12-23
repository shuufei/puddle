import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Outlet, useFetcher, useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { FolderPlus } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import { getRequestRaindropAccessToken } from '~/features/auth/get-request-raindrop-access-token.server';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { getCollections } from '~/features/folder/api/get-collections.server';
import { getFolders } from '~/features/folder/api/get-folders.server';
import { CreateFolderModalDialog } from '~/features/folder/components/create-folder-modal-dialog';
import { FolderListNavigation } from '~/features/folder/components/folder-list-navigation';
import { CollectionsStateContext } from '~/features/folder/states/collections-state-context';
import { FoldersStateContext } from '~/features/folder/states/folders-state-context';
import { Menu } from '~/shared/components/menu';
import { MenuContentItemButton } from '~/shared/components/menu/menu-content-item-button';
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
  const { folders: foldersFromLoader, collections } =
    useLoaderData<FoldersLoaderData>();
  const fetcher = useFetcher<FoldersLoaderData>();
  const [createFolderDialogState, setCreateFolderDialogState] = useState<{
    isOpen: boolean;
    parentFolderId?: Folder['id'];
  }>({ isOpen: false });

  const folders = useMemo(() => {
    return fetcher.data?.folders ?? foldersFromLoader;
  }, [fetcher.data, foldersFromLoader]);
  // const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  // const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const rootFolders: Folder[] = useMemo(() => {
    return folders.filter((v) => v.parent_folder_id == null);
  }, [folders]);

  return (
    <div className="flex gap-6">
      <CollectionsStateContext.Provider value={{ collections }}>
        <FoldersStateContext.Provider value={{ folders }}>
          <nav
            className="p-4"
            style={{ width: '30vw', minWidth: '18rem', maxWidth: '24rem' }}
          >
            <div className="flex items-center px-3 justify-end">
              <Menu>
                <MenuContentItemButton
                  label="フォルダを追加"
                  icon={<FolderPlus size={'1rem'} />}
                  role={'normal'}
                />
              </Menu>
            </div>
            <div className="mt-2">
              <FolderListNavigation
                folders={rootFolders}
                onClickCreateMenu={(parentFolderId) => {
                  setCreateFolderDialogState({
                    isOpen: true,
                    parentFolderId,
                  });
                }}
              />
            </div>
          </nav>
          <main className="flex-1">
            <Outlet />
            <CreateFolderModalDialog
              collections={collections}
              isOpen={createFolderDialogState.isOpen}
              parentFolderId={createFolderDialogState.parentFolderId}
              onClose={() => {
                setCreateFolderDialogState({ isOpen: false });
                fetcher.load('/folders');
              }}
            />
          </main>
        </FoldersStateContext.Provider>
      </CollectionsStateContext.Provider>
    </div>
  );
};

export default FoldersLayout;
