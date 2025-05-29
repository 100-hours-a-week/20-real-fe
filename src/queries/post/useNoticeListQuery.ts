import { getNoticeList } from '@/api/post';
import { queryKeys } from '@/constatns/keys';
import { useApiQuery } from '@/queries/base/useApiQuery';

export const useNoticeListQuery = (limit = 10) => {
  return useApiQuery({
    queryKey: [queryKeys.notice, limit],
    queryFn: () => getNoticeList({ limit }),
    select: (data) => data.items,
  });
};
