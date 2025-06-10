import { useQuery } from '@tanstack/react-query';

import { getUserInfo } from '@/features/user/api/user';
import { queryKeys } from '@/shared/constatns/keys';

function useUserInfo() {
  return useQuery({
    queryKey: [queryKeys.userInfo],
    queryFn: getUserInfo,
  });
}

export { useUserInfo };
