'use client';

import Link from 'next/link';

import { useNoticeListInfinityQuery } from '@/features/post/model/notices/useNoticeListInfinityQuery';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { ErrorHandler } from '@/shared/ui/component/ErrorHandler';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';
import { NoticeListItem } from '@/widgets/post/components/NoticeListItem';

export function NoticeList() {
  const {
    data: notices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    isError,
  } = useNoticeListInfinityQuery();
  const loadingRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isError) {
    return <ErrorHandler error={error} />;
  }

  return (
    <div>
      <div className="px-4 pb-20">
        {notices &&
          notices.map((notice) => (
            <Link key={notice.id} href={`/notices/${notice.id}`}>
              <NoticeListItem notice={notice} />
            </Link>
          ))}
      </div>

      <LoadingIndicator loadingRef={loadingRef} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} />
    </div>
  );
}
