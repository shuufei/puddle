import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { Link, useCatch, useLoaderData } from '@remix-run/react';
import type { CatchBoundaryComponent } from '@remix-run/react/dist/routeModules';
import type { FC } from 'react';
import type { Folder } from '~/domain/folder';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { getFolders } from '~/features/folder/api/get-folders.server';
import { handleLoaderError } from '~/shared/utils/handle-loader-error';

type LoaderData = {
  folders: Folder[];
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const { userId } = await getRequestUserId(request);
    const res = await getFolders(userId);
    const folders = res.data.data as Folder[];
    return json({ folders });
  } catch (error) {
    return handleLoaderError(error);
  }
};

const FoldersPage: FC = () => {
  const { folders } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1>Folders</h1>
      <ul>
        {folders.map((folder) => {
          return (
            <li key={folder.id}>
              <Link to={`/folders/${folder.id}`}>
                <p className="underline text-blue-600">{folder.title}</p>
                <p>
                  {folder.tags.map((v) => `#${v}`).join(', ')},{' '}
                  {folder.tags_or_search ? 'or' : 'and'},{' '}
                  {folder.include_important ? 'important' : '-'}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default FoldersPage;

// 仮実装
export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch();
  return (
    <div>
      <h1>Loader Error</h1>
      <p>{caught.status}</p>
    </div>
  );
};
