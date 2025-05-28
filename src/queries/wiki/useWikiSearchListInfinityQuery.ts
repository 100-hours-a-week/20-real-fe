import { getWikiSearch } from '@/api/wiki';
import { queryKeys } from '@/constatns/keys';
import { useInfiniteCursorQuery } from '@/queries/base/useInfiniteCursorQuery';
import { Wiki } from '@/types/wiki/wiki';

export const useWikiSearchListInfinityQuery = (sort: 'TITLE' | 'LATEST', keyword: string, limit = 10) => {
  return useInfiniteCursorQuery<Wiki>({
    queryKey: [queryKeys.wiki, queryKeys.search, keyword],
    queryFn: (pageParam) =>
      getWikiSearch({
        ...pageParam,
        limit,
        sort,
        keyword,
      }),
  });
};
