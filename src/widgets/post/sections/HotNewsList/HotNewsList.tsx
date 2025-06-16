'use client';

import Link from 'next/link';

import { useNewsListQuery } from '@/features/post/model/news/useNewsListQuery';
import { useReadNewsPersistStore } from '@/shared/model/readNewsPersistStore';
import { HotNewsItem } from '@/widgets/post/components/HotNewsItem';

export function HotNewsList() {
  const { data: news } = useNewsListQuery('popular', 2);
  const { markAsRead, isRead } = useReadNewsPersistStore();

  const handleNewsClick = (id: number) => {
    markAsRead(id);
  };
  return (
    <div className="max-w-app pb-4 -mx-5 px-5 flex flex-row gap-4">
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
