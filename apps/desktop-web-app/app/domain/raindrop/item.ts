import type { Collection } from './collection';

export type Item = {
  excerpt: string;
  note: string;
  type: 'article';
  cover: string;
  tags: string[];
  removed: boolean;
  _id: number;
  title: string;
  link: string;
  created: string;
  lastUpdate: string;
  important: true;
  media: { type: string; link: string }[];
  domain: string;
  sort: number;
  collectionId: Collection['id'];
};
