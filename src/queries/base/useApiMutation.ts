import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';

import { AppError } from '@/lib/errors/appError';

type ApiMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, AppError, TVariables>,
  'onError' | 'onSettled'
>;

export function useApiMutation<TData, TVariables>(
  options: ApiMutationOptions<TData, TVariables>,
): UseMutationResult<TData, AppError, TVariables> {
  return useMutation<TData, AppError, TVariables>(options);
}
