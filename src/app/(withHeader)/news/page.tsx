'use client';

import { Clock, Flame } from 'lucide-react';
import Link from 'next/link';

import { useNewsListInfinityQuery } from '@/features/post/model/news/useNewsListInfinityQuery';
import { useNewsListQuery } from '@/features/post/model/news/useNewsListQuery';
import { useReadNewsPersistStore } from '@/shared/model/readNewsPersistStore';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';
import { HotNewsItem } from '@/widgets/post/components/HotNewsItem';
import { NewsListItem } from '@/widgets/post/components/NewsListItem';

export default function NewsListPage() {
  const { data: hotNews } = useNewsListQuery('popular', 2);
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

  return (
    <div className="bg-gray-50 pb-16 min-h-app ">
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center mb-4">
          <Flame size={20} className="text-red-500 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">HOT News</h2>
        </div>

        <div className="max-w-app pb-4 -mx-5 px-5 flex flex-row gap-4">
          {hotNews &&
            hotNews.map((news) => (
              <div key={news.id} className="grow shrink basis-0 " onClick={() => handleNewsClick(news.id)}>
                <Link href={`/news/${news.id}`}>
                  <HotNewsItem news={news} userRead={isRead(news.id)} />
                </Link>
              </div>
            ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock size={20} className="text-primary-500 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Recently</h2>
          </div>
        </div>

        {news &&
          news.map((news) => (
            <Link key={news.id} href={`/news/${news.id}`} onClick={() => handleNewsClick(news.id)}>
              <NewsListItem news={news} userRead={isRead(news.id)} />
            </Link>
          ))}
      </div>

      <LoadingIndicator loadingRef={loadingRef} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
    </div>
  );
}
