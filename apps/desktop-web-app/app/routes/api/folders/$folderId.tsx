import type { ActionFunction } from '@remix-run/cloudflare';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { deleteFolder } from '~/features/folder/api/delete-folder.server';

export type FoldersFolderIdActionRequestBody = {
  method: 'DELETE' | 'PUT';
};

export const action: ActionFunction = async ({ request, params }) => {
  const { userId } = await getRequestUserId(request);
  const folderId = Number(params.folderId);
  if (folderId == null || Number.isNaN(folderId)) {
    return new Response(null, {
      status: 400,
    });
  }
  const body = await request.json<FoldersFolderIdActionRequestBody>();
  switch (body.method) {
    case 'DELETE':
      await deleteFolder(folderId, userId);
      return new Response(null, {
        status: 204,
      });
    default:
      return new Response(null, {
        status: 405,
      });
  }
};
