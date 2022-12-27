import jwtDecode from 'jwt-decode';
import type { User } from '~/domain/user';
import { ExpiredAccessToken } from '~/errors/expired-access-token';
import { Unauthorized } from '~/errors/unauthorized';
import { accessTokenCookie } from '~/features/auth/cookies';

type DecodedAccessToken = {
  aud: string;
  sub: string;
  exp: number;
  email: string;
  user_metadata: {
    avatar_url: string;
    email: string;
    name: string;
    picture: string;
  };
};

export const getRequestUser = async (request: Request): Promise<User> => {
  try {
    const cookie = request.headers.get('Cookie');
    const accessToken = await accessTokenCookie.parse(cookie);
    const decoded = jwtDecode(accessToken) as DecodedAccessToken;
    if (decoded.exp * 1000 < new Date().valueOf()) {
      throw new ExpiredAccessToken();
    }
    return {
      id: decoded.sub,
      name: decoded.user_metadata.name,
      email: decoded.user_metadata.email,
      avaterUrl: decoded.user_metadata.avatar_url,
    };
  } catch (error) {
    console.error('[ERROR] GetRequestUser: ', error);
    if (error instanceof ExpiredAccessToken) {
      throw error;
    }
    throw new Unauthorized();
  }
};
