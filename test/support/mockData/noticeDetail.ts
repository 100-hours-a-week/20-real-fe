import { format } from 'date-fns';

import { NoticeDetail } from '@/entities/post/noticeDetail';
import { PostComment } from '@/entities/post/postComment';

export const dummyNoticeDetail: NoticeDetail = {
  id: 1,
  title: '최신 공지1',
  author: 'kevin.joung(정현우)',
  platform: '디스코드',
  content: '공지 내용입니다.',
  summary: '공지 요약입니다.',
  tag: '공지',
  likeCount: 0,
  commentCount: 30,
  originalUrl: 'www.google.com',
  userLike: false,
  createdAt: '2025.05.15 09:37:43',
  files: [],
  images: [],
}

export function generateDummyNoticeComments(count: number): PostComment[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const index = count - i;
    return {
      id: index,
      isAuthor: true,
      nickname: 'kevin.joung(정현우)',
      content: '좋은 글이네요',
      createdAt: format(new Date(now - i * 21600000), 'yyyy.MM.dd HH:mm:ss'),
      profileUrl: '',
    };
  });
}
