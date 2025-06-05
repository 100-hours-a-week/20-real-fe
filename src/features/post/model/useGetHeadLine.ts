import { Headline } from '@/entities/common/headline';
import { PostTypes } from '@/entities/post/postType';
import { useNewsListQuery } from '@/features/post/model/news/useNewsListQuery';
import { useNoticeListInfinityQuery } from '@/features/post/model/notices/useNoticeListInfinityQuery';
import { useUserPersistStore } from '@/shared/model/userPersistStore';

export const useHeadlineData = () => {
  const { isLoggedIn, isApproved } = useUserPersistStore(); // 로그인 여부 가져오기

  const { data: news, isLoading: isLoadingNews } = useNewsListQuery('latest', 2);

  // 로그인 여부에 따라 쿼리 활성화 여부 결정
  const { data: notices, isLoading: isLoadingNotices } = useNoticeListInfinityQuery({
    limit: 2,
    options: { enabled: isLoggedIn && isApproved },
  });

  const isLoading = isLoadingNews || (isLoggedIn && isApproved && isLoadingNotices);

  const headlines = [
    ...(news?.map(
      (item): Headline => ({
        type: PostTypes.News,
        title: item.title,
        id: item.id,
      }),
    ) ?? []),

    ...(isLoggedIn && notices
      ? notices.map(
          (item): Headline => ({
            type: PostTypes.Notice,
            title: item.title,
            id: item.id,
          }),
        )
      : []),
  ];

  return { headlines, isLoading };
};
