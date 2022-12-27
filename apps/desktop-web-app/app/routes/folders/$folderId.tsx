import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import {
  useCatch,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import type { CatchBoundaryComponent } from '@remix-run/react/dist/routeModules';
import type { FC } from 'react';
import { useContext, useEffect, useMemo, useState } from 'react';
// import { useState } from 'react';
import type { Folder } from '~/domain/folder';
import type { Item } from '~/domain/raindrop/item';
import { NotFound } from '~/errors/not-found';
import { getRequestRaindropAccessToken } from '~/features/auth/get-request-raindrop-access-token.server';
import { getRequestUser } from '~/features/auth/get-request-user.server';
import { getFolderById } from '~/features/folder/api/get-folder-by-id.server';
import { getFolderItems } from '~/features/folder/api/get-items.server';
// import { getSubFoldersByParentId } from '~/features/folder/api/get-subfolders-by-parent-id.server';
// import { CreateFolderButton } from '~/features/folder/components/create-folder-button';
import { FolderConditions } from '~/features/folder/components/folder-conditions';
import type {
  CreateFolderDialogState,
  DeleteFolderDialogState,
  EditFolderDialogState,
} from '~/features/folder/components/folder-dialogs';
import { FolderDialogs } from '~/features/folder/components/folder-dialogs';
// import { FolderListNavigation } from '~/features/folder/components/folder-list-navigation';
import { FolderMenu } from '~/features/folder/components/folder-menu';
import type { GroupKey } from '~/features/folder/components/group-items-button';
import { GroupItemsButton } from '~/features/folder/components/group-items-button';
import { RaindropList } from '~/features/folder/components/raindrop-list';
import { GroupedRaindropList } from '~/features/folder/components/grouped-raindrop-list';
import type { SortKey } from '~/features/folder/components/sort-items-button';
import { SortItemsButton } from '~/features/folder/components/sort-items-button';
import { FoldersStateContext } from '~/features/folder/states/folders-state-context';
// import { Tab } from '~/shared/components/tabs/tab';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

type LoaderData = {
  folder: Folder;
  items: Item[];
  // subFolders: Folder[];
};

const DEFAULT_SORT_KEY: SortKey = 'createdDesc';
const DEFAULT_GROUP_KEY: GroupKey = 'none';

const sortItems = (items: Item[], sortKey: SortKey): Item[] => {
  switch (sortKey) {
    case 'lastUddateAsc':
      return [...items].sort(
        (v1, v2) =>
          new Date(v1.lastUpdate).valueOf() - new Date(v2.lastUpdate).valueOf()
      );
    case 'lastUddateDesc':
      return [...items].sort(
        (v1, v2) =>
          new Date(v2.lastUpdate).valueOf() - new Date(v1.lastUpdate).valueOf()
      );
    case 'important':
      return [...items].sort(
        (v1, v2) => (v2.important ? 1 : 0) - (v1.important ? 1 : 0)
      );
    case 'createdAsc':
      return [...items].sort(
        (v1, v2) =>
          new Date(v1.created).valueOf() - new Date(v2.created).valueOf()
      );
    case 'createdDesc':
    default:
      return [...items].sort(
        (v1, v2) =>
          new Date(v2.created).valueOf() - new Date(v1.created).valueOf()
      );
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { id: userId } = await getRequestUser(request);
    const { accessToken } = await getRequestRaindropAccessToken(request);
    const folderId = Number(params.folderId);
    if (folderId == null || Number.isNaN(folderId)) {
      throw new NotFound();
    }
    const [
      folderRes,
      itemsRes,
      // subFoldersRes
    ] = await Promise.all([
      getFolderById(folderId, userId),
      getFolderItems(folderId, {
        userId,
        raindropAccessToken: accessToken,
      }),
      // getSubFoldersByParentId(folderId, userId),
    ]);
    if (folderRes.data.data?.[0] == null) {
      throw new NotFound();
    }
    const response: LoaderData = {
      items: itemsRes.items,
      // subFolders: subFoldersRes.data.data as Folder[],
      folder: folderRes.data.data[0] as Folder,
    };
    return json(response);
  } catch (error) {
    return handleLoaderError(error);
  }
};

const FolderPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultSortKey =
    (searchParams.get('sort') as SortKey) ?? DEFAULT_SORT_KEY;
  const defaultGroupKey =
    (searchParams.get('group') as GroupKey) ?? DEFAULT_GROUP_KEY;

  const { folder, items } = useLoaderData<LoaderData>();
  // const [activeTab, setActiveTab] = useState<'items' | 'subfodlers'>('items');
  const [createFolderDialogState, setCreateFolderDialogState] =
    useState<CreateFolderDialogState>({ isOpen: false });
  const [deleteFolderDialogState, setDeleteFolderDialogState] =
    useState<DeleteFolderDialogState>({});
  const [editFolderDialogState, setEditFolderDialogState] =
    useState<EditFolderDialogState>({});
  const { folders } = useContext(FoldersStateContext);

  const [sortKey, setSortKey] = useState<SortKey>(defaultSortKey);
  const [groupKey, setGroupKey] = useState<GroupKey>(defaultGroupKey);

  const enableSort = useMemo(() => {
    return groupKey === 'none';
  }, [groupKey]);
  const sortedItems = useMemo(() => {
    return sortItems(items, sortKey);
  }, [items, sortKey]);

  useEffect(() => {
    setSearchParams({
      sort: sortKey,
      group: groupKey,
    });
  }, [groupKey, setSearchParams, sortKey]);

  return (
    <>
      <div className="">
        <header className="sticky top-0 bg-white px-2 pt-3 pb-2 border-b-2 border-gray-900 z-30">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {folder.title}
              </h1>
              <div className="mt-1">
                <FolderConditions folder={folder} />
              </div>
            </div>
            <FolderMenu
              position="left"
              onClickCreateMenu={() => {
                setCreateFolderDialogState({
                  isOpen: true,
                  parentFolder: folder,
                });
              }}
              onClickDeleteMenu={() => {
                const hasSubFolders =
                  folders.find((v) => v.parent_folder_id === folder.id) != null;
                setDeleteFolderDialogState({
                  folder,
                  hasSubFolders,
                });
              }}
              onClickEditMenu={() => {
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
          <div className="mt-3 flex items-center gap-1.5">
            <GroupItemsButton
              groupKey={groupKey}
              defaultGroupKey={defaultGroupKey}
              onChange={(key) => setGroupKey(key)}
            />
            <SortItemsButton
              sortKey={sortKey}
              defaultSortKey={defaultSortKey}
              disabled={!enableSort}
              onChange={(key) => setSortKey(key)}
            />
          </div>
        </header>
        <div className="mt-4 px-1 pb-8">
          {groupKey === 'none' && <RaindropList items={sortedItems} />}
          {groupKey !== 'none' && (
            <GroupedRaindropList
              items={items}
              folder={folder}
              groupKey={groupKey}
            />
          )}
        </div>
        {sortedItems.length === 0 && (
          <p className=" text-sm text-gray-600 text-center">
            アイテムがありません
          </p>
        )}
        {/* <div className="mt-6 flex gap-1 px-4">
        <Tab
          label="items"
          isActive={activeTab === 'items'}
          onClick={() => {
            setActiveTab('items');
          }}
        />
        <Tab
          label="sub folders"
          isActive={activeTab === 'subfodlers'}
          onClick={() => {
            setActiveTab('subfodlers');
          }}
        />
      </div>
      <hr className="border-gray-900 border-2 border-b-0" />
      <div hidden={activeTab !== 'items'} className={'p-2 pt-4'}>
        <ul>
          {items.map((item) => {
            return (
              <li key={item._id} className="mb-3">
                <RaindropListItem raindropItem={item} />
              </li>
            );
          })}
        </ul>
      </div>
      <div hidden={activeTab !== 'subfodlers'} className={'p-2 pt-4'}>
        {subFolders.length != 0 ? (
          <FolderListNavigation
            folders={subFolders}
            onClickCreateMenu={() => {}}
          />
        ) : (
          <div className="flex flex-col items-start gap-4">
            <span className="text-sm text-gray-500">No folders</span>
            <CreateFolderButton />
          </div>
        )}
      </div> */}
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
    </>
  );
};

export default FolderPage;

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (caught.status === 404) {
      navigate('/folders');
    }
  }, [caught.status, navigate]);

  return (
    <div className="p-4 text-center">
      <h2>
        {caught.status}: {caught.statusText}
      </h2>
    </div>
  );
};
