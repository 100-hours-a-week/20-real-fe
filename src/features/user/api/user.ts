import { BaseResponse } from '@/entities/common/base';
import { User } from '@/entities/user/user';
import { fetcher } from '@/shared/lib/fetcher';

const getUserInfo = async (): Promise<BaseResponse<User>> => {
  return await fetcher('/v1/users/info', { method: 'GET' });
};

export { getUserInfo };
