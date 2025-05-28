import { fetcher } from '@/api/fetcher';
import { CursorParam, CursorResponse } from '@/types/common/base';
import { Wiki } from '@/types/wiki/wiki';
import { WikiDetail } from '@/types/wiki/wikiDetail';

// 위키 검색 목록
interface getWikiSearchRequest extends CursorParam {
  limit: number;
  sort?: 'TITLE' | 'LATEST';
  keyword?: string | null;
}

export const getWikiSearch = async ({
  cursorId = null,
  cursorStandard = null,
  limit = 10,
  sort = 'TITLE',
  keyword = null,
}: getWikiSearchRequest) => {
  const params = new URLSearchParams({
    ...(cursorId && { cursorId: cursorId.toString() }),
    ...(cursorStandard && { cursorStandard }),
    ...{ sort },
    ...(keyword && { keyword }),
    limit: limit.toString(),
  }).toString();

  const res = await fetcher<CursorResponse<Wiki>>(`/v1/wikis/list?${params}`, { method: 'GET' });

  if (!res || !res?.data) {
    return {
      items: [],
      hasNext: false,
      nextCursorStandard: null,
      nextCursorId: null,
    };
  }
};

// 위키 상세 조회
interface getWikiDetailRequest {
  title?: string;
  method?: 'NORMAL' | 'RANDOM';
}

export const getWikiDetail = async ({ title, method = 'NORMAL' }: getWikiDetailRequest) => {
  const params = new URLSearchParams({
    ...(title && { title }),
    ...{ method },
  }).toString();

  return await fetcher<WikiDetail>(`/v1/wikis/?${params}`, { method: 'GET' });
};

// 위키 수정
interface putWikiRequest {
  id: number;
  html: string;
}

export const putWiki = async ({ id, html }: putWikiRequest) => {
  return await fetcher(`/v1/wikis/${id}`, { method: 'PUT', body: JSON.stringify({ html }) });
};

// 위키 생성
interface postWikiRequest {
  title: string;
}

export const postWiki = async ({ title }: postWikiRequest) => {
  return await fetcher(`/v1/wikis`, { method: 'POST', body: JSON.stringify({ title }) });
};
