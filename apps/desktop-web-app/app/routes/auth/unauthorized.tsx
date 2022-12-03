import type { LoaderFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import type { FC } from 'react';
import { SignInWithGoogleButton } from '~/features/auth/components/sign-in-with-google-button';

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

const UnauthorizedPage: FC = () => {
  const { env } = useLoaderData<LoaderData>();
  return (
    <main>
      <h1>Unauthorized</h1>
      <SignInWithGoogleButton supabaseConfig={env} />
    </main>
  );
};

export default UnauthorizedPage;
