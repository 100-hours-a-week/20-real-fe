import { putWiki, putWikiRequest } from '@/api/wiki';
import { useApiMutation } from '@/queries/base/useApiMutation';

export const useUpdateWikiMutation = () => {
  return useApiMutation({
    mutationFn: (params: putWikiRequest) => putWiki(params),
  });
};
