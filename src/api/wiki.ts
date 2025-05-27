import { fetcher } from '@/api/fetcher';
import { CursorResponse } from '@/types/common/base';
import { Wiki } from '@/types/wiki/wiki';

export const getWikiSearchList = async () => {
  const res = await fetcher<CursorResponse<Wiki>>(`/v1/wikis/list`, { method: 'GET' });

  if (!res || !res?.data) {
    return {
      items: [],
      hasNext: false,
      nextCursorStandard: null,
      nextCursorId: null,
    };
  }

  return res.data;
};
