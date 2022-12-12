import { createContext } from 'react';
import type { Collection } from '~/domain/raindrop/collection';

export type CollectionsState = {
  collections: Collection[];
};

export const CollectionsStateContext = createContext<CollectionsState>({
  collections: [],
});
