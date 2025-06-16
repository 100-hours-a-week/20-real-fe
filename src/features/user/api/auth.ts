import { BaseResponse } from '@/entities/common/base';
import { fetcher } from '@/shared/lib/utils/fetcher';

const oauthLogin = async (provider: string) => {
  window.location.href = process.env.NEXT_PUBLIC_API_URL + `/v1/oauth/${provider}`;
};

const logout = async (): Promise<BaseResponse<void> | undefined> => {
  return await fetcher('/v1/auth/logout', {
    method: 'POST',
  });
};

export { oauthLogin, logout };
