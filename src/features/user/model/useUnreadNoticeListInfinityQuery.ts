import { UnreadNotice } from '@/entities/user/unreadNotice';
import { getUserUnreadNotices } from '@/features/user/api/unreadNotice';
import { queryKeys } from '@/shared/constatns/keys';
import { useInfiniteCursorQuery } from '@/shared/lib/tanstack-query/useInfiniteCursorQuery';

export const useUnreadNoticeListInfinityQuery = (limit = 10) => {
  return useInfiniteCursorQuery<UnreadNotice>({
    queryKey: [queryKeys.notice, queryKeys.unread],
    queryFn: (pageParam) =>
      getUserUnreadNotices({
        ...pageParam,
        limit,
      }),
  });
};
