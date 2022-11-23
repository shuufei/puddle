import { useEffect } from 'react';

export const useSetCookieIfNeeded = (endpoint: string) => {
  useEffect(() => {
    const hash = window.location.hash;
    console.log('[DEBUG] url hash: ', hash);
    const shouldSetCookie = hash.startsWith('#access_token=');
    const setCookie = async () => {
      await fetch(`${endpoint}/api/auth/set-cookie`, {
        method: 'POST',
        body: JSON.stringify({ hash }),
      });
    };
    if (shouldSetCookie) {
      setCookie();
      return;
    }
  }, [endpoint]);
};
