import { NewsDetail } from '@/entities/post/newsDetail';
import { NoticeDetail } from '@/entities/post/noticeDetail';

interface PostDetailSectionProps {
  post: NewsDetail | NoticeDetail;
}

export function PostDetailSection({ post }: PostDetailSectionProps) {
  return <>{post}</>;
}
