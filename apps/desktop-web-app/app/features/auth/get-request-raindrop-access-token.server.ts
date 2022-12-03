import { NotIntegrateRaindrop } from '~/errors/not-integrate-raindrop';
import { raindropAccessTokenCookie, raindropTokenExpires } from './cookies';

export const getRequestRaindropAccessToken = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  const expires: string = await raindropTokenExpires.parse(cookie);
  const accessToken: string = await raindropAccessTokenCookie.parse(cookie);
  /**
   * TODO:
   * tokenがexpireならrefresh
   */
  if (new Date().valueOf() - new Date(expires).valueOf() > 0) {
    throw new NotIntegrateRaindrop();
  }
  return { accessToken };
};
