'use client';

import { useParams } from 'next/navigation';

import { PostTypes } from '@/entities/post/postType';
import { useNewsDetailQuery } from '@/features/post/model/news/useNewsDetailQuery';
import { ErrorPage } from '@/shared/ui/component/ErrorPage';
import { NotFoundPage } from '@/shared/ui/component/NotFoundPage';
import { ImageViewer } from '@/shared/ui/section/ImageViewer';
import { MarkdownViewer } from '@/shared/ui/section/MarkdownViewer';
import { RedirectWithLoginModalPage } from '@/shared/ui/section/RedirectWithLoginModalPage';
import { PostHeader } from '@/widgets/post/components/PostHeader';
import { PostSummary } from '@/widgets/post/components/PostSummary';
import { PostCommentSection } from '@/widgets/post/sections/PostCommentSection';
import { PostReaction } from '@/widgets/post/sections/PostReaction/PostReaction';

export default function NewsDetailPage() {
  const params = useParams();
  const id: string = params?.id as string;
  const { data: news, isLoading, isError, error } = useNewsDetailQuery(id);

  if (isLoading) return null;
  if (isError) {
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
          <MarkdownViewer text={news.content} useHtml={true} useSyntaxHighlight={true} />

          {news.imageUrl && <ImageViewer imageUrl={news.imageUrl} />}
        </div>

        <PostReaction type={PostTypes.News} postId={news.id} userLike={news.userLike} likeCount={news.likeCount} />

        <PostCommentSection type={PostTypes.News} postId={news.id} commentCount={news.commentCount} />
      </div>
    </div>
  );
}
