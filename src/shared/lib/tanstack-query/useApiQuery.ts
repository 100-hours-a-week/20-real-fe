import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

import { AppError } from '@/shared/errors/appError';

type ApiQueryOptions<TData, TSelect = TData> = Omit<UseQueryOptions<TData, AppError, TSelect>, 'retry' | 'onError'>;

export function useApiQuery<
  TData, // queryFn의 리턴값
  TSelect = TData, // select 사용 시 변환된 최종 값
>(options: ApiQueryOptions<TData, TSelect>): UseQueryResult<TSelect, AppError> {
  return useQuery({
    ...options,
    retry: () => {
      return false;
    },
  });
}
