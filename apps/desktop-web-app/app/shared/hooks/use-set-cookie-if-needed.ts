import { useEffect, useState } from 'react';

export const useSetCookieIfNeeded = (endpoint: string) => {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const hash = window.location.hash;
    console.log('[DEBUG] url hash: ', hash);
    const shouldSetCookie = hash.startsWith('#access_token=');
    const setCookie = async () => {
      await fetch(`${endpoint}/api/auth/set-cookie`, {
        method: 'POST',
        body: JSON.stringify({ hash }),
      });
      setAuthenticated(true);
    };
    if (shouldSetCookie) {
      setCookie();
      return;
    }
    setAuthenticated(true);
  }, [endpoint]);

  return { authenticated };
};
