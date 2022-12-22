import type { FC } from 'react';
import { useCallback, useRef } from 'react';
import { useState } from 'react';
import { Folder } from 'react-feather';
import type { Collection } from '~/domain/raindrop/collection';
import { CreateFolderRequestBody } from '~/routes/api/folders';
import { Button } from '~/shared/components/button';
import { Checkbox } from '~/shared/components/checkbox';
import { Dialog } from '~/shared/components/dialog';
import { ImportantIcon } from '~/shared/components/important-icon';
import { Radio } from '~/shared/components/radio/radio';
import { RadioGroup } from '~/shared/components/radio/radio-group';
import type { SelectOption } from '~/shared/components/select-box';
import { SelectBox } from '~/shared/components/select-box';
import { TextField } from '~/shared/components/text-field';

const ALL_COLLECTION_VALUE = 'all';
const MATCH = {
  and: 'and',
  or: 'or',
} as const;
type Match = keyof typeof MATCH;

export const CreateFolderModalDialog: FC<{ collections: Collection[] }> = ({
  collections,
}) => {
  const [isOpen, setOpen] = useState(true);
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
  const [match, setMatch] = useState<Match>('and');

  const createFolder = useCallback(async () => {
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
      tags_or_search: match === 'or',
    };
    const res = await fetch(`${endpoint}/api/folders`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    console.log(res.status);
  }, [collectionId, includeImportant, match]);

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
              <Checkbox
                label="include important"
                onChange={setIncludeImportant}
              >
                <ImportantIcon size="1rem" />
              </Checkbox>
              <RadioGroup
                label="一致"
                defaultValue="and"
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
          <div className="flex gap-1 mt-8">
            <Button onClick={createFolder}>作成</Button>
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
              }}
            >
              キャンセル
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};
