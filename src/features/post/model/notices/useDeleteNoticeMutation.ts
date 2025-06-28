import { useMutation } from '@tanstack/react-query';

import { deleteNotice } from '@/features/post/api/notices';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';

export function useDeleteNoticeMutation() {
  return useMutation({
    mutationFn: (id: number) => deleteNotice(id),

    // 성공 후 캐시 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.notice],
      });
    },
  });
}
