import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import {
  Outlet,
  useFetcher,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
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
import { DeleteFolderModalDialog } from '~/features/folder/components/delete-folder-modal-dialog';
import { EditFolderModalDialog } from '~/features/folder/components/edit-folder-modal-dialog';
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
  const foldersFetcher = useFetcher<FoldersLoaderData>();
  const folderDetailsFetcher = useFetcher<FoldersLoaderData>();
  const [createFolderDialogState, setCreateFolderDialogState] = useState<{
    isOpen: boolean;
    parentFolder?: Folder;
  }>({ isOpen: false });
  const [deleteFolderDialogState, setDeleteFolderDialogState] = useState<{
    folder?: Folder;
  }>({});
  const [editFolderDialogState, setEditFolderDialogState] = useState<{
    folder?: Folder;
    parentFolder?: Folder;
  }>({});
  const transitioin = useTransition();

  const folders = useMemo(() => {
    return (foldersFetcher.data?.folders ?? foldersFromLoader).sort(
      (v1, v2) => v1.id - v2.id
    );
  }, [foldersFetcher.data, foldersFromLoader]);

  const rootFolders: Folder[] = useMemo(() => {
    return folders.filter((v) => v.parent_folder_id == null);
  }, [folders]);

  return (
    <CollectionsStateContext.Provider value={{ collections }}>
      <FoldersStateContext.Provider value={{ folders }}>
        <div className="flex justify-center px-4">
          <div className="flex gap-6 w-full max-w-10xl">
            <nav className="p-4 w-96">
              <div className="flex items-center px-3 justify-end">
                <Menu position={'left'}>
                  <MenuContentItemButton
                    label="フォルダを追加"
                    icon={<FolderPlus size={'1rem'} />}
                    role={'normal'}
                    onClick={() => {
                      setCreateFolderDialogState({ isOpen: true });
                    }}
                  />
                </Menu>
              </div>
              <div className="mt-2">
                <FolderListNavigation
                  folders={rootFolders}
                  onClickCreateMenu={(parentFolder) => {
                    setCreateFolderDialogState({
                      isOpen: true,
                      parentFolder,
                    });
                  }}
                  onClickDeleteMenu={(folder) => {
                    setDeleteFolderDialogState({
                      folder,
                    });
                  }}
                  onClickEditMenu={(folder) => {
                    const parentFolder = folders.find(
                      (v) => v.id === folder.parent_folder_id
                    );
                    setEditFolderDialogState({
                      folder,
                      parentFolder,
                    });
                  }}
                />
              </div>
            </nav>
            {transitioin.state === 'loading' && (
              <div className="fixed top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white drop-shadow-md rounded border border-gray-100">
                <span className="text-xs font-semibold text-gray-900">
                  読み込み中...
                </span>
              </div>
            )}
            <main className="flex-1">
              <Outlet />
            </main>
            <div
              style={{ width: '10vw', minWidth: '8rem', maxWidth: '24rem' }}
            ></div>
          </div>
        </div>
        <CreateFolderModalDialog
          collections={collections}
          isOpen={createFolderDialogState.isOpen}
          parentFolder={createFolderDialogState.parentFolder}
          onClose={() => {
            setCreateFolderDialogState({ isOpen: false });
            foldersFetcher.load('/folders');
          }}
        />
        {deleteFolderDialogState.folder != null && (
          <DeleteFolderModalDialog
            isOpen={true}
            folder={deleteFolderDialogState.folder}
            onClose={() => {
              setDeleteFolderDialogState({});
              foldersFetcher.load('/folders');
            }}
          />
        )}
        {editFolderDialogState.folder != null && (
          <EditFolderModalDialog
            collections={collections}
            isOpen={true}
            folder={editFolderDialogState.folder}
            parentFolder={editFolderDialogState.parentFolder}
            onClose={() => {
              foldersFetcher.load('/folders');
              // TODO: アプリ内の/folders/:idを更新したい
              folderDetailsFetcher.load(
                `/folders/${editFolderDialogState.folder?.id}?disableCache=true`
              );
              // folderDetailsFetcher.
              setEditFolderDialogState({});
            }}
          />
        )}
      </FoldersStateContext.Provider>
    </CollectionsStateContext.Provider>
  );
};

export default FoldersLayout;
