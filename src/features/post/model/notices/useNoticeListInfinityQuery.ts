import { UseInfiniteQueryOptions } from '@tanstack/react-query';

import { CursorParam, CursorResponse } from '@/entities/common/base';
import { Notice } from '@/entities/post/notice';
import { getNoticeList } from '@/features/post/api/notices';
import { queryKeys } from '@/shared/constatns/keys';
import { AppError } from '@/shared/errors/appError';
import { useInfiniteCursorQuery } from '@/shared/lib/tanstack-query/useInfiniteCursorQuery';

interface UseNoticeListInfinityQueryParams {
  limit?: number;
  keyword?: string;
  options?: Omit<
    UseInfiniteQueryOptions<
      CursorResponse<Notice>, // queryFn으로 가져오는 데이터
      AppError,
      Notice[], // select 후 반환하는 데이터
      CursorResponse<Notice>, // getNextPageParam의 lastPage 타입
      string[], // query key 타입
      CursorParam | null // queryFn의 pageParam 타입
    >,
    'queryKey' | 'getNextPageParam' | 'initialPageParam'
  >;
}

const useNoticeListInfinityQuery = ({
  limit = 10,
  keyword = undefined,
  options,
}: UseNoticeListInfinityQueryParams = {}) => {
  return useInfiniteCursorQuery<Notice>({
    queryKey: [queryKeys.notice, ...(keyword ? [keyword] : [])],
    queryFn: (pageParam) =>
      getNoticeList({
        ...pageParam,
        limit,
        keyword,
      }),
    options: options,
  });
};

export { useNoticeListInfinityQuery };
