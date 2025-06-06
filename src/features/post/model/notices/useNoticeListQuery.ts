import { getNoticeList } from '@/features/post/api/notices';
import { queryKeys } from '@/shared/constatns/keys';
import { useApiQuery } from '@/shared/lib/tanstack-query/useApiQuery';

export const useNoticeListQuery = (limit = 10) => {
  return useApiQuery({
    queryKey: [queryKeys.notice, limit],
    queryFn: () => getNoticeList({ limit }),
    select: (data) => data.items,
  });
};
