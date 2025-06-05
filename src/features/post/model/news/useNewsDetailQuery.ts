import { getNewsDetail } from '@/features/post/api/news';
import { queryKeys } from '@/shared/constatns/keys';
import { useApiQuery } from '@/shared/lib/tanstack-query/useApiQuery';

const useNewsDetailQuery = (id: string) => {
  return useApiQuery({
    queryKey: [queryKeys.news, id],
    queryFn: () => getNewsDetail(id),
    select: (res) => res.data,
  });
};

export { useNewsDetailQuery };
