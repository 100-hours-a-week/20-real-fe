import { CursorParam, CursorResponse } from '@/entities/common/base';
import { UnreadNotice } from '@/entities/user/unreadNotice';
import { fetcher } from '@/shared/lib/fetcher';

// 유저의 읽지않은 공지 리스트 가져오기
interface getUserUnreadNoticesRequest extends CursorParam {
  limit: number;
}

export const getUserUnreadNotices = async ({
  cursorId = null,
  cursorStandard = null,
  limit = 10,
}: getUserUnreadNoticesRequest): Promise<CursorResponse<UnreadNotice>> => {
  const params = new URLSearchParams({
    ...(cursorId && { cursorId: cursorId.toString() }),
    ...(cursorStandard && { cursorStandard }),
    limit: limit.toString(),
  }).toString();

  const res = await fetcher<CursorResponse<UnreadNotice>>(`/v1/users/notices/unread?${params}`, { method: 'GET' });

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

// 유저의 안 읽은 공지 모두 읽기
export const postUserUnreadNoticeAsRead = async () => {
  return await fetcher<void>('/v1/users/notices/read', { method: 'POST' });
};
