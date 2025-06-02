'use client';

import { Bell, ChevronRight, LogOut, MessageCircle, Newspaper, NotebookPen, X } from 'lucide-react';
import Link from 'next/link';

import { useEffect } from 'react';

import { logout } from '@/api/auth';
import { Button } from '@/components/common/atoms/Button';
import { SafeImage } from '@/components/common/atoms/SafeImage';
import { LoginButton } from '@/components/common/organisms/LoginButton';
import { APP_WIDTH } from '@/constatns/ui';
import { EventName } from '@/lib/firebase/eventNames';
import { firebaseLogging } from '@/lib/firebase/logEvent';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useToastStore } from '@/stores/toastStore';
import { useUserPersistStore } from '@/stores/userPersistStore';

export function Sidebar() {
  const { isOpen, close } = useSidebarStore();
  const { user, isLoggedIn, cleanUser } = useUserPersistStore();
  const { showToast } = useToastStore();

  const menuItems = [
    { label: '춘비서', href: '/chatbot', icon: <MessageCircle size={18} /> },
    { label: '공지사항', href: '/notices', icon: <Bell size={18} /> },
    { label: '카테부 뉴스', href: '/news', icon: <Newspaper size={18} /> },
    { label: '위키', href: '/wiki', icon: <NotebookPen size={18} /> },
  ];

  // open 상태라면 overflow hidden하여 스크롤 차단
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOpen]);

  const handleLogout = async () => {
    firebaseLogging(EventName.LOGOUT_BUTTON_CLICK);
    const res = await logout();
    if (res && res.code === 204) {
      close();
      cleanUser();
      showToast('로그아웃 되었습니다.', 'success');
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed top-0 max-w-app w-full h-full bg-black/10 backdrop-blur-md z-40 transition-opacity duration-300"
          onClick={close}
        />
      )}

      <aside
        className={`fixed top-0 right-0 w-[300px] h-full z-50
        transition-all duration-300 ease-in-out
        ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}
        style={{ right: `max(0px, calc(50vw - ${APP_WIDTH / 2}px))` }}
      >
        {/* 글래스모피즘 배경 */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-l-3xl shadow-lg border-l border-white/20 overflow-hidden">
          {/* 배경 그라데이션 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br gradient-xs" />
          {/* 상단 조명 효과 */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/30 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col">
          {/* 헤더 */}
          <div className="flex justify-between items-center p-6">
            <h2 className="text-xl font-medium text-black/90">메뉴</h2>
            <Button
              onClick={close}
              variant="plain"
              size="icon"
              className="rounded-full bg-white backdrop-blur-sm border border-white hover:bg-black/5 transition-colors duration-200"
            >
              <X size={16} className="text-black" />
            </Button>
          </div>

          {/* 프로필 섹션 */}
          {isLoggedIn && user ? (
            <div className="mx-6 p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-md">
              <div className="flex items-center">
                <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden border border-white/30 shadow-inner">
                  <SafeImage src={user.profileUrl} alt={user.nickname} width={64} height={64} />
                </div>
                <div className="ml-3">
                  <p className="font-medium text-black/90">{user.nickname}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-6 p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-sm">
              <p className="text-black/80 font-medium mb-3 text-sm">로그인이 필요합니다</p>
              <LoginButton
                href="/login"
                className="inline-block text-center w-full bg-white/60 backdrop-blur-md text-black py-2.5 rounded-xl font-medium hover:bg-white/70 active:bg-white/50 transition-colors duration-200 border border-white/40"
                onClick={close}
              >
                로그인
              </LoginButton>
            </div>
          )}

          {/* 메뉴 네비게이션 */}
          <nav className="mt-6 px-4 flex-1">
            {menuItems.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="flex items-center justify-between text-black/80 mb-1 py-3 px-4 rounded-xl transition-all duration-200 group hover:bg-black/5 active:bg-black/10"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-gray-600 group-hover:text-black">{icon}</span>
                  <span className="font-medium">{label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:text-black" />
              </Link>
            ))}
          </nav>

          {isLoggedIn && (
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="flex items-center justify-center py-2 px-3 rounded-xl mb-10 mx-6"
            >
              <LogOut size={14} className="mr-2" />
              로그아웃
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
