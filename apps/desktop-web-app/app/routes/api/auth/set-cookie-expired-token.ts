import type { LoaderFunction } from '@remix-run/cloudflare';
import { accessTokenCookie } from '~/features/auth/cookies';

export const loader: LoaderFunction = async ({ request }) => {
  const headers = new Headers();
  const sevenDaysMilliSec = 60 * 60 * 1000 * 24 * 7;
  const options = {
    expires: new Date(Date.now() + sevenDaysMilliSec),
  };

  const accessToken = EXPIRED_ACCESS_TOKEN ?? '';

  headers.append(
    'Set-Cookie',
    await accessTokenCookie.serialize(accessToken, options)
  );
  return new Response(JSON.stringify({}), {
    headers,
    status: 200,
  });
};
