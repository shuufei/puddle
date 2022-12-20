import type { FC } from 'react';
import { useState } from 'react';
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
