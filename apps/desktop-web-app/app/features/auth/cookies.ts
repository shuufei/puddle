import type { CookieOptions } from '@remix-run/cloudflare';
import { createCookie } from '@remix-run/cloudflare';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: true,
};

export const accessTokenCookie = createCookie('AccessToken', cookieOptions);
export const refreshTokenCookie = createCookie('RefreshToken', cookieOptions);
export const tokenTypeCookie = createCookie('TokenType', cookieOptions);

export const raindropAccessTokenCookie = createCookie(
  'RaindropAccessToken',
  cookieOptions
);
export const raindropRefreshTokenCookie = createCookie(
  'RaindropRefreshToken',
  cookieOptions
);
export const raindropTokenType = createCookie(
  'RaindropTokenType',
  cookieOptions
);
export const raindropTokenExpires = createCookie(
  'RaindropTokenExpires',
  cookieOptions
);
