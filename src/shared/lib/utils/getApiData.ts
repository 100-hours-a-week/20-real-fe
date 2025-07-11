import { cookies } from 'next/headers';

import { fetcher } from '@/shared/lib/utils/fetcher';

type ErrorResponse = {
  code: string;
  message: string;
};

export async function getApiData<T>(
  url: string,
  options?: RequestInit & { withAuth?: boolean },
): Promise<{ data?: T; error?: ErrorResponse }> {
  try {
    const cookieStore = await cookies();
    const headers: HeadersInit = {
      ...(options?.headers ?? {}),
      ...(options?.withAuth
        ? { Cookie: cookieStore.toString() } // SSR 쿠키 전달
        : {}),
    };

    const response = await fetcher<T>(url, {
      ...options,
      headers,
    });

    return { data: response.data };
  } catch (err) {
    const appErr = err as Error & { code?: string };
    return {
      error: {
        code: appErr.code ?? 'UNKNOWN',
        message: appErr.message,
      },
    };
  }
}
