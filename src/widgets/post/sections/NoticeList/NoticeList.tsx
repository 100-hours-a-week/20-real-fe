'use client';

import Link from 'next/link';

import { useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

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

  const listRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useWindowVirtualizer({
    count: notices?.length ?? 0,
    estimateSize: () => 170,
    overscan: 5,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  if (isLoading) {
    return <LoadingIndicator isLoading={isLoading} data-testid="loading-indicator" />;
  }

  if (isError) {
    return <ErrorHandler error={error} />;
  }

  return (
    <div ref={listRef} className="pb-10 px-4">
      <div
        className="pb-2"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {notices?.length === 0 && (
          <EmptyItem message="아직 작성된 공지사항이 없어요." data-testid="notice-list-empty" />
        )}
        {notices &&
          virtualizer.getVirtualItems().map((item) => {
            const notice = notices[item.index];
            return (
              <Link
                key={notice.id}
                href={`/notices/${notice.id}`}
                className="virtualized-item"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${item.size}px`,
                  transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
                }}
              >
                <NoticeListItem notice={notice} />
              </Link>
            );
          })}
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
