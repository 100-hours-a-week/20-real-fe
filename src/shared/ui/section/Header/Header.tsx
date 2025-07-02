'use client';

import { ArrowLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { HEADER_HEIGHT } from '@/shared/constatns/ui';
import { useSidebarStore } from '@/shared/model/sidebarStore';
import { useUserPersistStore } from '@/shared/model/userPersistStore';
import { NotificationDropdown } from '@/shared/ui/section/NotificationDropdown';

import { Button } from '../../component/Button';

export function Header() {
  const router = useRouter();
  const openSidebar = useSidebarStore((state) => state.open);
  const pathname = usePathname();
  const hideBackButton = ['/chatbot', '/notices', '/news', '/wiki', '/home'].includes(pathname);
  const { isLoggedIn, isApproved } = useUserPersistStore();

  return (
    <header
      className="fixed max-w-app w-full flex items-center justify-between px-4 border-b border-gray-200 bg-white"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      {/* 왼쪽: 뒤로가기 버튼 */}
      <div className="flex items-center gap-2 min-w-24">
        {!hideBackButton && (
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft />
          </Button>
        )}
      </div>

      {/* 가운데: 타이틀 */}
      <Link href="/home" className="flex-1 flex justify-center items-center cursor-pointer">
        <h1 className="text-base font-bold text-gray-900">춘이네 비서실</h1>
      </Link>

      {/* 오른쪽: 알림 + 메뉴 버튼 */}
      <div className="flex items-center gap-2 min-w-24 justify-end">
        {isLoggedIn && isApproved && <NotificationDropdown />}
        <Button variant="ghost" size="icon" onClick={openSidebar}>
          <Menu />
        </Button>
      </div>
    </header>
  );
}
