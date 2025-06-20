import { cookies } from 'next/headers';

import { ReactNode } from 'react';

import { BaseResponse } from '@/entities/common/base';
import { User } from '@/entities/user/user';
import { fetcher } from '@/shared/lib/utils/fetcher';
import { NotFoundPage } from '@/shared/ui/component/NotFoundPage';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  try {
    const cookie = (await cookies()).toString();

    const response: BaseResponse<User> = await fetcher(`/v1/users/info`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Cookie: cookie,
      },
    });

    const user = response?.data;
    if (!user || user.role !== 'STAFF') {
      return <NotFoundPage />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error(error);
    return <NotFoundPage />;
  }
}
