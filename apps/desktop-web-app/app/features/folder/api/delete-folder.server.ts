import type { Folder } from '~/domain/folder';
import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';

export const deleteFolder = async (
  folderId: Folder['id'],
  userId: Folder['user_id']
) => {
  const supabase = getSupabaseForServer();
  const data = await supabase
    .from('Folders')
    .delete()
    .eq('id', folderId)
    .eq('user_id', userId);
  return { data };
};
