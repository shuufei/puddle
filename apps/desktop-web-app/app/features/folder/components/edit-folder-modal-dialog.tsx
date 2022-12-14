import type { FC } from 'react';
import { useContext } from 'react';
import { memo } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Folder as FolderIcon } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import type { UpdateFolderRequestBody } from '~/routes/api/folders/$folderId';
import { AlertContext } from '~/shared/components/alert/alert-context';
import { Button } from '~/shared/components/button';
import { Checkbox } from '~/shared/components/checkbox';
import { Dialog } from '~/shared/components/dialog';
import { ImportantIcon } from '~/shared/components/important-icon';
import type { SelectOption } from '~/shared/components/select-box';
import { SelectBox } from '~/shared/components/select-box';
import { TextField } from '~/shared/components/text-field';
import { ALL_COLLECTION_VALUE } from './folder-form-def';

export const EditFolderModalDialog: FC<{
  collections: Collection[];
  isOpen: boolean;
  folder: Folder;
  parentFolder?: Folder;
  onClose: () => void;
}> = memo(function EditFolderModalDialog({
  collections,
  isOpen,
  folder,
  parentFolder,
  onClose,
}) {
  const defaultTags = useMemo(() => {
    return folder.tags.map((v) => `#${v}`).join(' ');
  }, [folder.tags]);

  const options: SelectOption[] = [
    {
      value: ALL_COLLECTION_VALUE,
      label: '全て',
    },
    ...collections.map((v) => {
      return {
        value: `${v._id}`,
        label: v.title,
      };
    }),
  ];
  const titleValueRef = useRef<string>(folder.title);
  const tagValueRef = useRef<string>(defaultTags);
  const [collectionId, setCollectionId] = useState<string>(
    String(folder.collectionId) ?? ALL_COLLECTION_VALUE
  );
  const [includeImportant, setIncludeImportant] = useState(
    folder.include_important
  );
  const [isUpdating, setUpdating] = useState(false);
  const { setAlert } = useContext(AlertContext);

  const editFolder = useCallback(async () => {
    try {
      setUpdating(true);
      const tags =
        tagValueRef.current
          ?.split('#')
          .map((v) => {
            return v.trim().replace(/"/g, '');
          })
          .filter((v) => v) ?? [];
      console.log(tags);
      const endpoint = window.ENV.endpoint;
      const updated: Folder = {
        ...folder,
        title: titleValueRef.current,
        collectionId:
          collectionId !== ALL_COLLECTION_VALUE
            ? Number(collectionId)
            : undefined, // TODO: validate number
        tags: tags,
        include_important: includeImportant,
        tags_or_search: false,
      };
      const body: UpdateFolderRequestBody = {
        method: 'PUT',
        folder: updated,
      };
      const res = await fetch(`${endpoint}/api/folders/${folder.id}`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      console.log(res.status);

      setAlert({
        id: String(new Date().valueOf()),
        message: 'フォルダの条件を更新しました',
        status: 'info',
      });
    } catch (error) {
      setAlert({
        id: String(new Date().valueOf()),
        message: 'フォルダの更新に失敗しました',
        status: 'error',
      });
    } finally {
      onClose();
      setUpdating(false);
    }
  }, [collectionId, folder, includeImportant, onClose, setAlert]);

  return (
    <Dialog
      isOpen={isOpen}
      title={'フォルダを編集'}
      titleIcon={<FolderIcon size={'1.25rem'} />}
      onClose={() => {
        onClose();
      }}
    >
      {parentFolder && (
        <div className="mt-2 text-xs text-gray-500 font-semibold">
          <p>./{parentFolder.title}</p>
        </div>
      )}

      <div className="mt-4">
        <TextField
          label="タイトル"
          placeholder="フォルダのタイトルを入力"
          defaultValue={folder.title}
          onChange={(value) => {
            titleValueRef.current = value;
          }}
        />
        <section className="mt-4">
          <h3 className="text-md font-semibold text-gray-900">条件</h3>
          <p className="text-xs text-gray-600">
            指定した条件にマッチする項目が、作成したフォルダに自動で追加されます
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <SelectBox
              label="コレクション"
              options={options}
              defaultValue={String(folder.collectionId)}
              onChange={setCollectionId}
            />
            <TextField
              label="タグ"
              description='#をつけてスペース区切りで指定してください: #tag #"tag name"'
              placeholder={`#tag #"tag name"`}
              defaultValue={defaultTags}
              onChange={(value) => {
                tagValueRef.current = value;
              }}
            />
            <Checkbox
              label="include important"
              defaultSelected={folder.include_important}
              onChange={setIncludeImportant}
            >
              <ImportantIcon size="1rem" />
            </Checkbox>
          </div>
        </section>
        <div className="flex gap-1.5 mt-8">
          <Button onClick={editFolder} disabled={isUpdating}>
            {!isUpdating ? '更新' : '更新中...'}
          </Button>
          <Button
            variant="ghost"
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
