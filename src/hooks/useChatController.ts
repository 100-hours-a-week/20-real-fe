import { v4 as uuidv4 } from 'uuid';

import { useState } from 'react';

import { AppError } from '@/lib/errors/appError';
import { useToastStore } from '@/stores/toastStore';
import { ChatMessage } from '@/types/chatbot/chatMessage';

export function useChatController() {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isWaitingFirstResponse, setIsWaitingFirstResponse] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  // const { mutateAsync: postQuestion, isPending } = usePostChatbotQuestion();
  const { showToast } = useToastStore();

  // 답변 로드
  const loadAnswer = (question: string) => {
    const id = uuidv4();
    const answerId = `${id}-answer`;

    // 운영시간이 아니면 에러 리턴
    if (!checkOperationHour()) {
      const error = AppError.create('AI_NOT_OPERATION_TIME');

      setChats((prev) => [
        ...prev,
        { id, text: question, type: 'question' },
        { id: answerId, text: '', type: 'answer', error },
      ]);
      setCurrentInput('');
      return;
    }

    setChats((prev) => [...prev, { id, text: question, type: 'question' }]);
    setCurrentInput('');

    setIsWaitingFirstResponse(true);
    setIsStreaming(true);

    // SSE 이벤트 수신
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/chatbots?question=${encodeURIComponent(question)}`,
      { withCredentials: true },
    );

    let receivedFirstMessage = false;

    eventSource.onmessage = (event) => {
      // 첫 응답 오면 로딩 종료
      if (!receivedFirstMessage) {
        setChats((prev) => [...prev, { id: answerId, text: '', type: 'answer' }]);
        setIsWaitingFirstResponse(false);
        receivedFirstMessage = true;
      }

      const text = event.data;
      appendAnswer(text);
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      eventSource.close();

      const error = AppError.create('AI_ERROR');

      // 마지막 answer 메시지에 error 주입
      setChats((prev) => {
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].type === 'answer') {
            updated[i] = { ...updated[i], error };
            break;
          }
        }
        return updated;
      });

      setIsWaitingFirstResponse(false);
      setIsStreaming(false);
    };
  };

  // 운영시간 확인
  // 평일 9시 ~ 18시
  const checkOperationHour = (): boolean => {
    const now = new Date();
    const day = now.getDay(); // 0 = 일요일, 1 = 월요일, ..., 6 = 토요일
    const hour = now.getHours(); // 0~23

    const isWeekday = day >= 1 && day <= 5;
    const isInBusinessHours = hour >= 9 && hour < 18;

    return isWeekday && isInBusinessHours;
  };

  // 현재 마지막 Answer에 chunk 추가
  const appendAnswer = (chunk: string) => {
    setChats((prev) => {
      for (let i = prev.length - 1; i >= 0; i--) {
        // 마지막 답변에 chunk 추가
        if (prev[i].type === 'answer') {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            text: prev[i].text + chunk,
          };
          return updated;
        }
      }
      return prev;
    });
  };

  // 채팅 Input 변경 핸들러
  const handleInputChange = (value: string) => {
    if (value.length > 500) {
      showToast('메시지는 최대 500자까지 입력 가능합니다.', 'error', 'top');
      return;
    }
    setCurrentInput(value);
  };

  return {
    chats,
    currentInput,
    isWaitingFirstResponse,
    isStreaming,
    handleInputChange,
    setCurrentInput,
    loadAnswer,
  };
}
