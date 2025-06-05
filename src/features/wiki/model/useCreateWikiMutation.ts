import { useMutation } from '@tanstack/react-query';

import { postWiki } from '@/features/wiki/api/wiki';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';

export const useCreateWikiMutation = (title: string) => {
  return useMutation({
    mutationFn: () => postWiki({ title }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.wiki, title],
      });
    },
  });
};
