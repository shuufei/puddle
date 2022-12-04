import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import type { Item } from '~/domain/raindrop/item';
import { getRequestRaindropAccessToken } from '~/features/auth/get-request-raindrop-access-token.server';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { getFolderItems } from '~/features/folder/api/get-items.server';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

type LoaderData = {
  items: Item[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { userId } = await getRequestUserId(request);
    const { accessToken } = await getRequestRaindropAccessToken(request);
    const folderId = Number(params.folderId);
    if (folderId == null || Number.isNaN(folderId)) {
      throw new Response('Not Found', {
        status: 404,
      });
    }
    const res = await getFolderItems(folderId, {
      userId,
      raindropAccessToken: accessToken,
    });
    return json({ items: res.items });
  } catch (error) {
    return handleLoaderError(error);
  }
};

const FolderPage: FC = () => {
  const { items } = useLoaderData<LoaderData>();
  return (
    <div className="p-4">
      <p>count: {items.length}</p>
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
  );
};

export default FolderPage;
