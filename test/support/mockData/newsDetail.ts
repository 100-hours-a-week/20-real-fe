import { NewsDetail } from '@/entities/post/newsDetail';

import { format } from 'date-fns';
import { PostComment } from '@/entities/post/postComment';

export const dummyNewsDetail: NewsDetail = {
  id: 1,
  title: '최신 뉴스1',
  summary: '뉴스 요약입니다.',
  content: '뉴스 내용입니다.',
  tag: '뉴스',
  viewCount: 0,
  likeCount: 0,
  commentCount: 30,
  userLike: false,
  imageUrl: '',
  createdAt: '2025.05.15 09:37:43',
};

export function generateDummyNewsComments(count: number): PostComment[] {
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
