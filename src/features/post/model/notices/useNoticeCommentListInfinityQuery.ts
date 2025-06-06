import { PostComment } from '@/entities/post/postComment';
import { getNoticesCommentList } from '@/features/post/api/notices';
import { queryKeys } from '@/shared/constatns/keys';
import { useInfiniteCursorQuery } from '@/shared/lib/tanstack-query/useInfiniteCursorQuery';

const useNoticeCommentListInfinityQuery = (noticeId: string, limit = 10) => {
  return useInfiniteCursorQuery<PostComment>({
    queryKey: [queryKeys.notice, queryKeys.comments, noticeId],
    queryFn: (pageParam) =>
      getNoticesCommentList({
        ...pageParam,
        noticeId,
        limit,
      }),
  });
};

export { useNoticeCommentListInfinityQuery };
