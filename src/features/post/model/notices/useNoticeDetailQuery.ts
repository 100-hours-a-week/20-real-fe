import { getNoticeDetail } from '@/features/post/api/notices';
import { queryKeys } from '@/shared/constatns/keys';
import { useApiQuery } from '@/shared/lib/tanstack-query/useApiQuery';

const useNoticeDetailQuery = (id: string) => {
  return useApiQuery({
    queryKey: [queryKeys.notice, id],
    queryFn: () => getNoticeDetail(id),
    select: (data) => data?.data,
  });
};

export { useNoticeDetailQuery };
