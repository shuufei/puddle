import type { FC } from 'react';
import { useCallback } from 'react';
import { getSupabaseForBrowser } from '~/libs/supabase/supabase-client';
import googleLogo from './g-logo.png';

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
      className="bg-white px-4 py-2 rounded flex items-center gap-2 border border-gray-300 hover:bg-gray-100 active:bg-gray-300 cursor-pointer"
      style={{ cursor: 'pointer' }}
      onClick={signInWithGoogle}
    >
      <img src={googleLogo} alt="" className="w-8 h-8" />
      <span className="text-gray-900 font-semibold">Signin With Google</span>
    </button>
  );
};
