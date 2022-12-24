import type { Folder } from '~/domain/folder';
import type { User } from '~/domain/user';
import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';

export const updateFolder = async (folder: Folder, userId: User['id']) => {
  const supabase = getSupabaseForServer();
  const data = await supabase
    .from('Folders')
    .update({ ...folder })
    .eq('id', folder.id)
    .eq('user_id', userId);
  return { data };
};
