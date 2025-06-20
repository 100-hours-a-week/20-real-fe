import { postNoticeRequest } from '@/features/post/dto/postNoticeRequest';

export interface putNoticeRequest extends postNoticeRequest {
  id: number;
}
