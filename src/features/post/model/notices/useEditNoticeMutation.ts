import { useMutation } from '@tanstack/react-query';

import { putNotice } from '@/features/post/api/notices';
import { putNoticeRequest } from '@/features/post/dto/putNoticeRequest';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';

export function useEditNoticeMutation() {
  return useMutation({
    mutationFn: (req: putNoticeRequest) => putNotice(req),

    // 성공 후 캐시 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.notice],
      });
    },
  });
}
