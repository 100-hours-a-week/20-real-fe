'use client';

import { usePathname } from 'next/navigation';

import { useEffect } from 'react';

import { EventName } from '@/shared/lib/firebase/eventNames';
import { firebaseLogging } from '@/shared/lib/firebase/logEvent';

export function RouteChangeLogger() {
  const pathname = usePathname();

  // 페이지 경로 바뀔 때마다 로깅
  useEffect(() => {
    firebaseLogging(EventName.PAGE_VIEW, { description: pathname });
  }, [pathname]);

  return null;
}
