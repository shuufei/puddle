import type { Collection } from '~/domain/raindrop/collection';
import type { Item } from '~/domain/raindrop/item';

export type GetRaindropsResponseBody = {
  result: boolean;
  items: Item[];
  count: number;
  collectionId: Collection['id'];
};
