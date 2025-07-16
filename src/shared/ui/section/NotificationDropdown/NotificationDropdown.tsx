'use client';

import { Bell, Clock, X } from 'lucide-react';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import { InfiniteData } from '@tanstack/react-query';

import { CursorResponse } from '@/entities/common/base';
import { UnreadNotice } from '@/entities/user/unreadNotice';
import { useUnreadNoticeAsReadMutation } from '@/features/user/model/useUnreadNoticeAsReadMutation';
import { useUnreadNoticeListInfinityQuery } from '@/features/user/model/useUnreadNoticeListInfinityQuery';
import { queryKeys } from '@/shared/constatns/keys';
import { queryClient } from '@/shared/lib/tanstack-query/queryClient';
import { formatTime } from '@/shared/lib/utils/times';
import { useInfiniteScrollObserver } from '@/shared/model/useInfiniteScrollObserver';
import { Button } from '@/shared/ui/component/Button';
import { LoadingIndicator } from '@/shared/ui/component/LoadingIndicator';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useUnreadNoticeListInfinityQuery();
  // 드롭다운이 열렸을 때 IntersectionObserver 등록
  const loadingRef = useInfiniteScrollObserver(
    isOpen
      ? {
          fetchNextPage,
          hasNextPage,
          isFetchingNextPage,
        }
      : undefined,
  );
  const [isReceivedNotification, setIsReceivedNotification] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { mutate: markAsRead } = useUnreadNoticeAsReadMutation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (notificationId: number) => {
    // 안 읽은 공지 쿼리데이터에서 해당 공지 제거
    queryClient.setQueryData<InfiniteData<CursorResponse<UnreadNotice>>>(
      [queryKeys.notice, queryKeys.unread],
      (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          pages: prev.pages.map((page) => ({
            ...page,
            items: page.items.filter((item) => item.id !== notificationId),
          })),
        };
      },
    );
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    markAsRead();
  };

  const handleNotificationButtonClick = () => {
    setIsOpen(!isOpen);
    setIsReceivedNotification(false);
  };

  let eventSource: EventSource | null = null;

  const connectSSE = () => {
    eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/v1/connect/notification`, {
      withCredentials: true,
    });

    const events = ['notice', 'notification'];
    events.forEach((event) => {
      eventSource?.addEventListener(event, () => {
        // 안 읽은 공지 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: [queryKeys.notice, queryKeys.unread],
        });
        setIsReceivedNotification(true);
      });
    });
  };

  useEffect(() => {
    connectSSE();
    return () => {
      eventSource?.close();
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 알림 버튼 */}
      <Button variant={'plain'} size={'icon'} onClick={handleNotificationButtonClick} className="relative ">
        <Bell className="w-6 h-6" />
        {((notifications && notifications.length > 0) || isReceivedNotification) && (
          <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
        )}
      </Button>

      {/* 드롭다운 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">안 읽은 공지</h3>
              <div className="flex items-center space-x-2">
                {notifications && notifications.length > 0 && (
                  <Button variant={'plain'} onClick={markAllAsRead}>
                    <span className="text-sm text-blue-600 hover:text-blue-800 font-medium">모두 읽음</span>
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* 안읽은 공지 리스트 */}
          <div className="max-h-64 flex flex-col overflow-y-auto">
            {isPending ? (
              <div className="px-4 py-8 text-center text-gray-500 animate-pulse">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>알림을 불러오는 중입니다...</p>
              </div>
            ) : isError ? (
              <div className="px-4 py-8 text-center text-red-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-red-300" />
                <p>
                  알림을 불러오지 못했습니다.
                  <br />
                  다시 시도해주세요.
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>모든 알림을 확인했습니다</p>
              </div>
            ) : (
              <>
                {notifications?.map((notification) => (
                  <Link
                    key={notification.id}
                    href={`/notices/${notification.id}`}
                    className="inline-block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">{notification.title}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTime(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                <LoadingIndicator
                  loadingRef={loadingRef}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
