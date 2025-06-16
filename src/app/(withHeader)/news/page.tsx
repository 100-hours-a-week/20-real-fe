import { Clock, Flame } from 'lucide-react';

import { NewsListHeader } from '@/widgets/post/components/NewsListHeader';
import { HotNewsList } from '@/widgets/post/sections/HotNewsList/HotNewsList';
import { NewsList } from '@/widgets/post/sections/NewsList';

export default function NewsListPage() {
  return (
    <div className="bg-gray-50 pb-16 min-h-app px-5 ">
      <NewsListHeader title={'인기 뉴스'} icon={<Flame size={20} className="text-red-500 mr-2" />} />
      <HotNewsList />

      <NewsListHeader title={'최신 뉴스'} icon={<Clock size={20} className="text-primary-500 mr-2" />} />
      <NewsList />
    </div>
  );
}
