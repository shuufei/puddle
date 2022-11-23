import { createClient } from '@supabase/supabase-js';

export const getSupabaseForServer = () =>
  createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY);
