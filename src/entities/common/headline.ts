import { PostTypes } from '@/entities/post/postType';

export interface Headline {
  id: number;
  title: string;
  type: PostTypes;
}
