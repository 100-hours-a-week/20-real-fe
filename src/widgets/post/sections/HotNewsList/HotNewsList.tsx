'use client';

import Link from 'next/link';

import { useNewsListQuery } from '@/features/post/model/news/useNewsListQuery';
import { useReadNewsPersistStore } from '@/shared/model/readNewsPersistStore';
import { EmptyItem } from '@/shared/ui/component/EmptyItem';
import { ErrorHandler } from '@/shared/ui/component/ErrorHandler';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';
import { HotNewsItem } from '@/widgets/post/components/HotNewsItem';

export function HotNewsList() {
  const { data: news, isPending, isError, error } = useNewsListQuery('popular', 2);
  const { markAsRead, isRead } = useReadNewsPersistStore();

  const handleNewsClick = (id: number) => {
    markAsRead(id);
  };

  if (isPending) {
    return <LoadingIndicator isLoading={isPending} data-testid="hot-news-loading-indicator" />;
  }

  if (isError) {
    return <ErrorHandler error={error} />;
  }

  return (
    <div className="max-w-app pb-4 -mx-5 px-5 flex flex-row gap-4">
      {news?.length === 0 && <EmptyItem message="아직 작성된 뉴스가 없어요." data-testid="hot-news-list-empty" />}
      {news &&
        news.map((news) => (
          <div key={news.id} className="grow shrink basis-0 ">
            <Link href={`/news/${news.id}`} onClick={() => handleNewsClick(news.id)}>
              <HotNewsItem news={news} userRead={isRead(news.id)} />
            </Link>
          </div>
        ))}
    </div>
  );
}
