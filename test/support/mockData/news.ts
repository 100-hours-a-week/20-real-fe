import {format} from 'date-fns'

import { News } from '@/entities/post/news';

export function generateDummyNewsList(count: number): News[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const index = count - i;
    return {
      id: index,
      title: `최신 뉴스 ${index}`,
      commentCount: i,
      todayViewCount: i,
      imageUrl: null,
      createdAt: format(new Date(now - i * 21600000), 'yyyy.MM.dd HH:mm:ss')
    };
  });
}
