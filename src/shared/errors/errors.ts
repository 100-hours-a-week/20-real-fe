import { ErrorLevels } from '@/shared/errors/errorLevels';
import { ErrorTags } from '@/shared/errors/errorTags';

export const Errors = {
  UNAUTHORIZED: {
    message: '로그인을 해야 이용할 수 있는 기능이에요.',
    level: ErrorLevels.INFO,
    tags: [ErrorTags.AUTH],
  },
  TOKEN_EXPIRED: {
    message: '로그아웃 되었어요. 다시 로그인해 주세요.',
    level: ErrorLevels.INFO,
    tags: [ErrorTags.AUTH],
  },
  FORBIDDEN: {
    message: '인증된 사용자만 사용할 수 있는 기능이에요.',
    level: ErrorLevels.INFO,
    tags: [ErrorTags.AUTH],
  },
  NOT_FOUND: {
    message: '존재하지 않는 페이지예요.',
    level: ErrorLevels.INFO,
    tags: [ErrorTags.API],
  },
  AI_NOT_OPERATION_TIME: {
    message: '춘비서의 운영 시간이 아니에요.',
    level: ErrorLevels.INFO,
    tags: [],
  },
  AI_ERROR: {
    message: '춘비서가 응답을 생성하는 중 오류가 발생했어요.',
    level: ErrorLevels.ERROR,
    tags: [ErrorTags.API, ErrorTags.AI],
  },
  UNKNOWN: {
    message: '문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
    level: ErrorLevels.ERROR,
    tags: [ErrorTags.API],
  },
} as const;

export type ErrorCode = keyof typeof Errors;
