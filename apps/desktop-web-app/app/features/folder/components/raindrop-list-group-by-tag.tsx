import type { FC } from 'react';
import { useMemo } from 'react';
import type { Folder } from '~/domain/folder';
import type { Item } from '~/domain/raindrop/item';
import { RaindropList } from './raindrop-list';

type GroupedRaindropList = {
  [k: string]: Item[];
};

export const RaindropListGroupByTag: FC<{ items: Item[]; folder: Folder }> = ({
  items,
  folder,
}) => {
  const groupedByTags = useMemo(() => {
    return (
      Object.entries(
        items.reduce((acc, curr): GroupedRaindropList => {
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
        }, {} as GroupedRaindropList)
      )
        .map(([key, value]) => [key, value] as const)
        .sort((v1, v2) => {
          return v1[0].localeCompare(v2[0]);
        }) ?? []
    );
  }, [folder.tags, items]);

  return (
    <>
      {groupedByTags.map(([key, value], i) => {
        return (
          <section key={key} className={`${i === 0 ? '' : 'mt-8'}`}>
            <h2 className="text-sm font-semibold text-gray-900 pl-3">#{key}</h2>
            <div className="mt-1.5">
              <RaindropList items={value} />
            </div>
          </section>
        );
      })}
    </>
  );
};
