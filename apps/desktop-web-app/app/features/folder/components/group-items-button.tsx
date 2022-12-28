import type { FC } from 'react';
import { memo } from 'react';
import { useState } from 'react';
import { Popup } from '~/shared/components/popup';
import { Radio } from '~/shared/components/radio/radio';
import { RadioGroup } from '~/shared/components/radio/radio-group';

export const GROUP_KEY = {
  none: '未分類',
  domain: 'ドメイン',
  subTag: 'タグ',
  lastUpdated: '最終更新日',
};
export type GroupKey = keyof typeof GROUP_KEY;

export const GroupItemsButton: FC<{
  groupKey: GroupKey;
  defaultGroupKey: GroupKey;
  onChange: (key: GroupKey) => void;
}> = memo(function GroupItemsButton({ groupKey, defaultGroupKey, onChange }) {
  const [isOpenGroupPopup, setOpenGroupPopup] = useState(false);
  return (
    <Popup
      isOpen={isOpenGroupPopup}
      onClose={() => {
        setOpenGroupPopup(false);
      }}
      triggerButton={
        <button
          className="text-xs text-gray-900 bg-white hover:bg-gray-100 active:bg-gray-300 rounded px-1.5 py-0.5 border border-gray-300 flex items-center gap-1"
          onClick={() => {
            setOpenGroupPopup(true);
          }}
        >
          グループ: {GROUP_KEY[groupKey]}
        </button>
      }
    >
      <div className="pl-2 pr-8">
        <RadioGroup
          label="グループ"
          defaultValue={defaultGroupKey}
          onChange={(value) => {
            onChange(value as GroupKey); // TODO: remove type assertion
          }}
        >
          {Object.entries(GROUP_KEY).map(([key, value]) => {
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
});
