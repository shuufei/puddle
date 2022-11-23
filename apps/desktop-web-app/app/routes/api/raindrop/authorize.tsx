import type { LoaderFunction } from '@remix-run/cloudflare';
import { redirect } from '@remix-run/cloudflare';

export const loader: LoaderFunction = () => {
  const clientId = RAINDROP_CLIENT_ID;
  const redirectUrl = `${ENDPOINT}/api/raindrop/access-token`;
  const redirecTo = `https://raindrop.io/oauth/authorize?redirect_uri=${redirectUrl}&client_id=${clientId}`;
  return redirect(redirecTo);
};
