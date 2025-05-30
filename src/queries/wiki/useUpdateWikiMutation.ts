import { useMutation } from '@tanstack/react-query';

import { putWiki } from '@/api/wiki';

export const useUpdateWikiMutation = (id: number, html: string, ydoc: Uint8Array) => {
  return useMutation({
    mutationFn: () => putWiki({ id, html, ydoc }),
  });
};
