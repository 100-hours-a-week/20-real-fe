import { AppError } from '@/shared/errors/appError';

export type ChatMessage = {
  id: string;
  text: string;
  type: 'question' | 'answer';
  error?: AppError;
};
