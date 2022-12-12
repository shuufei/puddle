import type { FC } from 'react';
import { memo } from 'react';
import { Heart } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';

export const FolderConditions: FC<{
  folder: Folder;
  collections: Collection[];
}> = memo(function FolderConditions({ folder, collections }) {
  const collectionTitle = collections.find(
    (v) => v._id === folder.collectionId
  )?.title;
  const condition = folder.tags_or_search ? 'OR' : 'AND';
  return (
    <div className="text-xs font-semibold text-gray-500 flex gap-x-1 gap-y-0 items-center flex-wrap">
      {collectionTitle && <span>{collectionTitle}:</span>}
      <span>{condition}:</span>
      {folder.tags.map((v) => (
        <span key={v}>{`#${v}`}</span>
      ))}
      {folder.include_important ? (
        <Heart size={'0.75rem'} color={'transparent'} fill={'#f87171'} />
      ) : null}
    </div>
  );
});
