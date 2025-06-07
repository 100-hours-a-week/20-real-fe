'use client';

import { PostTypes } from '@/entities/post/postType';
import { useDeleteNewsCommentMutation } from '@/features/post/model/news/useDeleteNewsCommentMutation';
import { useNewsCommentListInfinityQuery } from '@/features/post/model/news/useNewsCommentListInfinityQuery';
import { useDeleteNoticeCommentMutation } from '@/features/post/model/notices/useDeleteNoticeCommentMutation';
import { useNoticeCommentListInfinityQuery } from '@/features/post/model/notices/useNoticeCommentListInfinityQuery';
import { EventName } from '@/shared/lib/firebase/eventNames';
import { firebaseLogging } from '@/shared/lib/firebase/logEvent';
import { useModal } from '@/shared/model/modalStore';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';
import { PostCommentItem } from '@/widgets/post/components/PostCommentItem';

interface PostCommentListProps {
  type: PostTypes;
  postId: number;
  onDeleteCompleteAction: () => void;
}

export function PostCommentList({ type, postId, onDeleteCompleteAction }: PostCommentListProps) {
  const { mutate: deleteNoticeComment } = useDeleteNoticeCommentMutation();
  const { mutate: deleteNewsComment } = useDeleteNewsCommentMutation();

  const noticeQuery = useNoticeCommentListInfinityQuery(postId.toString());
  const newsQuery = useNewsCommentListInfinityQuery(postId.toString());

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = type === PostTypes.Notice ? noticeQuery : newsQuery;

  const loadingRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const { openModal, closeModal } = useModal();

  // 댓글 삭제 버튼 클릭 시
  const handleDeleteComment = (commentId: number) => {
    openModal({
      title: '댓글을 삭제하시겠어요?',
      actions: [
        { label: '취소', variant: 'ghost', autoClose: true },
        {
          label: '삭제',
          variant: 'destructive',
          onClick: () => {
            firebaseLogging(EventName.POST_COMMENT_DELETE_CLICK, {
              description: `${type}-${postId}`,
            });
            if (type === PostTypes.Notice) {
              deleteNoticeComment(
                { noticeId: postId.toString(), commentId: commentId.toString() },
                { onSuccess: onDeleteCompleteAction },
              );
            } else if (type === PostTypes.News) {
              deleteNewsComment(
                { newsId: postId.toString(), commentId: commentId.toString() },
                { onSuccess: onDeleteCompleteAction },
              );
            }
            closeModal();
          },
        },
      ],
    });
  };

  return (
    <>
      <div className="border-t border-gray-100">
        {comments &&
          comments.map((comment) => (
            <PostCommentItem comment={comment} key={comment.id} onDelete={handleDeleteComment} />
          ))}
      </div>

      <LoadingIndicator loadingRef={loadingRef} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
    </>
  );
}
