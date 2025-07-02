import { NoticeList } from '@/widgets/post/sections/NoticeList';

export default function NoticeListPage() {


  return (
    <div className="bg-gray-50 min-h-app ">
      <h2 className="px-6 pt-4 pb-4 text-xl font-bold text-gray-800">Notice</h2>

      <NoticeList/>
    </div>
  );
}
