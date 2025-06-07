import { putWiki, putWikiRequest } from '@/features/wiki/api/wiki';
import { useApiMutation } from '@/shared/lib/tanstack-query/useApiMutation';

export const useUpdateWikiMutation = () => {
  return useApiMutation({
    mutationFn: (params: putWikiRequest) => putWiki(params),
  });
};
