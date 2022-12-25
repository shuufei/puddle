import { useNavigate, useParams } from '@remix-run/react';
import type { FC } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import type { Folder } from '~/domain/folder';
import { CollectionsStateContext } from '../states/collections-state-context';
import { CreateFolderModalDialog } from './create-folder-modal-dialog';
import { DeleteFolderModalDialog } from './delete-folder-modal-dialog';
import { EditFolderModalDialog } from './edit-folder-modal-dialog';

export type CreateFolderDialogState = {
  isOpen: boolean;
  parentFolder?: Folder;
};

export type EditFolderDialogState = {
  folder?: Folder;
  parentFolder?: Folder;
};

export type DeleteFolderDialogState = {
  folder?: Folder;
  parentFolder?: Folder;
  hasSubFolders?: boolean;
};

export const FolderDialogs: FC<{
  createFolderDialogState: CreateFolderDialogState;
  editFolderDialogState: EditFolderDialogState;
  deleteFolderDialogState: DeleteFolderDialogState;
  onCloseCreateFolderDialog: () => void;
  onCloseEditFolderDialog: () => void;
  onCloseDeleteFolderDialog: () => void;
}> = ({
  createFolderDialogState,
  editFolderDialogState,
  deleteFolderDialogState,
  onCloseCreateFolderDialog,
  onCloseEditFolderDialog,
  onCloseDeleteFolderDialog,
}) => {
  const { collections } = useContext(CollectionsStateContext);
  const navigate = useNavigate();
  const params = useParams();

  const reloadData = useCallback(() => {
    const reloadPath =
      params.folderId != null ? `/folders/${params.folderId}` : '/folders';
    // NOTE:必要なデータを再ロード
    navigate(reloadPath, {
      replace: true,
    });
  }, [navigate, params.folderId]);

  return (
    <>
      <CreateFolderModalDialog
        collections={collections}
        isOpen={createFolderDialogState.isOpen}
        parentFolder={createFolderDialogState.parentFolder}
        onClose={() => {
          onCloseCreateFolderDialog();
          reloadData();
        }}
      />
      {deleteFolderDialogState.folder != null && (
        <DeleteFolderModalDialog
          isOpen={true}
          folder={deleteFolderDialogState.folder}
          hasSubFolders={deleteFolderDialogState.hasSubFolders}
          onClose={() => {
            onCloseDeleteFolderDialog();
            reloadData();
          }}
        />
      )}
      {editFolderDialogState.folder != null && (
        <EditFolderModalDialog
          collections={collections}
          isOpen={true}
          folder={editFolderDialogState.folder}
          parentFolder={editFolderDialogState.parentFolder}
          onClose={() => {
            onCloseEditFolderDialog();
            reloadData();
          }}
        />
      )}
    </>
  );
};
