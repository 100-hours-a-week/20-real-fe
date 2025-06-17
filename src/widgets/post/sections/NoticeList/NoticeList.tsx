'use client';

import Link from 'next/link';

import { useNoticeListInfinityQuery } from '@/features/post/model/notices/useNoticeListInfinityQuery';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { EmptyItem } from '@/shared/ui/component/EmptyItem';
import { ErrorHandler } from '@/shared/ui/component/ErrorHandler';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';
import { NoticeListItem } from '@/widgets/post/components/NoticeListItem';

export function NoticeList() {
  const {
    data: notices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useNoticeListInfinityQuery();
  const loadingRef = useInfiniteScrollObserver({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) {
    return <LoadingIndicator isLoading={isLoading} data-testid="loading-indicator" />;
  }

  if (isError) {
    return <ErrorHandler error={error} />;
  }

  return (
    <div>
      <div className="px-4 pb-20">
        {notices?.length === 0 && (
          <EmptyItem message="아직 작성된 공지사항이 없어요." data-testid="notice-list-empty" />
        )}
        {notices &&
          notices.map((notice) => (
            <Link key={notice.id} href={`/notices/${notice.id}`}>
              <NoticeListItem notice={notice} />
            </Link>
          ))}
      </div>

      <LoadingIndicator
        loadingRef={loadingRef}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        data-testid="pagination-loading-indicator"
      />
    </div>
  );
}
