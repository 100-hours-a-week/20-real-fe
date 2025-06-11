import { useInfiniteQuery, UseInfiniteQueryOptions, UseInfiniteQueryResult } from '@tanstack/react-query';

import { CursorParam, CursorResponse } from '@/entities/common/base';
import { AppError } from '@/shared/errors/appError';

interface UseInfiniteCursorQueryParams<TItem> {
  queryKey: string[];
  queryFn: (params: CursorParam) => Promise<CursorResponse<TItem>>;
  options?: Omit<
    UseInfiniteQueryOptions<
      CursorResponse<TItem>, // queryFn으로 가져오는 데이터
      AppError,
      TItem[], // select 후 반환하는 데이터
      CursorResponse<TItem>, // getNextPageParam의 lastPage 타입
      string[], // query key 타입
      CursorParam | null // queryFn의 pageParam 타입
    >,
    'queryKey' | 'getNextPageParam' | 'initialPageParam'
  >;
}

export function useInfiniteCursorQuery<TItem>({
  queryKey,
  queryFn,
  options,
}: UseInfiniteCursorQueryParams<TItem>): UseInfiniteQueryResult<TItem[], AppError> {
  return useInfiniteQuery<CursorResponse<TItem>, AppError, TItem[], string[], CursorParam | null>({
    queryKey,
    queryFn: ({ pageParam }) =>
      queryFn({
        cursorId: pageParam?.cursorId ?? null,
        cursorStandard: pageParam?.cursorStandard ?? null,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.hasNext) return undefined;
      return {
        cursorId: lastPage.nextCursorId,
        cursorStandard: lastPage.nextCursorStandard,
      };
    },
    select: (data) => data.pages.flatMap((page) => page.items),
    retry: () => {
      return false;
    },
    ...options,
  });
}
