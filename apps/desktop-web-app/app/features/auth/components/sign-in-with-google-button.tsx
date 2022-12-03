import type { FC } from 'react';
import { useCallback } from 'react';
import { getSupabaseForBrowser } from '~/libs/supabase/supabase-client';

export const SignInWithGoogleButton: FC<{
  supabaseConfig: {
    supabaseUrl: string;
    supabaseAnonKey: string;
    endpoint: string;
  };
}> = ({ supabaseConfig }) => {
  const { supabaseUrl, supabaseAnonKey, endpoint } = supabaseConfig;
  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabaseForBrowser(supabaseUrl, supabaseAnonKey);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${endpoint}`,
      },
    });
  }, [endpoint, supabaseAnonKey, supabaseUrl]);
  return (
    <button
      className="bg-green-600 px-3 py-2 rounded-sm text-white"
      onClick={signInWithGoogle}
    >
      sign in with google
    </button>
  );
};
