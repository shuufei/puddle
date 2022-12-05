import type { Folder } from '~/domain/folder';
import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';

export const getFolderById = async (id: Folder['id'], userId: string) => {
  const supabase = getSupabaseForServer();
  const data = await supabase
    .from('Folders')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id);
  return { data };
};
