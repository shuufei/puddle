import type { LoaderFunction } from '@remix-run/cloudflare';
import { json, redirect } from '@remix-run/cloudflare';
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
import type { User } from '~/domain/user';
import { ExpiredAccessToken } from '~/errors/expired-access-token';
import { refreshTokenCookie } from '~/features/auth/cookies';
import { getRequestRaindropAccessToken } from '~/features/auth/get-request-raindrop-access-token.server';
import { getRequestUser } from '~/features/auth/get-request-user.server';
import { refreshAccessToken } from '~/features/auth/refresh.server';
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
import { Profile } from '~/features/user/components/profile';
import { Button } from '~/shared/components/button';
import { Menu } from '~/shared/components/menu';
import { MenuContentItemButton } from '~/shared/components/menu/menu-content-item-button';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

export type FoldersLoaderData = {
  folders: Folder[];
  collections: Collection[];
  me: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  if (ENABLED_APP === 'false') {
    return redirect('/service-suspended');
  }
  try {
    const [user, { accessToken }] = await Promise.all([
      getRequestUser(request),
      getRequestRaindropAccessToken(request),
    ]);
    const [foldersRes, collectionsRes] = await Promise.all([
      getFolders(user.id),
      getCollections({ userId: user.id, raindropAccessToken: accessToken }),
    ]);
    const folders = foldersRes.data.data as Folder[];
    const collections = collectionsRes.collections;
    const response: FoldersLoaderData = {
      folders,
      collections,
      me: user,
    };
    return json(response);
  } catch (error) {
    if (error instanceof ExpiredAccessToken) {
      const refreshToken = await refreshTokenCookie.parse(
        request.headers.get('Cookie')
      );
      const { headers } = await refreshAccessToken(refreshToken);
      const referer = request.headers.get('referer');
      return redirect(referer ?? '/folders', { headers });
    }
    return handleLoaderError(error);
  }
};

const FoldersLayout: FC = () => {
  const {
    folders: foldersFromLoader,
    collections,
    me,
  } = useLoaderData<FoldersLoaderData>();
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
            <nav className="p-4 sm:w-64 md:w-72 lg:w-80 xl:w-96 h-screen flex flex-col justify-between gap-2 sticky top-0">
              <div className="flex-1 overflow-y-scroll">
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
                  {rootFolders.length > 0 ? (
                    <FolderListNavigation
                      folders={rootFolders}
                      onClickCreateMenu={(parentFolder) => {
                        setCreateFolderDialogState({
                          isOpen: true,
                          parentFolder,
                        });
                      }}
                      onClickDeleteMenu={(folder) => {
                        const hasSubFolders =
                          folders.find(
                            (v) => v.parent_folder_id === folder.id
                          ) != null;
                        setDeleteFolderDialogState({
                          folder,
                          hasSubFolders,
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
                  ) : (
                    <div className="flex justify-center">
                      <Button
                        onClick={() => {
                          setCreateFolderDialogState({
                            isOpen: true,
                          });
                        }}
                      >
                        <div className="flex gap-1 items-center">
                          <FolderPlus size={'1.25rem'} />
                          <span>フォルダを作成</span>
                        </div>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Profile me={me} />
            </nav>
            {transitioin.state === 'loading' && (
              <div className="fixed top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-100 drop-shadow-md rounded border border-gray-100 z-50">
                <span className="text-xs font-semibold text-gray-900">
                  読み込み中...
                </span>
              </div>
            )}
            <main className="flex-1">
              <Outlet />
            </main>
            <div className="sm:w-0 lg:w-12 xl:w-20"></div>
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
