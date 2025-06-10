'use client';

import { useState } from 'react';

import { PostTypes } from '@/entities/post/postType';
import { useToggleNewsLikeMutation } from '@/features/post/model/news/useToggleNewsLikeMutation';
import { useToggleNoticeLikeMutation } from '@/features/post/model/notices/useToggleNoticeLikeMutation';
import { EventName } from '@/shared/lib/firebase/eventNames';
import { firebaseLogging } from '@/shared/lib/firebase/logEvent';
import { LikeButton } from '@/widgets/post/components/LikeButton';

interface PostReactionProps {
  type: PostTypes;
  postId: number;
  userLike: boolean;
  likeCount: number;
}

export function PostReaction({
  type,
  postId,
  userLike: initialUserLike,
  likeCount: initialLikeCount,
}: PostReactionProps) {
  const [userLike, setUserLike] = useState(initialUserLike);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const { mutate: toggleNoticeLike } = useToggleNoticeLikeMutation();
  const { mutate: toggleNewsLike } = useToggleNewsLikeMutation();

  const handleToggle = () => {
    const optimisticUserLike = !userLike;
    const optimisticLikeCount = likeCount + (userLike ? -1 : 1);

    // 낙관적 UI 적용
    setUserLike(optimisticUserLike);
    setLikeCount(optimisticLikeCount);

    const rollback = () => {
      // 실패 시 롤백
      setUserLike(userLike);
      setLikeCount(likeCount);
    };

    if (type === PostTypes.Notice) {
      toggleNoticeLike(
        { noticeId: postId.toString() },
        {
          onError: rollback,
          onSuccess: (res) => {
            if (res?.data) handleFirebaseLogging(res.data.userLike);
          },
        },
      );
    } else {
      toggleNewsLike(
        { newsId: postId.toString() },
        {
          onError: rollback,
          onSuccess: (res) => {
            if (res?.data) handleFirebaseLogging(res.data.userLike);
          },
        },
      );
    }
  };

  const handleFirebaseLogging = (userLike: boolean) => {
    firebaseLogging(EventName.POST_HEART_CLICK, {
      description: `${type}-${postId}-${userLike}`,
    });
  };

  return <LikeButton onClickAction={handleToggle} userLike={userLike} likeCount={likeCount} />;
}
