import type { FC } from 'react';
import { useCallback, useRef, useState } from 'react';
import { Folder as FolderIcon } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import type { CreateFolderRequestBody } from '~/routes/api/folders';
import { Button } from '~/shared/components/button';
import { Checkbox } from '~/shared/components/checkbox';
import { Dialog } from '~/shared/components/dialog';
import { ImportantIcon } from '~/shared/components/important-icon';
import type { SelectOption } from '~/shared/components/select-box';
import { SelectBox } from '~/shared/components/select-box';
import { TextField } from '~/shared/components/text-field';
import { ALL_COLLECTION_VALUE } from './folder-form-def';

export const CreateFolderModalDialog: FC<{
  collections: Collection[];
  isOpen: boolean;
  parentFolder?: Folder;
  onClose: () => void;
}> = ({ collections, isOpen, parentFolder, onClose }) => {
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
  const titleValueRef = useRef<string>();
  const tagValueRef = useRef<string>();
  const [collectionId, setCollectionId] =
    useState<string>(ALL_COLLECTION_VALUE);
  const [includeImportant, setIncludeImportant] = useState(false);
  const [isCreating, setCreating] = useState(false);

  const closeDialog = useCallback(() => {
    onClose();
    titleValueRef.current = '';
    tagValueRef.current = '';
    setCollectionId(ALL_COLLECTION_VALUE);
    setIncludeImportant(false);
  }, [onClose]);

  const createFolder = useCallback(async () => {
    setCreating(true);
    const tags =
      tagValueRef.current
        ?.split('#')
        .map((v) => {
          return v.trim().replace(/"/g, '');
        })
        .filter((v) => v) ?? [];
    console.log(tags);
    const endpoint = window.ENV.endpoint;
    const body: CreateFolderRequestBody = {
      title: titleValueRef.current ?? '', // TODO: required
      collectionId:
        collectionId !== ALL_COLLECTION_VALUE
          ? Number(collectionId)
          : undefined, // TODO: validate number
      tags: tags,
      include_important: includeImportant,
      tags_or_search: false,
      parent_folder_id: parentFolder?.id,
    };
    const res = await fetch(`${endpoint}/api/folders`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    console.log(res.status);
    closeDialog();
    setCreating(false);
  }, [closeDialog, collectionId, includeImportant, parentFolder?.id]);

  return (
    <Dialog
      isOpen={isOpen}
      title={'新規フォルダを作成'}
      titleIcon={<FolderIcon size={'1.25rem'} />}
      onClose={() => {
        closeDialog();
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
              onChange={setCollectionId}
            />
            <TextField
              label="タグ"
              description='#をつけてスペース区切りで指定してください: #tag #"tag name"'
              placeholder={`#tag #"tag name"`}
              onChange={(value) => {
                tagValueRef.current = value;
              }}
            />
            <Checkbox label="include important" onChange={setIncludeImportant}>
              <ImportantIcon size="1rem" />
            </Checkbox>
          </div>
        </section>
        <div className="flex gap-1.5 mt-8">
          <Button onClick={createFolder} disabled={isCreating}>
            {!isCreating ? '作成' : '作成中...'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              closeDialog();
            }}
          >
            キャンセル
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
