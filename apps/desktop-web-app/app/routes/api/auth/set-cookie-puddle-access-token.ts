import type { LoaderFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';
import { puddleAccessTokenCookie } from '~/features/auth/cookies';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const puddleAccessToken = url.searchParams.get('puddleAccessToken');
  if (puddleAccessToken == null) {
    return new Response(
      JSON.stringify({ message: 'puddle access token is invalid' }),
      {
        status: 400,
      }
    );
  }
  const headers = new Headers();
  headers.append(
    'Set-Cookie',
    await puddleAccessTokenCookie.serialize(puddleAccessToken, {
      expires: new Date('2023-12-31T00:00:00Z'),
    })
  );
  return redirect('/', { headers });
};
