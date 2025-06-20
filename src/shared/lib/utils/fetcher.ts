import { BaseResponse } from '@/entities/common/base';
import { AppError } from '@/shared/errors/appError';
import { Errors } from '@/shared/errors/errors';
import { useToastStore } from '@/shared/model/toastStore';
import { useUserPersistStore } from '@/shared/model/userPersistStore';

function fetchWithAuth(url: string, timeout: number, options?: RequestInit) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: options?.headers,
    credentials: 'include',
    signal: AbortSignal.timeout(timeout),
  });
}

async function parseJSON<T>(res: Response): Promise<BaseResponse<T>> {
  try {
    return await res.json();
  } catch (err) {
    throw AppError.create('UNKNOWN', {
      messageOverride: 'JSON 파싱 실패',
      extra: { status: res.status, url: res.url, originalError: err },
      capture: true,
    });
  }
}

async function handleTokenRefresh<T>(fetchFn: () => Promise<Response>): Promise<BaseResponse<T>> {
  const toast = useToastStore.getState();
  const userStore = useUserPersistStore.getState();

  // refresh 요청
  const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  // 리프레시 실패 시 토큰 만료로 로그아웃 처리
  if (!refreshRes.ok) {
    userStore.cleanUser();
    toast.showToast(Errors.TOKEN_EXPIRED.message, 'error');
    throw AppError.create('TOKEN_EXPIRED', {
      messageOverride: '토큰 리프레시 실패',
    });
  }

  // 리프레시 성공 시 원 요청 재호출
  const retriedRes = await fetchFn();
  return await parseJSON<T>(retriedRes);
}

async function handleError<T>(
  res: Response,
  responseBody: BaseResponse<T> | undefined,
  retryFetch: () => Promise<Response>,
): Promise<BaseResponse<T>> {
  const { message } = responseBody || {};
  const toast = useToastStore.getState();
  const userStore = useUserPersistStore.getState();

  if (res.status === 401) {
    // 토큰 만료된 경우
    if (message === 'EXPIRED_TOKEN') {
      return await handleTokenRefresh<T>(retryFetch);
    }
    // 토큰이 아예 없는 경우
    toast.showToast(Errors.UNAUTHORIZED.message, 'error');
    userStore.cleanUser();
    throw AppError.create('UNAUTHORIZED');
  }

  if (res.status === 403) {
    // 인증받지 못한 유저의 경우
    toast.showToast(Errors.FORBIDDEN.message, 'error');
    userStore.setIsApproved(false);
    throw AppError.create('FORBIDDEN');
  }

  if (res.status === 404) {
    throw AppError.create('NOT_FOUND');
  }

  // 기타 에러
  toast.showToast(Errors.UNKNOWN.message, 'error');
  throw AppError.create('UNKNOWN', {
    messageOverride: 'Unhandled API Error: ${res.status}',
    extra: { status: res.status, url: res.url, responseBody },
    capture: true,
  });
}

export async function fetcher<T>(url: string, options?: RequestInit): Promise<BaseResponse<T>> {
  // AI 응답만 타임아웃 1분, 나머지는 10초
  const timeout = url.includes('/v1/chatbots') ? 60000 : 10000;
  const fetchFn = () => fetchWithAuth(url, timeout, options);

  const res = await fetchFn();
  const responseBody = await parseJSON<T>(res);

  if (res.ok) return responseBody;

  return handleError(res, responseBody, fetchFn);
}
