'use client';

import { FormEvent, useState } from 'react';

import { PostTypes } from '@/entities/post/postType';
import { useCreateNewsCommentMutation } from '@/features/post/model/news/useCreateNewsCommentMutation';
import { useCreateNoticeCommentMutation } from '@/features/post/model/notices/useCreateNoticeCommentMutation';
import { EventName } from '@/shared/lib/firebase/eventNames';
import { firebaseLogging } from '@/shared/lib/firebase/logEvent';
import { PostCommentForm } from '@/widgets/post/components/PostCommentForm';
import { PostCommentList } from '@/widgets/post/sections/PostCommentList';

interface PostCommentSectionProps {
  type: PostTypes;
  postId: number;
  commentCount: number;
}

export function PostCommentSection({ type, postId, commentCount: initialCommentCount }: PostCommentSectionProps) {
  const { mutate: postNoticeComment } = useCreateNoticeCommentMutation();
  const { mutate: postNewsComment } = useCreateNewsCommentMutation();

  const [comment, setComment] = useState('');
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    firebaseLogging(EventName.POST_COMMENT_SEND_CLICK, {
      description: `${type}-${postId}`,
    });

    const payload = { content: comment };
    const commonOptions = {
      onSuccess: () => {
        setCommentCount(commentCount + 1);
      },
    };

    if (type === PostTypes.Notice) {
      postNoticeComment({ noticeId: postId.toString(), ...payload }, commonOptions);
    } else if (type === PostTypes.News) {
      postNewsComment({ newsId: postId.toString(), ...payload }, commonOptions);
    }

    setComment('');
  };

  return (
    <div>
      <PostCommentForm
        comment={comment}
        setComment={setComment}
        commentCount={commentCount}
        onSubmitComment={handleSubmitComment}
      />
      <PostCommentList type={type} postId={postId} onDeleteCompleteAction={() => setCommentCount(commentCount - 1)} />
    </div>
  );
}
