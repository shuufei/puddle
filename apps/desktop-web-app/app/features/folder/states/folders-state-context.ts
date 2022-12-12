import { createContext } from 'react';
import type { Folder } from '~/domain/folder';

export type FoldersState = {
  folders: Folder[];
};

export const FoldersStateContext = createContext<FoldersState>({ folders: [] });
