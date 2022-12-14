import type { ActionFunction } from '@remix-run/cloudflare';
import {
  accessTokenCookie,
  refreshTokenCookie,
  tokenTypeCookie,
} from '~/features/auth/cookies';

const parseToken = (
  hash: string
): {
  accessToken: string;
  expires: string;
  providerToken: string;
  refreshToken: string;
  tokenType: string;
} => {
  const splitted = hash.split('&');
  const accessToken = splitted[0].split('#access_token=')[1];
  const expires = splitted[1].split('expires_in=')[1];
  const providerToken = splitted[2].split('provider_token=')[1];
  const refreshToken = splitted[3].split('refresh_token=')[1];
  const tokenType = splitted[4].split('token_type=')[1];
  return {
    accessToken,
    expires,
    providerToken,
    refreshToken,
    tokenType,
  };
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.json<{ hash: string }>();
    const { accessToken, expires, refreshToken, tokenType } = parseToken(
      body.hash
    );

    const headers = new Headers();
    const sevenDaysMilliSec = 60 * 60 * 1000 * 24 * 7;
    const options = {
      // NOTE: refresh tokenの失効期限をexpiresとする(7日)。access tokenが失効したらrefreshさせる
      expires: new Date(
        Date.now() + Number(expires) * 1000 + sevenDaysMilliSec
      ),
    };

    headers.append(
      'Set-Cookie',
      await accessTokenCookie.serialize(accessToken, options)
    );
    headers.append(
      'Set-Cookie',
      await refreshTokenCookie.serialize(refreshToken, options)
    );
    headers.append(
      'Set-Cookie',
      await tokenTypeCookie.serialize(tokenType, options)
    );
    return new Response(null, {
      headers,
    });
  } catch (error) {
    const message = `failed /api/auth/set-cookie`;
    console.error(message, error);
    return new Response(JSON.stringify({ message }), {
      status: 500,
    });
  }
};
