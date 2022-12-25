import type { ActionFunction } from '@remix-run/cloudflare';
import {
  accessTokenCookie,
  refreshTokenCookie,
  tokenTypeCookie,
} from '~/features/auth/cookies';

export const action: ActionFunction = async () => {
  const headers = new Headers();
  const options = { expires: new Date() };

  headers.append('Set-Cookie', await accessTokenCookie.serialize('', options));
  headers.append('Set-Cookie', await refreshTokenCookie.serialize('', options));
  headers.append('Set-Cookie', await tokenTypeCookie.serialize('', options));
  return new Response(null, {
    headers,
  });
};
