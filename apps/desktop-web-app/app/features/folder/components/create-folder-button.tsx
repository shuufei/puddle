import type { FC } from 'react';
import { Plus } from 'react-feather';

export const CreateFolderButton: FC = () => {
  return (
    <button className="flex items-center py-2 px-3 gap-1 bg-gray-900 text-white rounded-md hover:bg-gray-700 active:bg-gray-500">
      <Plus size={'1.2rem'} />
      <span className="text-sm">Create Folder</span>
    </button>
  );
};
