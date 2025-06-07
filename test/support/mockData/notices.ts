import {format} from 'date-fns'

import { Notice } from '@/entities/post/notice';

export function generateDummyNoticeList(count: number): Notice[] {
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const index = count - i;
    return {
      id: index,
      title: `최신 공지 ${index}`,
      author: 'kevin.joung(정현우)',
      platform: '디스코드',
      userRead: false,
      createdAt: format(new Date(now - i * 21600000), 'yyyy.MM.dd HH:mm:ss')
    };
  });
}
