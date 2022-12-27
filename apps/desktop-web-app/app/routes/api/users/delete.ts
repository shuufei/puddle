import type { ActionFunction } from '@remix-run/cloudflare';
import {
  accessTokenCookie,
  raindropAccessTokenCookie,
  raindropRefreshTokenCookie,
  raindropTokenExpires,
  raindropTokenType,
  refreshTokenCookie,
  tokenTypeCookie,
} from '~/features/auth/cookies';
import { getRequestUser } from '~/features/auth/get-request-user.server';
import { deleteAllFolders } from '~/features/folder/api/delete-all-folders.server';
import { deleteUser } from '~/features/user/api/delete.server';

export const action: ActionFunction = async ({ request }) => {
  const { id: userId } = await getRequestUser(request);
  await deleteAllFolders(userId);
  await deleteUser(userId);
  console.log('success delete user: ', userId);
  const headers = new Headers();
  const options = { expires: new Date() };
  headers.append('Set-Cookie', await accessTokenCookie.serialize('', options));
  headers.append('Set-Cookie', await refreshTokenCookie.serialize('', options));
  headers.append('Set-Cookie', await tokenTypeCookie.serialize('', options));
  headers.append(
    'Set-Cookie',
    await raindropAccessTokenCookie.serialize('', options)
  );
  headers.append(
    'Set-Cookie',
    await raindropRefreshTokenCookie.serialize('', options)
  );
  headers.append(
    'Set-Cookie',
    await raindropTokenExpires.serialize('', options)
  );
  headers.append('Set-Cookie', await raindropTokenType.serialize('', options));
  return new Response(null, {
    status: 204,
    headers,
  });
};
