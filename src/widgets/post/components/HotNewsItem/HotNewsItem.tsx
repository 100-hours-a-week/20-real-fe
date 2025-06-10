import { News } from '@/entities/post/news';

import { SafeImage } from '../../../../shared/ui/component/SafeImage';

interface HotNewsItemProps {
  news: News;
  userRead: boolean;
}

export function HotNewsItem({ news, userRead }: HotNewsItemProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm overflow-hidden mt-1 transition-transform hover:-translate-y-1 hover:shadow-md"
      data-testid="hot-news-item"
    >
      <div className="relative w-full aspect-[3/2]">
        <SafeImage src={news.imageUrl ?? ''} alt={news.title} className="object-cover rounded-t-xl" fill />
      </div>
      <div className="p-4">
        <h3 className={`font-medium ${userRead ? 'text-gray-400' : 'text-gray-800'} line-clamp-2 h-12`}>
          {news.title}
        </h3>
      </div>
    </div>
  );
}
