'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useUserInfo } from '@/queries/useUserInfoQuery';
import { useToastStore } from '@/stores/toastStore';
import { useUserPersistStore } from '@/stores/userPersistStore';

export default function LoginSuccessPage() {
  const router = useRouter();
  const { setUser, setIsApproved } = useUserPersistStore();
  const { showToast } = useToastStore();
  const { data, isError, isSuccess } = useUserInfo();

  useEffect(() => {
    if (isSuccess && data?.data) {
      setUser(data.data);
      setIsApproved(data.data.role === 'STAFF' || data.data.role === 'TRAINEE');
      router.replace('/home');
    }

    if (isError) {
      showToast('로그인 정보를 불러오지 못했어요.', 'error');
      router.replace('/login');
    }
  }, [isSuccess, isError, data, router, setUser, showToast, setIsApproved]);

  return null;
}
