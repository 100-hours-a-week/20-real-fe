'use client';

import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useModal } from '@/shared/model/modalStore';

export function RedirectWithLoginModalPage() {
  const { push, back } = useRouter();
  const { openModal } = useModal();

  useEffect(() => {
    openModal({
      title: '로그인이 필요합니다.',
      content: (
        <div className={`flex flex-col items-center`}>
          <div className="bg-accent-100 text-accent-600 p-3 rounded-full mb-4">
            <LogIn size={24} className="animate-pulse" />
          </div>

          <div className="text-sm font-semibold text-gray-500 mb-2 text-center">
            로그인 후 모든 서비스를 이용하실 수 있습니다.
          </div>
        </div>
      ),
      actions: [
        {
          variant: 'ghost',
          label: '이전 페이지로 가기',
          onClick: () => {
            back();
          },
        },
        {
          variant: 'primary',
          label: '로그인 하러 가기',
          onClick: () => {
            push('/login');
          },
        },
      ],
    });
  }, [openModal, push, back]);

  return null;
}
