import { useMutation } from '@tanstack/react-query';

import { putWiki, putWikiRequest } from '@/api/wiki';

export const useUpdateWikiMutation = () => {
  return useMutation({
    mutationFn: (params: putWikiRequest) => putWiki(params),
  });
};
