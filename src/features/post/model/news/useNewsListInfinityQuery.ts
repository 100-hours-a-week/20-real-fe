import { News } from '@/entities/post/news';
import { getNewsList } from '@/features/post/api/news';
import { queryKeys } from '@/shared/constatns/keys';
import { useInfiniteCursorQuery } from '@/shared/lib/tanstack-query/useInfiniteCursorQuery';

const useNewsListInfinityQuery = (sort: 'popular' | 'latest', limit = 10) => {
  return useInfiniteCursorQuery<News>({
    queryKey: [queryKeys.news, sort],
    queryFn: (pageParam) =>
      getNewsList({
        ...pageParam,
        sort,
        limit,
      }),
  });
};

export { useNewsListInfinityQuery };
