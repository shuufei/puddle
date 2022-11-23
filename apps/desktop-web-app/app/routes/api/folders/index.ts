import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { getFolders } from '~/libs/supabase/db.server';
import { getRequestUserId } from '~/features/auth/get-request-user-id.server';

export const loader: LoaderFunction = async ({ request }) => {
  const { userId } = await getRequestUserId(request);
  const folders = await getFolders(userId);
  return json({
    folders,
  });
};
