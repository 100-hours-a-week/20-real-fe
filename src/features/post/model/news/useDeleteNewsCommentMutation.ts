import { useMutation } from '@tanstack/react-query';

import { BaseResponse } from '@/entities/common/base';
import { NewsDetail } from '@/entities/post/newsDetail';
import { deleteNewsComment } from '@/features/post/api/news';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';

interface DeleteNewsCommentRequest {
  newsId: string;
  commentId: string;
}

export function useDeleteNewsCommentMutation() {
  return useMutation({
    mutationFn: ({ newsId, commentId }: DeleteNewsCommentRequest) => deleteNewsComment({ newsId, commentId }),

    // 성공 후 캐시 무효화 및 댓글 수 갱신
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.news, queryKeys.comments, variables.newsId],
      });

      queryClient.setQueryData([queryKeys.news, variables.newsId], (prev: BaseResponse<NewsDetail> | undefined) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            commentCount: prev.data.commentCount - 1,
          },
        };
      });
    },
  });
}
