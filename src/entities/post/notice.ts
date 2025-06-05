import { PostPlatform } from '@/entities/post/postPlatform';

export interface Notice {
  id: number;
  title: string;
  author: string;
  platform: PostPlatform;
  userRead: boolean;
  createdAt: string;
}
