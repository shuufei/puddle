import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare';
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
import type {
  CreateFolderDialogState,
  DeleteFolderDialogState,
  EditFolderDialogState,
} from '~/features/folder/components/folder-dialogs';
import { FolderDialogs } from '~/features/folder/components/folder-dialogs';
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

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  console.log('--- body: ', body);
  return new Response(null, { status: 204 });
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
  const [createFolderDialogState, setCreateFolderDialogState] =
    useState<CreateFolderDialogState>({ isOpen: false });
  const [deleteFolderDialogState, setDeleteFolderDialogState] =
    useState<DeleteFolderDialogState>({});
  const [editFolderDialogState, setEditFolderDialogState] =
    useState<EditFolderDialogState>({});
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
              <div className="fixed top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-100 drop-shadow-md rounded border border-gray-100">
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
        <FolderDialogs
          createFolderDialogState={createFolderDialogState}
          editFolderDialogState={editFolderDialogState}
          deleteFolderDialogState={deleteFolderDialogState}
          onCloseCreateFolderDialog={() => {
            setCreateFolderDialogState({ isOpen: false });
          }}
          onCloseEditFolderDialog={() => {
            setEditFolderDialogState({});
          }}
          onCloseDeleteFolderDialog={() => {
            setDeleteFolderDialogState({});
          }}
        />
      </FoldersStateContext.Provider>
    </CollectionsStateContext.Provider>
  );
};

export default FoldersLayout;
