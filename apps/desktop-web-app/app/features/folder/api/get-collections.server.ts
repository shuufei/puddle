import type { Collection } from '~/domain/raindrop/collection';
import type { User } from '~/domain/user';
import type { GetCollectionsResponseBody } from '~/libs/raindrop/api-def';
import { RAINDROP_API_ENDPOINT } from '~/libs/raindrop/endpoint';
import { getAuthorizedHeader } from '~/libs/raindrop/get-authorized-header';

type GetCollectionsResponse = {
  collections: Collection[];
};

const getUrl = () => {
  const url = `${RAINDROP_API_ENDPOINT}/collections`;
  return url;
};

export const getCollections = async (context: {
  userId: User['id'];
  raindropAccessToken: string;
}): Promise<GetCollectionsResponse> => {
  const { userId, raindropAccessToken } = context;

  const cacheKey = `users/${userId}/collections`;
  const cacheData = await RAINDROP_CACHE.get<GetCollectionsResponse>(cacheKey, {
    type: 'json',
  });
  if (cacheData != null) {
    return cacheData;
  }

  const url = getUrl();
  const headers = await getAuthorizedHeader(raindropAccessToken);
  const res = await fetch(url, {
    headers,
  });
  const body = await res.json<GetCollectionsResponseBody>();
  const response: GetCollectionsResponse = {
    collections: body.items,
  };
  await RAINDROP_CACHE.put(cacheKey, JSON.stringify(response), {
    expirationTtl: 60 * 60 * 24,
  });
  return response;
};
