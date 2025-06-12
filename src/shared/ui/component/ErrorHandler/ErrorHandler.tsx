import { AlertCircle, LogIn, RefreshCw, ShieldOff } from 'lucide-react';

import * as React from 'react';

import { AppError } from '@/shared/errors/appError';
import { Button } from '@/shared/ui/component/Button';
import { LoginButton } from '@/shared/ui/section/LoginButton';

interface ErrorHandlerProps {
  error: AppError;
  className?: string;
}

export function ErrorHandler({ error, className = '' }: ErrorHandlerProps) {
  const renderContent = () => {
    const status = error?.code;

    if (status === 'UNAUTHORIZED' || status === 'TOKEN_EXPIRED') {
      return {
        icon: <LogIn className="w-8 h-8 text-blue-500" />,
        message: '로그인을 해야 이용할 수 있는 기능이에요.',
        bgColor: 'bg-blue-50',
        showLoginButton: true,
      };
    }

    if (status === 'FORBIDDEN') {
      return {
        icon: <ShieldOff className="w-8 h-8 text-orange-500" />,
        message: '인증된 사용자만 사용할 수 있는 기능이에요.',
        bgColor: 'bg-orange-50',
        showLoginButton: false,
      };
    }

    return {
      icon: <AlertCircle className="w-8 h-8 text-red-500" />,
      message: '문제가 발생했어요. 잠시 후 다시 시도해주세요.',
      bgColor: 'bg-red-50',
      showLoginButton: false,
    };
  };

  const { icon, message, bgColor, showLoginButton } = renderContent();

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 ${className}`}>
      <div className="px-6 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* 아이콘 배경 */}
          <div className={`${bgColor} rounded-full p-3`}>{icon}</div>

          {/* 메시지 */}
          <div className="space-y-2">
            <p className="text-base font-medium">{message}</p>
          </div>

          {/* 버튼 */}
          {showLoginButton ? (
            <LoginButton className="h-9 px-4 text-sm inline-flex items-center justify-center gap-2 rounded cursor-pointer bg-primary-500 hover:bg-primary-600 text-white">
              로그인 하러 가기
            </LoginButton>
          ) : (
            <Button
              variant={'plain'}
              onClick={() => location.reload()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
