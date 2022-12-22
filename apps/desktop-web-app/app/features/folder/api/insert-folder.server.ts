import type { Folder } from '~/domain/folder';
import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';

export const insertFolder = async (
  folder: Omit<Folder, 'id' | 'created_at'>
) => {
  const supabase = getSupabaseForServer();
  const data = await supabase.from('Folders').insert({
    ...folder,
  });
  return { data };
};
