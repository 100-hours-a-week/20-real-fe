import { NoticeList } from '@/widgets/post/sections/NoticeList';
import NoticeSearchForm from '@/widgets/post/sections/NoticeSearchForm';

export default function NoticeListPage() {
  return (
    <div className="flex flex-col bg-gray-50 min-h-app px-4 gap-6">
      <h2 className="pt-4 text-xl font-bold text-gray-800">Notice</h2>
      <NoticeSearchForm />
      <NoticeList />
    </div>
  );
}
