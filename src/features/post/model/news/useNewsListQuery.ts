import { getNewsList } from '@/features/post/api/news';
import { queryKeys } from '@/shared/constatns/keys';
import { useApiQuery } from '@/shared/lib/tanstack-query/useApiQuery';

const useNewsListQuery = (sort: 'popular' | 'latest', limit = 10) => {
  return useApiQuery({
    queryKey: [queryKeys.news, sort, limit],
    queryFn: () => getNewsList({ limit, sort }),
    select: (data) => data.items,
  });
};

export { useNewsListQuery };
