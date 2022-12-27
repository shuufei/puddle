import type { User } from '~/domain/user';
import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';

export const deleteUser = async (userId: User['id']) => {
  const supabase = getSupabaseForServer();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error != null) {
    console.error('failed delete user', error);
    throw new Error('failed delete user');
  }
  return;
};
