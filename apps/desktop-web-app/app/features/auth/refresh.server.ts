import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';
import {
  accessTokenCookie,
  refreshTokenCookie,
  tokenTypeCookie,
} from './cookies';

export const refreshAccessToken = async (
  refreshToken: string
): Promise<{
  headers: Headers;
}> => {
  const headers = new Headers();
  const supabase = getSupabaseForServer();
  console.log('--- REFRESH TOKEN ---');
  const refreshResponse = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (refreshResponse.data.session == null) {
    throw new Error('data.session is undefined in refreshToken');
  }
  if (refreshResponse.error != null) {
    console.error(refreshResponse.error);
    throw new Error('failed refresh token');
  }

  // TODO: set-cookieと処理を共通化
  const sevenDaysMilliSec = 60 * 60 * 1000 * 24 * 7;
  const options = {
    expires: new Date(
      Date.now() +
        Number(refreshResponse.data.session.expires_in) * 1000 +
        sevenDaysMilliSec
    ),
  };
  headers.append(
    'Set-Cookie',
    await accessTokenCookie.serialize(
      refreshResponse.data.session.access_token,
      options
    )
  );
  headers.append(
    'Set-Cookie',
    await refreshTokenCookie.serialize(
      refreshResponse.data.session.refresh_token,
      options
    )
  );
  headers.append(
    'Set-Cookie',
    await tokenTypeCookie.serialize(
      refreshResponse.data.session.token_type,
      options
    )
  );
  return {
    headers,
  };
};
