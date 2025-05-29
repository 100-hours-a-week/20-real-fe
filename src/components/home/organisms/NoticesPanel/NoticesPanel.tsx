'use client';

import { CircleAlert } from 'lucide-react';
import Link from 'next/link';

import { SkeletonBox } from '@/components/common/atoms/SkeletonBox';
import { useNoticeListQuery } from '@/queries/post/useNoticeListQuery';
import { formatTime } from '@/utils/times';

const errorMessages: Record<string, string> = {
  UNAUTHORIZED: '로그인 하고 전체 내용을 확인하세요',
  FORBIDDEN: '관리자가 회원가입을 검토 중이에요',
  UNKNOWN: '현재 연결이 원활하지 않아요.\n잠시 후 다시 시도해주세요.',
};

function SkeletonNotice() {
  return (
    <div className="px-2">
      <div className="p-4 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <SkeletonBox className="h-3 w-12" />
            <SkeletonBox className="h-3 w-1" />
            <SkeletonBox className="h-3 w-16" />
          </div>
          <SkeletonBox className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function NoticesPanel() {
  const { data: notices = [], isLoading, isError, error } = useNoticeListQuery(3);
  const message = error?.code ? errorMessages[error.code] : '';

  return (
    <div className="space-y-3 bg-white rounded-xl px-2 py-3">
      {isLoading ? (
        <>
          <SkeletonNotice />
          <SkeletonNotice />
          <SkeletonNotice />
        </>
      ) : isError && message ? (
        <div className="h-[278px] flex flex-col items-center justify-center space-y-2">
          <CircleAlert size={30} />
          <span className="font-semibold whitespace-pre-line text-center">{message}</span>
        </div>
      ) : (
        notices.map((notice, index) => (
          <div key={notice.id}>
            <Link href={`/notices/${notice.id}`} className="p-3 w-full block">
              <h3 className={`font-medium mb-1 line-clamp-1 ${notice.userRead ? 'text-gray-400' : 'text-gray-900'}`}>
                {notice.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{formatTime(notice.createdAt)}</span>
                  <span>•</span>
                  <span>{notice.platform}</span>
                </div>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{notice.author}</span>
              </div>
            </Link>
            {index !== notices.length - 1 && <hr className="border-t border-gray-200 mx-4" />}
          </div>
        ))
      )}
    </div>
  );
}
