import type { FC } from 'react';
import type { Item } from '~/domain/raindrop/item';
import { Heart } from 'react-feather';

export const RaindropListItem: FC<{
  raindropItem: Item;
}> = ({ raindropItem }) => {
  return (
    <a href={raindropItem.link} className="flex gap-3 items-start p-2">
      <img
        src={raindropItem.cover}
        alt={raindropItem.title}
        className="w-32 h-16 object-cover border border-gray-200"
      />
      <div className="flex-1">
        <h3 className="text-sm font-semibold">{raindropItem.title}</h3>
        <p className="text-xs mt-1 text-gray-500">{raindropItem.excerpt}</p>
        <div className="flex gap-2 gap-y-0 text-xs text-gray-900 items-center flex-wrap mt-2">
          {raindropItem.tags.map((tag) => {
            return <span key={tag}>#{tag}</span>;
          })}
          {raindropItem.important && (
            <Heart size={'0.75rem'} color={'transparent'} fill={'#ef4444'} />
          )}
        </div>
      </div>
    </a>
  );
};
