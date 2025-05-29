'use client';

import { CircleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useMemo } from 'react';

import { SkeletonBox } from '@/components/common/atoms/SkeletonBox';
import { ImageCarousel } from '@/components/common/molecules/ImageCarousel';
import { useNewsListQuery } from '@/queries/news/useNewsListQuery';

function SkeletonNews() {
  return (
    <div className="space-y-2">
      <SkeletonBox className="h-48 w-full rounded-xl" />
      <SkeletonBox className="h-4 w-2/3" />
    </div>
  );
}

export function NewsPanel() {
  const { data: news = [], isLoading, isError } = useNewsListQuery('latest', 5);
  const router = useRouter();

  const newsImages = useMemo(() => {
    return (
      news?.map((item, index) => ({
        id: index,
        url: item.imageUrl ?? '',
        fileName: item.imageUrl ?? '',
        title: item.title,
      })) ?? []
    );
  }, [news]);

  const handleNewsImageClick = (index: number) => {
    if (!news) return;
    router.push(`/news/${news[index].id}`);
  };

  if (isLoading) {
    return <SkeletonNews />;
  }

  if (isError || news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 py-10 bg-white rounded-xl shadow-xs">
        <CircleAlert size={30} />
        <span className="font-semibold whitespace-pre-line text-center">
          현재 연결이 원활하지 않아요.
          <br />
          잠시 후 다시 시도해주세요.
        </span>
      </div>
    );
  }

  return (
    <ImageCarousel.Root images={newsImages}>
      <div className="relative">
        <ImageCarousel.ImageList onImageClick={handleNewsImageClick} />
        <ImageCarousel.Controls />
        <ImageCarousel.ImageTitle />
      </div>
      <ImageCarousel.Indicators />
    </ImageCarousel.Root>
  );
}
