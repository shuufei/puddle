import type { FC } from 'react';
import { useMemo } from 'react';
import type { Folder } from '~/domain/folder';
import type { Item } from '~/domain/raindrop/item';
import type { GroupKey } from './group-items-button';
import { RaindropList } from './raindrop-list';

type GroupedRaindrops = {
  [k: string]: Item[];
};

export const GroupedRaindropList: FC<{
  items: Item[];
  folder: Folder;
  groupKey: GroupKey;
}> = ({ items, folder, groupKey }) => {
  const grouped: (readonly [string, Item[]])[] = useMemo(() => {
    switch (groupKey) {
      case 'subTag':
        return Object.entries(
          items.reduce((acc, curr): GroupedRaindrops => {
            const grouped = { ...acc };
            curr.tags.forEach((tag) => {
              if (folder.tags.find((v) => v === tag) != null) {
                return;
              }
              const exists = grouped[tag] != null;
              if (exists) {
                grouped[tag] = [...grouped[tag], curr];
              } else {
                grouped[tag] = [curr];
              }
            });
            return grouped;
          }, {} as GroupedRaindrops)
        )
          .map(([key, value]) => [`#${key}`, value] as const)
          .sort((v1, v2) => {
            return v1[0].localeCompare(v2[0]);
          });
      case 'domain':
        return Object.entries(
          items.reduce((acc, curr): GroupedRaindrops => {
            const grouped = { ...acc };
            const key = curr.domain;
            const exists = grouped[key] != null;
            if (exists) {
              grouped[key] = [...grouped[key], curr];
            } else {
              grouped[key] = [curr];
            }
            return grouped;
          }, {} as GroupedRaindrops)
        )
          .map(([key, value]) => [key, value] as const)
          .sort((v1, v2) => {
            return v1[0].localeCompare(v2[0]);
          });
      case 'lastUpdated':
        return Object.entries(
          items.reduce((acc, curr): GroupedRaindrops => {
            const grouped = { ...acc };
            const lastUpdate = new Date(curr.lastUpdate);
            const key = `${lastUpdate.getFullYear()}年${
              lastUpdate.getMonth() + 1
            }月${('00' + lastUpdate.getDate()).slice(-2)}日`;
            const exists = grouped[key] != null;
            if (exists) {
              grouped[key] = [...grouped[key], curr];
            } else {
              grouped[key] = [curr];
            }
            return grouped;
          }, {} as GroupedRaindrops)
        )
          .map(([key, value]) => [key, value] as const)
          .sort((v1, v2) => {
            return v1[0].localeCompare(v2[0]);
          });
      case 'none':
      default:
        return [['', items] as const];
    }
  }, [folder.tags, groupKey, items]);

  return (
    <>
      {grouped.map(([key, value], i) => {
        return (
          <section key={key} className={`${i === 0 ? '' : 'mt-8'}`}>
            <h2 className="text-sm font-semibold text-gray-900 pl-3">{key}</h2>
            <div className="mt-1.5">
              <RaindropList items={value} />
            </div>
          </section>
        );
      })}
    </>
  );
};
