import type { FC } from 'react';
import { memo, useContext } from 'react';
import type { Folder } from '~/domain/folder';
import { ImportantIcon } from '~/shared/components/important-icon';
import { CollectionsStateContext } from '../states/collections-state-context';

export const FolderConditions: FC<{
  folder: Folder;
}> = memo(function FolderConditions({ folder }) {
  const { collections } = useContext(CollectionsStateContext);
  const collectionTitle = collections.find(
    (v) => v._id === folder.collectionId
  )?.title;
  return (
    <div className="text-xs font-semibold text-gray-500 flex gap-x-1 gap-y-0 items-center flex-wrap">
      {collectionTitle && <span>{collectionTitle}:</span>}
      {folder.tags.map((v) => (
        <span key={v}>{`#${v}`}</span>
      ))}
      {folder.include_important ? <ImportantIcon size="0.75rem" /> : null}
    </div>
  );
});
