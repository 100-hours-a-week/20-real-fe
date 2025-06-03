import { v4 as uuidv4 } from 'uuid';

import { useState } from 'react';

import { useToastStore } from '@/stores/toastStore';
import { ChatMessage } from '@/types/chatbot/chatMessage';

export function useChatController() {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isWaitingFirstResponse, setIsWaitingFirstResponse] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isError, setIsError] = useState(false);
  // const { mutateAsync: postQuestion, isPending } = usePostChatbotQuestion();
  const { showToast } = useToastStore();

  const loadAnswer = (question: string) => {
    const id = uuidv4();
    setChats((prev) => [...prev, { id, text: question, type: 'question' }]);
    setCurrentInput('');

    setIsWaitingFirstResponse(true);
    setIsStreaming(true);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/chatbots?question=${encodeURIComponent(question)}`,
      { withCredentials: true },
    );

    let receivedFirstMessage = false;

    eventSource.onmessage = (event) => {
      if (!receivedFirstMessage) {
        setChats((prev) => [...prev, { id: `${id}-answer`, text: '', type: 'answer' }]);
        // 첫 응답 오면 로딩 종료
        setIsWaitingFirstResponse(false);
        receivedFirstMessage = true;
      }
      const text = event.data;
      appendAnswer(text);
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      eventSource.close();

      setIsError(true);
      setIsWaitingFirstResponse(false);
      setIsStreaming(false);
    };
  };

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
    isError,
    handleInputChange,
    setCurrentInput,
    loadAnswer,
  };
}
