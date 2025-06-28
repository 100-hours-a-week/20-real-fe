export interface postNoticeRequest {
  title: string;
  content: string;
  tag: string;
  platform: string;
  userName: string;
  originalUrl: string;
  createdAt: string;
  images: File[];
  files: File[];
}
