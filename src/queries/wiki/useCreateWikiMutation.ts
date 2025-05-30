import { useMutation } from '@tanstack/react-query';

import { postWiki } from '@/api/wiki';
import { queryKeys } from '@/constatns/keys';
import { queryClient } from '@/queries/base/queryClient';

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
