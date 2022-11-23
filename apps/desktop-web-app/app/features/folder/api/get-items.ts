import type { Folder } from '~/domain/folder';
import type { Collection } from '~/domain/raindrop/collection';
import type { Item } from '~/domain/raindrop/item';
import type { User } from '~/domain/user';
import type { GetRaindropsResponseBody } from '~/libs/raindrop/api-def';
import { RAINDROP_API_ENDPOINT } from '~/libs/raindrop/endpoint';
import { getAuthorizedHeader } from '~/libs/raindrop/get-authorized-header';
import { getSupabaseForServer } from '~/libs/supabase/supabase-server-client.server';

const getUrl = (
  collectionId: Collection['id'],
  search: string,
  perpage: 50,
  page?: number
) => {
  const baseUrl = `${RAINDROP_API_ENDPOINT}/raindrops/${collectionId}?search=${encodeURIComponent(
    search
  )}&perpage=${perpage}`;
  const url = page != null ? `${baseUrl}&page=${page}` : baseUrl;
  return url;
};

export const getFolderItems = async (
  folderId: Folder['id'],
  context: {
    userId: User['id'];
    raindropAccessToken: string;
  }
) => {
  const { userId, raindropAccessToken } = context;
  const supabase = getSupabaseForServer();
  const data = await supabase
    .from('Folders')
    .select('*')
    .eq('user_id', userId)
    .eq('id', folderId);
  const folder = data.data?.[0] as Folder;
  if (folder == null) {
    // TODO: あとで適切にエラーハンドリングする
    throw new Error('Not Found');
  }

  const collectionId = folder.collectionId ?? 0;
  const conditions = [
    folder.tags.map((v) => `#"${v}"`).join(' '),
    folder.include_important ? '❤️' : undefined,
    folder.tags_or_search ? 'match:OR' : undefined,
  ];
  const search = conditions.join(' ');
  const perpage = 50;

  const url = getUrl(collectionId, search, perpage);
  const headers = await getAuthorizedHeader(raindropAccessToken);
  const res = await fetch(url, {
    headers,
  });
  const body = await res.json<GetRaindropsResponseBody>();
  let items: Item[] = body.items;

  /**
   * NOTE:
   * pagination対応
   * 一旦251件以上ある場合は非対応とする
   */
  if (body.count > perpage) {
    const pageCount = Math.ceil(body.count / 50);
    const isTooManyCount = pageCount > 5;
    if (isTooManyCount) {
      console.warn(
        '[ERROR] too many items. Puddle only supports up to 250 cases. items count: ',
        body.count
      );
    }
    const correctPageCount = isTooManyCount ? 5 : pageCount;
    const pages = new Array(correctPageCount).fill(null).map((_, i) => {
      return i;
    });
    pages.shift(); // 0ページ目は取得済み
    for (const page of pages) {
      const _url = getUrl(collectionId, search, perpage, page);
      const _res = await fetch(_url, {
        headers,
      });
      const _body = await _res.json<GetRaindropsResponseBody>();
      items = [...items, ..._body.items];
    }
  }

  return { items };
};
