import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useCatch, useLoaderData } from '@remix-run/react';
import type { CatchBoundaryComponent } from '@remix-run/react/dist/routeModules';
import type { FC } from 'react';
import { useState } from 'react';
import type { Folder } from '~/domain/folder';
import type { Item } from '~/domain/raindrop/item';
import { NotFound } from '~/errors/not-found';
import { getRequestRaindropAccessToken } from '~/features/auth/get-request-raindrop-access-token.server';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { getFolderById } from '~/features/folder/api/get-folder-by-id.server';
import { getFolderItems } from '~/features/folder/api/get-items.server';
import { getSubFoldersByParentId } from '~/features/folder/api/get-subfolders-by-parent-id.server';
import { CreateFolderButton } from '~/features/folder/components/create-folder-button';
import { FolderConditions } from '~/features/folder/components/folder-conditions';
import { FolderListNavigation } from '~/features/folder/components/folder-list-navigation';
import { RaindropListItem } from '~/features/folder/components/raindrop-list-item';
import { Tab } from '~/shared/components/tabs/tab';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

type LoaderData = {
  folder: Folder;
  items: Item[];
  subFolders: Folder[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { userId } = await getRequestUserId(request);
    const { accessToken } = await getRequestRaindropAccessToken(request);
    const folderId = Number(params.folderId);
    if (folderId == null || Number.isNaN(folderId)) {
      throw new NotFound();
    }
    const [folderRes, itemsRes, subFoldersRes] = await Promise.all([
      getFolderById(folderId, userId),
      getFolderItems(folderId, {
        userId,
        raindropAccessToken: accessToken,
      }),
      getSubFoldersByParentId(folderId, userId),
    ]);
    if (folderRes.data.data?.[0] == null) {
      throw new NotFound();
    }
    const response: LoaderData = {
      items: itemsRes.items,
      subFolders: subFoldersRes.data.data as Folder[],
      folder: folderRes.data.data[0] as Folder,
    };
    return json(response);
  } catch (error) {
    return handleLoaderError(error);
  }
};

const FolderPage: FC = () => {
  const { folder, items, subFolders } = useLoaderData<LoaderData>();
  const [activeTab, setActiveTab] = useState<'items' | 'subfodlers'>('items');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900">{folder.title}</h1>
      <div className="mt-1">
        <FolderConditions folder={folder} />
      </div>
      <div className="mt-6 flex gap-1 px-4">
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
          <FolderListNavigation folders={subFolders} />
        ) : (
          <div className="flex flex-col items-start gap-4">
            <span className="text-sm text-gray-500">No folders</span>
            <CreateFolderButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderPage;

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  return (
    <div className="p-4 text-center">
      <h2>
        {caught.status}: {caught.statusText}
      </h2>
    </div>
  );
};
