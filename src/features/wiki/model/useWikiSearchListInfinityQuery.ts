import { Wiki } from '@/entities/wiki/wiki';
import { getWikiSearch } from '@/features/wiki/api/wiki';
import { queryKeys } from '@/shared/constatns/keys';
import { useInfiniteCursorQuery } from '@/shared/lib/tanstack-query/useInfiniteCursorQuery';

export const useWikiSearchListInfinityQuery = ({
  sort,
  keyword,
  limit = 10,
}: {
  sort: 'TITLE' | 'LATEST';
  keyword?: string;
  limit?: number;
}) => {
  return useInfiniteCursorQuery<Wiki>({
    queryKey: [queryKeys.wiki, queryKeys.search, ...(keyword ? [keyword] : [])],
    queryFn: (pageParam) =>
      getWikiSearch({
        ...pageParam,
        limit,
        sort,
        keyword,
      }),
  });
};
