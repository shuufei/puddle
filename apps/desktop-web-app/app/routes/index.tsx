import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useCallback } from 'react';
import { getSupabaseForBrowser } from '~/libs/supabase-client';
import { useSetCookieIfNeeded } from '~/shared/hooks/use-set-cookie-if-needed';

type LoadData = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  endpoint: string;
};

export const loader: LoaderFunction = () => {
  const data: LoadData = {
    supabaseUrl: NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: NEXT_PUBLIC_SUPABASE_ANON_KEY,
    endpoint: ENDPOINT,
  };
  return json(data);
};

export default function Index() {
  const { supabaseUrl, supabaseAnonKey, endpoint } = useLoaderData<LoadData>();
  useSetCookieIfNeeded(endpoint);

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabaseForBrowser(supabaseUrl, supabaseAnonKey);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${endpoint}`,
      },
    });
  }, [endpoint, supabaseAnonKey, supabaseUrl]);

  const integrateRaindrop = useCallback(() => {
    location.href = '/api/raindrop/authorize';
    return;
  }, []);

  return (
    <main>
      <h1>Puddle</h1>
      <p>desktop web app</p>
      <section className="p-4">
        <h2>Auth</h2>
        <div className="flex gap-2">
          <button
            className="bg-green-600 px-3 py-2 rounded-sm text-white"
            onClick={signInWithGoogle}
          >
            sign in with google
          </button>
          <button
            className="bg-blue-600 px-3 py-2 rounded-sm text-white"
            onClick={integrateRaindrop}
          >
            integrate Raindrop
          </button>
        </div>
      </section>
    </main>
  );
}
