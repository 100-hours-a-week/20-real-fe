import { BaseResponse } from '@/entities/common/base';
import { fetcher } from '@/shared/lib/fetcher';

interface ChatbotQuestionResponse {
  answer: string;
}

const postChatbotQuestion = async (question: string): Promise<BaseResponse<ChatbotQuestionResponse>> => {
  return await fetcher(`/v1/chatbots`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
};

export { postChatbotQuestion };
