import type { FC } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Folder as FolderIcon } from 'react-feather';
import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import type { UpdateFolderRequestBody } from '~/routes/api/folders/$folderId';
import { Button } from '~/shared/components/button';
import { Checkbox } from '~/shared/components/checkbox';
import { Dialog } from '~/shared/components/dialog';
import { ImportantIcon } from '~/shared/components/important-icon';
import { Radio } from '~/shared/components/radio/radio';
import { RadioGroup } from '~/shared/components/radio/radio-group';
import type { SelectOption } from '~/shared/components/select-box';
import { SelectBox } from '~/shared/components/select-box';
import { TextField } from '~/shared/components/text-field';
import type { Match } from './folder-form-def';
import { ALL_COLLECTION_VALUE, MATCH } from './folder-form-def';

export const EditFolderModalDialog: FC<{
  collections: Collection[];
  isOpen: boolean;
  folder: Folder;
  parentFolder?: Folder;
  onClose: () => void;
}> = ({ collections, isOpen, folder, parentFolder, onClose }) => {
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
  const [match, setMatch] = useState<Match>(
    folder.tags_or_search ? MATCH.or : MATCH.and
  );
  const [isUpdating, setUpdating] = useState(false);

  const createFolder = useCallback(async () => {
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
      tags_or_search: match === 'or',
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
    onClose();
    setUpdating(false);
  }, [collectionId, folder, includeImportant, match, onClose]);

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
            <RadioGroup
              label="一致"
              defaultValue={folder.tags_or_search ? MATCH.or : MATCH.and}
              onChange={(value) => {
                setMatch(value as Match);
              }}
            >
              <div className="flex gap-4">
                <Radio value={MATCH.and}>AND</Radio>
                <Radio value={MATCH.or}>OR</Radio>
              </div>
            </RadioGroup>
          </div>
        </section>
        <div className="flex gap-1.5 mt-8">
          <Button onClick={createFolder} disabled={isUpdating}>
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
};
