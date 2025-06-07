import { ChevronRight } from 'lucide-react';

import { News } from '@/entities/post/news';
import { formatTime, isRecent } from '@/shared/lib/times';

interface NewsListItemProps {
  news: News;
  userRead: boolean;
}

export function NewsListItem({ news, userRead }: NewsListItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-3 hover:shadow-md transition-shadow" data-testid="news-item">
      <div className="p-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 mr-1">
            {isRecent(news.createdAt) && (
              <span className="bg-primary-400 text-white text-xs py-0.5 px-2 rounded-full">NEW</span>
            )}
            <h3
              className={`font-medium ${userRead ? 'text-gray-400' : 'text-gray-800'}  line-clamp-1`}
              data-testid="news-item-title"
            >
              {news.title}
            </h3>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span>{formatTime(news.createdAt)}</span>
            {news.commentCount > 0 && (
              <span className="ml-2 text-primary-500 font-medium">댓글 {news.commentCount}</span>
            )}
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </div>
    </div>
  );
}
