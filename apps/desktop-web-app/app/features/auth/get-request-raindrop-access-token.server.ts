import { raindropAccessTokenCookie } from './cookies';

export const getRequestRaindropAccessToken = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const accessToken: string = await raindropAccessTokenCookie.parse(cookie);
  return { accessToken };
};
