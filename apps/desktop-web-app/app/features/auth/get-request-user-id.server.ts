import { accessTokenCookie } from '~/features/auth/cookies';
import jwtDecode from 'jwt-decode';
import { Unauthorized } from '~/errors/unauthorized';

type DecodedAccessToken = {
  aud: string;
  sub: string;
  exp: number;
  email: string;
};

export const getRequestUserId = async (
  request: Request
): Promise<{ userId: string }> => {
  try {
    const cookie = request.headers.get('Cookie');
    const accessToken = await accessTokenCookie.parse(cookie);
    const decoded = jwtDecode(accessToken) as DecodedAccessToken;
    return {
      userId: decoded.sub,
    };
  } catch (error) {
    throw new Unauthorized();
  }
};
