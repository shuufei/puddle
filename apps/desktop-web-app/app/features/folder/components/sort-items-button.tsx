import type { FC } from 'react';
import { useState } from 'react';
import { ArrowDown } from 'react-feather';
import { Popup } from '~/shared/components/popup';
import { Radio } from '~/shared/components/radio/radio';
import { RadioGroup } from '~/shared/components/radio/radio-group';

export const SORT_KEY = {
  createdDesc: '登録日時 新しい順',
  createdAsc: '登録日時 古い順',
  lastUddateDesc: '更新日時 新しい順',
  lastUddateAsc: '更新日時 古い順',
  important: '❤️',
};
export type SortKey = keyof typeof SORT_KEY;

export const SortItemsButton: FC<{
  sortKey: SortKey;
  defaultSortKey: SortKey;
  onChange: (key: SortKey) => void;
}> = ({ sortKey, defaultSortKey, onChange }) => {
  const [isOpenSortPopup, setOpenSortPopup] = useState(false);
  return (
    <Popup
      isOpen={isOpenSortPopup}
      onClose={() => {
        setOpenSortPopup(false);
      }}
      triggerButton={
        <button
          className="text-xs text-gray-900 bg-white hover:bg-gray-100 active:bg-gray-300 rounded px-1.5 py-0.5 border border-gray-300 flex items-center gap-1"
          onClick={() => {
            setOpenSortPopup(true);
          }}
        >
          <ArrowDown size={'0.8rem'} />
          {SORT_KEY[sortKey]}
        </button>
      }
    >
      <div className="pl-2 pr-8">
        <RadioGroup
          label="並び替え"
          defaultValue={defaultSortKey}
          onChange={(value) => {
            onChange(value as SortKey); // TODO: remove type assertion
          }}
        >
          {Object.entries(SORT_KEY).map(([key, value]) => {
            return (
              <Radio key={key} value={key}>
                <span className="text-xs text-gray-900 py-1 inline-block">
                  {value}
                </span>
              </Radio>
            );
          })}
        </RadioGroup>
      </div>
    </Popup>
  );
};
