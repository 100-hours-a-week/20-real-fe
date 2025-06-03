'use client';

import { useRouter } from 'next/navigation';

import { useEffect, useRef } from 'react';

import logo from '@/assets/logo.png';
import { ChatInput } from '@/components/chatbot/molecules/ChatInput';
import { SuggestedQuestions } from '@/components/chatbot/molecules/SuggestQuestions';
import { Chat } from '@/components/chatbot/organisms/ChatItem';
import { SafeImage } from '@/components/common/atoms/SafeImage';
import useAutoScroll from '@/hooks/useAutoScroll';
import { useChatController } from '@/hooks/useChatController';

export function ChatbotPage() {
  // const { headlines, isLoading: isHeadlineLoading } = useHeadlineData();
  const router = useRouter();
  const { chats, currentInput, isWaitingFirstResponse, isStreaming, handleInputChange, loadAnswer } =
    useChatController();

  const messagesEndRef = useAutoScroll([chats]);

  // 쿼리에서 질문이 들어왔을 때 처음 한 번만 실행하도록
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    const params = new URLSearchParams(window.location.search);
    const question = params.get('q');
    if (question) {
      hasRun.current = true;
      loadAnswer(question);
      router.replace('/chatbot');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col min-h-app bg-neutral-50">
      {/*/!* 헤드라인 *!/*/}
      {/*{isHeadlineLoading && chats.length === 0 && <HeadlineBannerSkeleton />}*/}
      {/*{!isHeadlineLoading && chats.length === 0 && headlines.length > 0 && <HeadlineBanner items={headlines} />}*/}

      <div className="flex-1 flex flex-col gap-4 p-4 pb-16 relative">
        {chats.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="mb-2 transform hover:scale-105 transition-transform duration-300 px-3">
              <SafeImage src={logo} alt="logo" width={400} height={50} priority className="drop-shadow-md" />
            </div>

            <SuggestedQuestions onSelect={loadAnswer} />
          </div>
        )}

        {/* 채팅 메시지 */}
        <div className="space-y-4">
          <Chat>
            {chats.map((chat) =>
              chat.type === 'question' ? (
                <Chat.UserMessage key={chat.id} text={chat.text} />
              ) : (
                <Chat.BotMessage key={chat.id} text={chat.text} />
              ),
            )}
            {isWaitingFirstResponse && <Chat.BotLoading />}
          </Chat>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="fixed w-full bottom-0">
        <ChatInput
          value={currentInput}
          isLoading={isStreaming}
          onChange={handleInputChange}
          onSend={() => loadAnswer(currentInput)}
        />
      </div>
    </div>
  );
}
