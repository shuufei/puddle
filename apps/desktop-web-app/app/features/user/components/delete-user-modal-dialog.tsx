import { useNavigate } from '@remix-run/react';
import type { FC } from 'react';
import { memo } from 'react';
import { useCallback, useState } from 'react';
import { Trash2 } from 'react-feather';
import { Button } from '~/shared/components/button';
import { Dialog } from '~/shared/components/dialog';

export const DeleteUserModalDialog: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = memo(function DeleteUserModalDialog({ isOpen, onClose }) {
  const [isDeleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const deleteUser = useCallback(async () => {
    setDeleting(true);
    await fetch('/api/users/delete', { method: 'POST' });
    onClose();
    setDeleting(false);
    navigate('/');
  }, [navigate, onClose]);

  return (
    <Dialog
      isOpen={isOpen}
      title={'アカウントを削除'}
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
          Puddle上からアカウントを削除します。
          {/* <br /> */}
          アカウントを削除するとフォルダデータも削除されます。
          <br />
          この操作は取り消すことができません。
        </span>

        <div className="flex gap-1.5 mt-8">
          <Button role="danger" onClick={deleteUser} disabled={isDeleting}>
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
