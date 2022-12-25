import type { ActionFunction } from '@remix-run/cloudflare';
import type { Folder } from '~/domain/folder';
import { getRequestUser } from '~/features/auth/get-request-user.server';
import { deleteFolder } from '~/features/folder/api/delete-folder.server';
import { updateFolder } from '~/features/folder/api/update-folder.server';

export type DeleteFolderRequestBody = { method: 'DELETE' };

export type UpdateFolderRequestBody = { method: 'PUT' } & {
  folder: Folder;
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id: userId } = await getRequestUser(request);
  const folderId = Number(params.folderId);
  if (folderId == null || Number.isNaN(folderId)) {
    return new Response(null, {
      status: 400,
    });
  }
  const body = await request.json<
    DeleteFolderRequestBody | UpdateFolderRequestBody
  >();
  switch (body.method) {
    case 'DELETE':
      await deleteFolder(folderId, userId);
      return new Response(null, {
        status: 204,
      });
    case 'PUT':
      await updateFolder(body.folder, userId);
      const cacheKey = `users/${userId}/folder/${folderId}/items`;
      await RAINDROP_CACHE.delete(cacheKey);
      return new Response(null, {
        status: 204,
      });
    default:
      return new Response(null, {
        status: 405,
      });
  }
};
