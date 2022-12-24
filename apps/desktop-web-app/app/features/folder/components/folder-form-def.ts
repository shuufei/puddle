export const ALL_COLLECTION_VALUE = 'all';
export const MATCH = {
  and: 'and',
  or: 'or',
} as const;
export type Match = keyof typeof MATCH;
