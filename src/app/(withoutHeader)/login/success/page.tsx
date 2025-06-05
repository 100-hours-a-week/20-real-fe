'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useUserInfo } from '@/features/user/model/useUserInfoQuery';
import { useAuthRedirectStore } from '@/shared/model/authRedirectStore';
import { useToastStore } from '@/shared/model/toastStore';
import { useUserPersistStore } from '@/shared/model/userPersistStore';

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
