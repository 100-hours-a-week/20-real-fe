'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useUserInfo } from '@/queries/useUserInfoQuery';
import { useAuthRedirectStore } from '@/stores/authRedirectStore';
import { useToastStore } from '@/stores/toastStore';
import { useUserPersistStore } from '@/stores/userPersistStore';

export default function LoginSuccessPage() {
  const router = useRouter();
  const { setUser, setIsApproved } = useUserPersistStore();
  const { showToast } = useToastStore();
  const { data, isError, isSuccess } = useUserInfo();
  const { redirectPath, clearRedirectPath } = useAuthRedirectStore();

  useEffect(() => {
    if (isSuccess && data?.data) {
      setUser(data.data);
      setIsApproved(data.data.role === 'STAFF' || data.data.role === 'TRAINEE');

      if (redirectPath) {
        const path = redirectPath;
        clearRedirectPath();
        router.replace(path);
      } else {
        router.push('/home');
      }
    }

    if (isError) {
      showToast('로그인 정보를 불러오지 못했어요.', 'error');
      router.replace('/login');
    }
  }, [isSuccess, isError, data, router, setUser, showToast, setIsApproved]);

  return null;
}
