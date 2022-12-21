import type { FC } from 'react';
import { useState } from 'react';
import { Folder } from 'react-feather';
import { Dialog } from '~/shared/components/dialog';

export const CreateFolderModalDialog: FC = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        open dialog
      </button>
      <Dialog
        isOpen={isOpen}
        title={'新規フォルダを作成'}
        titleIcon={<Folder size={'1.25rem'} />}
        onClose={() => {
          setOpen(false);
        }}
      >
        <input type="text" />
        <div>
          <button
            onClick={() => {
              setOpen(false);
            }}
          >
            cancel
          </button>
          <button>create</button>
        </div>
      </Dialog>
    </>
  );
};
