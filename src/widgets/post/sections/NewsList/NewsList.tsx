'use client';

import Link from 'next/link';

import { useNewsListInfinityQuery } from '@/features/post/model/news/useNewsListInfinityQuery';
import { useReadNewsPersistStore } from '@/shared/model/readNewsPersistStore';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';
import { NewsListItem } from '@/widgets/post/components/NewsListItem';

export function NewsList() {
  const { markAsRead, isRead } = useReadNewsPersistStore();

  const { data: news, fetchNextPage, hasNextPage, isFetchingNextPage } = useNewsListInfinityQuery('latest', 10);
  const loadingRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const handleNewsClick = (id: number) => {
    markAsRead(id);
  };

  if (!news) {
  }

  return (
    <>
      {news &&
        news.map((news) => (
          <Link key={news.id} href={`/news/${news.id}`} onClick={() => handleNewsClick(news.id)}>
            <NewsListItem news={news} userRead={isRead(news.id)} />
          </Link>
        ))}

      <LoadingIndicator loadingRef={loadingRef} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
    </>
  );
}
