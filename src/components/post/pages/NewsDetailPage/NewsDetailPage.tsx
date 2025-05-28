'use client';

import { useParams } from 'next/navigation';

import { ImageViewer } from '@/components/common/molecules/ImageViewer';
import { MarkdownViewer } from '@/components/common/molecules/MarkdownViewer';
import { ErrorPage } from '@/components/common/pages/ErrorPage';
import { NotFoundPage } from '@/components/common/pages/NotFoundPage';
import { RedirectWithLoginModalPage } from '@/components/common/pages/RedirectWithLoginModalPage';
import { PostHeader } from '@/components/post/molecules/PostHeader';
import { PostSummary } from '@/components/post/molecules/PostSummary';
import { PostCommentSection } from '@/components/post/organisms/PostCommentSection';
import { PostReaction } from '@/components/post/organisms/PostReaction/PostReaction';
import { useNewsDetailQuery } from '@/queries/news/useNewsDetailQuery';
import { PostTypes } from '@/types/post/postType';

export function NewsDetailPage() {
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
          <MarkdownViewer text={news.content} />

          {news.imageUrl && <ImageViewer imageUrl={news.imageUrl} />}
        </div>

        <PostReaction type={PostTypes.News} postId={news.id} userLike={news.userLike} likeCount={news.likeCount} />

        <PostCommentSection type={PostTypes.News} postId={news.id} commentCount={news.commentCount} />
      </div>
    </div>
  );
}
