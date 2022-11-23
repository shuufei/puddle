import { createClient } from '@supabase/supabase-js';

export const getSupabaseForBrowser = (
  supabaseUrl: string,
  supabaseAnonKey: string
) => createClient(supabaseUrl, supabaseAnonKey);
