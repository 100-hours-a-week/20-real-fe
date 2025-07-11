import { NewsDetail } from '@/entities/post/newsDetail';
import { PostTypes } from '@/entities/post/postType';
import { getApiData } from '@/shared/lib/utils/getApiData';
import { ErrorPage } from '@/shared/ui/component/ErrorPage';
import { NotFoundPage } from '@/shared/ui/component/NotFoundPage';
import { ImageViewer } from '@/shared/ui/section/ImageViewer';
import MarkdownViewerServer from '@/shared/ui/section/MarkdownViewerServer/MarkdownViewerServer';
import { RedirectWithLoginModalPage } from '@/shared/ui/section/RedirectWithLoginModalPage';
import { PostHeader } from '@/widgets/post/components/PostHeader';
import { PostSummary } from '@/widgets/post/components/PostSummary';
import { PostCommentSection } from '@/widgets/post/sections/PostCommentSection';
import { PostReaction } from '@/widgets/post/sections/PostReaction/PostReaction';

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const { data: news, error } = await getApiData<NewsDetail>(`/v1/news/${id}`, { withAuth: true });

  if (error) {
    switch (error?.code) {
      case 'UNAUTHORIZED':
        return <RedirectWithLoginModalPage />;
      case 'NOT_FOUND':
        return <NotFoundPage />;
      default:
        return <ErrorPage />;
    }
  }
  if (!news) return <ErrorPage />;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-app bg-white">
        <PostHeader tags={[news.tag]} title={news.title} viewCount={news.viewCount} createdAt={news.createdAt} />

        <PostSummary summary={news.summary} />

        <div className="px-4 pb-3">
          <MarkdownViewerServer text={news.content} />

          {news.imageUrl && <ImageViewer imageUrl={news.imageUrl} />}
        </div>
        <PostReaction type={PostTypes.News} postId={news.id} userLike={news.userLike} likeCount={news.likeCount} />

        <PostCommentSection type={PostTypes.News} postId={news.id} commentCount={news.commentCount} />
      </div>
    </div>
  );
}
