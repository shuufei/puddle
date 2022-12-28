import { puddleAccessTokenCookie } from './cookies';

export const isEnablePuddleApp = async (request: Request): Promise<boolean> => {
  const cookie = request.headers.get('Cookie');
  const puddleAccessToken = await puddleAccessTokenCookie.parse(cookie);
  const isDisable =
    ENABLED_APP === 'false' && puddleAccessToken !== PUDDLE_ACCESS_TOKEN;
  return !isDisable;
};
