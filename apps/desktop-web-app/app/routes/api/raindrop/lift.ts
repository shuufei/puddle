import type { ActionFunction } from '@remix-run/cloudflare';
import {
  raindropAccessTokenCookie,
  raindropRefreshTokenCookie,
  raindropTokenExpires,
  raindropTokenType,
} from '~/features/auth/cookies';

export const action: ActionFunction = async () => {
  const headers = new Headers();
  const options = { expires: new Date() };

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
    headers,
  });
};
