import { getSupabaseForServer } from './supabase-server-client.server';

export const getFolders = async (userId: string) => {
  const supabase = getSupabaseForServer();
  const data = await supabase.from('Folders').select('*').eq('user_id', userId);
  return { data };
};
