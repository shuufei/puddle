import type { ActionFunction } from '@remix-run/cloudflare';
import { Folder } from '~/domain/folder';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';
import { insertFolder } from '~/features/folder/api/insert-folder.server';

export type CreateFolderRequestBody = Pick<
  Folder,
  | 'title'
  | 'tags'
  | 'include_important'
  | 'collectionId'
  | 'tags_or_search'
  | 'parent_folder_id'
>;

export const action: ActionFunction = async ({ request }) => {
  const { userId } = await getRequestUserId(request);
  const body = await request.json<CreateFolderRequestBody>();
  await insertFolder({
    ...body,
    user_id: userId,
  });
  return new Response(null, {
    status: 201,
    // headers: {
    //   Location: `${ENDPOINT}/folders/`
    // }
  });
};
