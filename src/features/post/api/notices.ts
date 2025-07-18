import { BaseResponse, CursorParam, CursorResponse } from '@/entities/common/base';
import { Notice } from '@/entities/post/notice';
import { NoticeDetail } from '@/entities/post/noticeDetail';
import { PostComment } from '@/entities/post/postComment';
import { PostLike } from '@/entities/post/postLike';
import { postNoticeRequest } from '@/features/post/dto/postNoticeRequest';
import { putNoticeRequest } from '@/features/post/dto/putNoticeRequest';
import { fetcher } from '@/shared/lib/utils/fetcher';

// 공지 리스트 조회
interface getNoticeListRequest extends CursorParam {
  limit: number;
  keyword?: string;
}

const getNoticeList = async ({
  cursorId = null,
  cursorStandard = null,
  limit = 10,
  keyword,
}: getNoticeListRequest): Promise<CursorResponse<Notice>> => {
  const params = new URLSearchParams({
    ...(cursorId && { cursorId: cursorId.toString() }),
    ...(cursorStandard && { cursorStandard }),
    ...(keyword && { keyword }),
    limit: limit.toString(),
  }).toString();

  const res = await fetcher<CursorResponse<Notice>>(`/v2/notices?${params}`, { method: 'GET' });

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

// 공지 상세 조회
const getNoticeDetail = async (noticeId: string): Promise<BaseResponse<NoticeDetail>> => {
  return await fetcher(`/v1/notices/${noticeId}`, { method: 'GET' });
};

// 공지 댓글 리스트 조회
interface getNoticeCommentListRequest extends CursorParam {
  limit: number;
  noticeId: string;
}

const getNoticesCommentList = async ({
  noticeId,
  cursorId = null,
  cursorStandard = null,
  limit = 10,
}: getNoticeCommentListRequest): Promise<CursorResponse<PostComment>> => {
  const params = new URLSearchParams({
    ...(cursorId && { cursorId: cursorId.toString() }),
    ...(cursorStandard && { cursorStandard }),
    limit: limit.toString(),
  }).toString();

  const res = await fetcher<CursorResponse<PostComment>>(`/v1/notices/${noticeId}/comments?${params}`, {
    method: 'GET',
  });

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

// 공지 댓글 작성
interface postNoticeCommentRequest {
  noticeId: string;
  content: string;
}

const postNoticeComment = async ({ noticeId, content }: postNoticeCommentRequest) => {
  return await fetcher(`/v1/notices/${noticeId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
};

// 공지 좋아요 토글
const toggleNoticeLike = async (noticeId: string): Promise<BaseResponse<PostLike>> => {
  return await fetcher(`/v1/notices/${noticeId}/likes`, { method: 'PUT' });
};

// 공지 댓글 삭제
interface deleteNoticeCommentRequest {
  noticeId: string;
  commentId: string;
}

const deleteNoticeComment = async ({ noticeId, commentId }: deleteNoticeCommentRequest) => {
  return await fetcher(`/v1/notices/${noticeId}/comments/${commentId}`, {
    method: 'DELETE',
  });
};

// 어드민 공지 생성
const postNotice = async ({ images, files, ...notice }: postNoticeRequest) => {
  const formData = new FormData();
  formData.append('notice', new Blob([JSON.stringify(notice)], { type: 'application/json' }));
  images.forEach((img) => formData.append('images', img));
  files.forEach((file) => formData.append('files', file));

  return await fetcher('/v1/notices', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
};

// 어드민 공지 편집
const putNotice = async ({ id, ...notice }: putNoticeRequest) => {
  return await fetcher(`/v1/notices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(notice),
  });
};

// 어드민 공지 삭제
const deleteNotice = async (id: number) => {
  return await fetcher(`/v1/notices/${id}`, {
    method: 'DELETE',
  });
};

export {
  getNoticeList,
  getNoticeDetail,
  getNoticesCommentList,
  toggleNoticeLike,
  postNoticeComment,
  deleteNoticeComment,
  postNotice,
  putNotice,
  deleteNotice,
};
