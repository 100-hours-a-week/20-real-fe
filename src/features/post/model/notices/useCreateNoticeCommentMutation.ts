import { useMutation } from '@tanstack/react-query';

import { BaseResponse } from '@/entities/common/base';
import { NoticeDetail } from '@/entities/post/noticeDetail';
import { postNoticeComment } from '@/features/post/api/notices';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';

interface CreateNoticeCommentRequest {
  noticeId: string;
  content: string;
}

export function useCreateNoticeCommentMutation() {
  return useMutation({
    mutationFn: ({ noticeId, content }: CreateNoticeCommentRequest) => postNoticeComment({ noticeId, content }),

    // 성공 후 캐시 무효화 및 댓글 수 갱신
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.notice, queryKeys.comments, variables.noticeId],
      });

      queryClient.setQueryData(
        [queryKeys.notice, variables.noticeId],
        (prev: BaseResponse<NoticeDetail> | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              commentCount: prev.data.commentCount + 1,
            },
          };
        },
      );
    },
  });
}
