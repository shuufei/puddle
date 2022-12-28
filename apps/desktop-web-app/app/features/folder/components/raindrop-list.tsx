import type { FC } from 'react';
import { memo } from 'react';
import type { Item } from '~/domain/raindrop/item';
import { RaindropListItem } from './raindrop-list-item';

export const RaindropList: FC<{ items: Item[] }> = memo(function RaindropList({
  items,
}) {
  return (
    <ul>
      {items.map((item) => {
        return (
          <li key={item._id} className="mb-3">
            <RaindropListItem raindropItem={item} />
          </li>
        );
      })}
    </ul>
  );
});
