import { useMutation } from '@tanstack/react-query';

import { postNotice } from '@/features/post/api/notices';
import { postNoticeRequest } from '@/features/post/dto/postNoticeRequest';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';

export function useCreateNoticeMutation() {
  return useMutation({
    mutationFn: (req: postNoticeRequest) => postNotice(req),

    // 성공 후 캐시 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.notice],
      });
    },
  });
}
