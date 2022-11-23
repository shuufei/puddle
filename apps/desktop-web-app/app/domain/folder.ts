import type { Collection } from './raindrop/collection';
import type { User } from './user';

export type Folder = {
  id: number;
  created_at: string;
  title: string;
  collectionId?: Collection['id'];
  tags: string[];
  tags_or_search: boolean;
  include_important: boolean;
  parent_folder_id?: null;
  user_id: User['id'];
};
