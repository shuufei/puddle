import type { LoaderFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import {
  raindropAccessTokenCookie,
  raindropRefreshTokenCookie,
  raindropTokenType,
} from '~/features/auth/cookies';

type GetAccessTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires: number;
  expires_in: number;
  token_type: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const clientId = RAINDROP_CLIENT_ID;
  const clientSecret = RAINDROP_CLIENT_SECRET;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const redirectUrl = `${ENDPOINT}/api/raindrop/access-token`;
  try {
    const accessTokenRes = await fetch(
      'https://api.raindrop.io/v1/oauth/access_token',
      {
        method: 'post',
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUrl,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const body = (await accessTokenRes.json()) as GetAccessTokenResponse;
    const options = { expires: new Date(Date.now() + body.expires_in * 1000) };
    const headers = new Headers();
    headers.append(
      'Set-Cookie',
      await raindropAccessTokenCookie.serialize(body.access_token, options)
    );
    headers.append(
      'Set-Cookie',
      await raindropRefreshTokenCookie.serialize(body.refresh_token, options)
    );
    headers.append(
      'Set-Cookie',
      await raindropTokenType.serialize(body.token_type, options)
    );
    return redirect('/', {
      headers,
    });
  } catch (error) {
    console.error('[ERROR]: ', error);
    return redirect('/');
  }
};
