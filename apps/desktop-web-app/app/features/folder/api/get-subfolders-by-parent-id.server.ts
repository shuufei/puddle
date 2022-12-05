import type { Folder } from '~/domain/folder';
import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';

export const getSubFoldersByParentId = async (
  parentId: Folder['id'],
  userId: string
) => {
  const supabase = getSupabaseForServer();
  const data = await supabase
    .from('Folders')
    .select('*')
    .eq('user_id', userId)
    .eq('parent_folder_id', parentId);
  return { data };
};
