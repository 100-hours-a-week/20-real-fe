export interface NewsDetail {
  id: number;
  title: string;
  summary: string;
  content: string;
  tag: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  userLike: boolean;
  imageUrl: string;
  createdAt: string;
}
