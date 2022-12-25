import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { useSetCookieIfNeeded } from '~/shared/hooks/use-set-cookie-if-needed';

type LoaderData = {
  env: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    endpoint: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const data: LoaderData = {
    env: {
      supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
      endpoint: ENDPOINT,
    },
  };
  return json(data);
};

export default function Index() {
  const {
    env: { endpoint },
  } = useLoaderData<LoaderData>();
  const { authenticated } = useSetCookieIfNeeded(endpoint);
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate('/folders');
    }
  }, [authenticated, navigate]);

  return null;
}
