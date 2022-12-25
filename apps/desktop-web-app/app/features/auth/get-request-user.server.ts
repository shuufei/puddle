import { accessTokenCookie } from '~/features/auth/cookies';
import jwtDecode from 'jwt-decode';
import { Unauthorized } from '~/errors/unauthorized';
import type { User } from '~/domain/user';

type DecodedAccessToken = {
  aud: string;
  sub: string;
  exp: number;
  email: string;
  user_metadata: {
    avatar_url: string;
    email: string;
    name: string;
  };
};

export const getRequestUser = async (request: Request): Promise<User> => {
  try {
    const cookie = request.headers.get('Cookie');
    const accessToken = await accessTokenCookie.parse(cookie);
    const decoded = jwtDecode(accessToken) as DecodedAccessToken;
    return {
      id: decoded.sub,
      name: decoded.user_metadata.name,
      email: decoded.user_metadata.email,
      avaterUrl: decoded.user_metadata.avatar_url,
    };
  } catch (error) {
    console.error(error);
    throw new Unauthorized();
  }
};
