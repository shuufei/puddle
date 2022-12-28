import type { FC } from 'react';
import { useContext } from 'react';
import { memo } from 'react';
import { useCallback, useState } from 'react';
import { Trash2 } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { DeleteFolderRequestBody } from '~/routes/api/folders/$folderId';
import { AlertContext } from '~/shared/components/alert/alert-context';
import { Button } from '~/shared/components/button';
import { Dialog } from '~/shared/components/dialog';
import { FolderConditions } from './folder-conditions';

export const DeleteFolderModalDialog: FC<{
  folder: Folder;
  isOpen: boolean;
  hasSubFolders?: boolean;
  onClose: () => void;
}> = memo(function DeleteFolderModalDialog({
  folder,
  isOpen,
  hasSubFolders = false,
  onClose,
}) {
  const [isDeleting, setDeleting] = useState(false);
  const { setAlert } = useContext(AlertContext);

  const deleteFolder = useCallback(async () => {
    try {
      setDeleting(true);
      const endpoint = window.ENV.endpoint;
      const body: DeleteFolderRequestBody = {
        method: 'DELETE',
      };
      await fetch(`${endpoint}/api/folders/${folder.id}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setAlert({
        id: String(new Date().valueOf()),
        message: 'フォルダを削除しました',
        status: 'info',
      });
    } catch (error) {
      setAlert({
        id: String(new Date().valueOf()),
        message: 'フォルダの削除に失敗しました',
        status: 'error',
      });
    } finally {
      onClose();
      setDeleting(false);
    }
  }, [folder.id, onClose, setAlert]);

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
        {!hasSubFolders ? (
          <>
            <span className="text-sm text-gray-600">
              つぎのフォルダを削除します
            </span>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-md font-semibold text-gray-900">
                {folder.title}
              </p>
              <FolderConditions folder={folder} />
            </div>
          </>
        ) : (
          <span className="text-sm text-red-700">
            フォルダを削除する前にサブフォルダを削除してください
          </span>
        )}

        <div className="flex gap-1.5 mt-8">
          <Button
            role="danger"
            onClick={deleteFolder}
            disabled={isDeleting || hasSubFolders}
          >
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
});
