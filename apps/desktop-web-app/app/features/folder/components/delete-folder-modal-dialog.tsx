import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { Trash2 } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { FoldersFolderIdActionRequestBody } from '~/routes/api/folders/$folderId';
import { Button } from '~/shared/components/button';
import { Dialog } from '~/shared/components/dialog';
import { FolderConditions } from './folder-conditions';

export const DeleteFolderModalDialog: FC<{
  folder: Folder;
  isOpen: boolean;
  onClose: () => void;
}> = ({ folder, isOpen, onClose }) => {
  const [isDeleting, setDeleting] = useState(false);

  const deleteFolder = useCallback(async () => {
    setDeleting(true);
    const endpoint = window.ENV.endpoint;
    const body: FoldersFolderIdActionRequestBody = {
      method: 'DELETE',
    };
    await fetch(`${endpoint}/api/folders/${folder.id}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    onClose();
    setDeleting(false);
  }, [folder.id, onClose]);

  return (
    <Dialog
      isOpen={isOpen}
      title={'フォルダを削除'}
      titleIcon={
        <div className="text-red-700">
          <Trash2 size={'1.25rem'} />
        </div>
      }
      onClose={() => {
        onClose();
      }}
    >
      <div className="mt-4">
        <span className="text-sm text-gray-600">
          つぎのフォルダを削除します
        </span>
        <div className="flex flex-col gap-1 mt-2">
          <p className="text-md font-semibold text-gray-900">{folder.title}</p>
          <FolderConditions folder={folder} />
        </div>

        <div className="flex gap-1.5 mt-8">
          <Button role="danger" onClick={deleteFolder} disabled={isDeleting}>
            {!isDeleting ? '削除' : '削除中...'}
          </Button>
          <Button
            variant="ghost"
            role="danger"
            onClick={() => {
              onClose();
            }}
          >
            キャンセル
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
