import { NoticeFile } from '@/entities/post/noticeFile';
import { PostPlatform } from '@/entities/post/postPlatform';

export interface NoticeDetail {
  id: number;
  title: string;
  author: string;
  platform: PostPlatform;
  content: string;
  summary: string;
  tag: string;
  likeCount: number;
  commentCount: number;
  originalUrl: string;
  userLike: boolean;
  createdAt: string;
  files: NoticeFile[];
  images: NoticeFile[];
}
