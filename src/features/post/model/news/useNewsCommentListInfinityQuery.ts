import { PostComment } from '@/entities/post/postComment';
import { getNewsCommentList } from '@/features/post/api/news';
import { queryKeys } from '@/shared/constatns/keys';
import { useInfiniteCursorQuery } from '@/shared/lib/tanstack-query/useInfiniteCursorQuery';

const useNewsCommentListInfinityQuery = (newsId: string, limit = 10) => {
  return useInfiniteCursorQuery<PostComment>({
    queryKey: [queryKeys.news, queryKeys.comments, newsId],
    queryFn: (pageParam) =>
      getNewsCommentList({
        ...pageParam,
        newsId,
        limit,
      }),
  });
};

export { useNewsCommentListInfinityQuery };
