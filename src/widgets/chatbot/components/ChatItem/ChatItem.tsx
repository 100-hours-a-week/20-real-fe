import { CircleAlert } from 'lucide-react';

import { AppError } from '@/shared/errors/appError';

import choon from '../../../../assets/favicon.png';
import { SafeImage } from '../../../../shared/ui/component/SafeImage';
import { MarkdownViewer } from '../../../../shared/ui/section/MarkdownViewer';

function ChatRoot({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-fadeIn">
      <div className="bg-primary-500 rounded-2xl rounded-tr-none shadow-sm w-fit max-w-[85%] break-words">
        <MarkdownViewer text={text} className="text-white pt-2 px-3" />
      </div>
    </div>
  );
}

function BotProfile() {
  return (
    <SafeImage
      src={choon}
      alt="프로필 이미지"
      width={32}
      height={32}
      className="rounded-full object-cover border-gray-400 bg-white p-0.5"
    />
  );
}

function BotMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start animate-fadeIn">
      <div className="mr-2">
        <BotProfile />
      </div>
      <div className="w-fit max-w-[85%] text-gray-800 text-sm break-words">
        <MarkdownViewer text={text} />
      </div>
    </div>
  );
}

function ChatError({ error }: { error: AppError }) {
  const isOperationTimeError = error.code === 'AI_NOT_OPERATION_TIME';

  return (
    <div className="flex items-start animate-fadeIn">
      <div className="mr-2">
        <BotProfile />
      </div>
      <div className="relative w-[85%] bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl rounded-tl-none shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-100 to-orange-100 border-b border-red-200">
          <CircleAlert className="w-5 h-5 text-red-500 rounded-full" />
          <span className="text-sm font-medium text-red-700">
            {isOperationTimeError ? '운영시간 안내' : '일시적 오류'}
          </span>
        </div>

        {/* 메시지 */}
        <div className="px-4 py-3">
          {isOperationTimeError ? (
            <div className="flex flex-col items-start gap-1 text-sm text-gray-700">
              <p className="font-medium">춘비서의 운영시간은 평일 09시 ~ 18시에요.</p>
              <p className="text-xs text-gray-600">운영시간 내에 다시 방문해주세요! 😊</p>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-1 text-sm text-gray-700">
              <p className="font-medium">{error.message}</p>
              <p className="text-xs text-gray-600">잠시 후 다시 시도해주세요.</p>
            </div>
          )}
        </div>

        {/* 하단 장식적 요소 */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-red-100 to-transparent rounded-full opacity-30 -mr-8 -mb-8"></div>
      </div>
    </div>
  );
}

function BotLoading() {
  return (
    <div className="flex items-start animate-fadeIn" data-testid="chatbot-loading">
      <div className="mr-2">
        <BotProfile />
      </div>
      <div className="flex gap-2 pt-2.5">
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce-dot [animation-delay:0s]" />
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce-dot [animation-delay:0.2s]" />
        <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce-dot [animation-delay:0.4s]" />
      </div>
    </div>
  );
}

// Compound 패턴으로 묶기
export const Chat = Object.assign(ChatRoot, {
  UserMessage,
  BotMessage,
  ChatError,
  BotLoading,
});
