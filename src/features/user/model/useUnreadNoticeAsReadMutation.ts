import { useMutation } from '@tanstack/react-query';

import { postUserUnreadNoticeAsRead } from '@/features/user/api/unreadNotice';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';

export function useUnreadNoticeAsReadMutation() {
  return useMutation({
    mutationFn: () => postUserUnreadNoticeAsRead(),

    // 성공 후 캐시 무효화 및 댓글 수 갱신
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.notice, queryKeys.unread],
      });
    },
  });
}
