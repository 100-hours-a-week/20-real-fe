import { getWikiDetail } from '@/features/wiki/api/wiki';
import { queryKeys } from '@/shared/constatns/keys';
import { useApiQuery } from '@/shared/lib/tanstack-query/useApiQuery';

export const useWikiDetailQuery = (title: string, method: 'NORMAL' | 'RANDOM' = 'NORMAL') => {
  return useApiQuery({
    queryKey: [queryKeys.wiki, title],
    queryFn: () => getWikiDetail({ title, method }),
    select: (res) => res.data,
  });
};
