import { ChevronRight } from 'lucide-react';

import { Notice } from '@/entities/post/notice';
import { formatTime, isRecent } from '@/shared/lib/utils/times';

import helperRyan from '../../../../assets/helper-ryan.png';
import { SafeImage } from '../../../../shared/ui/component/SafeImage';

type NoticeItemProps = {
  notice: Notice;
};

export function NoticeListItem({ notice }: NoticeItemProps) {
  const renderAvatar = () => {
    if (notice.author.includes('helper.ryan')) {
      return <SafeImage src={helperRyan} alt="helper.ryan(헬퍼라이언)" width={64} height={64} />;
    }
    const firstChar = notice.author.trim().charAt(0).toUpperCase();
    return <span className="text-sm font-bold text-gray-700">{firstChar}</span>;
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm mb-4 overflow-hidden transition-all hover:shadow-md ${
        isRecent(notice.createdAt) ? 'border-l-4 border-primary-300' : ''
      }`}
      data-testid="notice-list-item"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-semibold line-clamp-1 ${notice.userRead ? 'text-gray-400' : 'text-gray-800'}`}>
            {notice.title}
          </h3>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span>{formatTime(notice.createdAt)}</span>
          <span className="mx-2">•</span>
          <span className="text-gray-700">{notice.platform}</span>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              {renderAvatar()}
            </div>
            <span className="text-sm text-gray-600">{notice.author}</span>
          </div>

          {isRecent(notice.createdAt) && (
            <span className="text-xs py-1 px-3 bg-primary-50 text-primary-500 rounded-full">최신</span>
          )}
        </div>
      </div>
    </div>
  );
}
