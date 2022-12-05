import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useCatch, useLoaderData } from '@remix-run/react';
import type { CatchBoundaryComponent } from '@remix-run/react/dist/routeModules';
import type { FC } from 'react';
import { useState } from 'react';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import type { Item } from '~/domain/raindrop/item';
import { NotFound } from '~/errors/not-found';
import { getRequestRaindropAccessToken } from '~/features/auth/get-request-raindrop-access-token.server';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { getCollections } from '~/features/folder/api/get-collections.server';
import { getFolderById } from '~/features/folder/api/get-folder-by-id.server';
import { getFolderItems } from '~/features/folder/api/get-items.server';
import { FolderConditions } from '~/features/folder/components/folder-conditions';
import { Tab } from '~/shared/components/tabs/tab';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

type LoaderData = {
  folder: Folder;
  items: Item[];
  collections: Collection[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { userId } = await getRequestUserId(request);
    const { accessToken } = await getRequestRaindropAccessToken(request);
    const folderId = Number(params.folderId);
    if (folderId == null || Number.isNaN(folderId)) {
      throw new NotFound();
    }
    const [folderRes, itemsRes, collectionsRes] = await Promise.all([
      getFolderById(folderId, userId),
      getFolderItems(folderId, {
        userId,
        raindropAccessToken: accessToken,
      }),
      // FIXME: get collectionsがparentと重複呼び出しになるのを避けたい
      getCollections({ userId, raindropAccessToken: accessToken }),
    ]);
    if (folderRes.data.data?.[0] == null) {
      throw new NotFound();
    }
    const response: LoaderData = {
      items: itemsRes.items,
      folder: folderRes.data.data[0] as Folder,
      collections: collectionsRes.collections,
    };
    return json(response);
  } catch (error) {
    return handleLoaderError(error);
  }
};

const FolderPage: FC = () => {
  const { folder, items, collections } = useLoaderData<LoaderData>();
  const [activeTab, setActiveTab] = useState<'items' | 'subfodlers'>('items');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900">{folder.title}</h1>
      <div className="mt-1">
        <FolderConditions folder={folder} collections={collections} />
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
      <div hidden={activeTab !== 'items'} className={'p-2'}>
        <ul>
          {items.map((item) => {
            return (
              <li key={item._id} className="py-2 px-4">
                <p>{item.title}</p>
                <p className="text-gray-400">
                  {item.tags.map((v) => `#${v}`).join(', ')},{' '}
                  {item.important ? 'important' : '-'}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <div hidden={activeTab !== 'subfodlers'} className={'p-2'}>
        subfolders
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
