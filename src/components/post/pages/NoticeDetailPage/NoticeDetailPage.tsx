'use client';

import { useParams } from 'next/navigation';

import { ImageCarousel } from '@/components/common/molecules/ImageCarousel';
import { MarkdownViewer } from '@/components/common/molecules/MarkdownViewer';
import { ErrorPage } from '@/components/common/pages/ErrorPage';
import { NotFoundPage } from '@/components/common/pages/NotFoundPage';
import { RedirectWithLoginModalPage } from '@/components/common/pages/RedirectWithLoginModalPage';
import { PostFileItem } from '@/components/post/molecules/PostFileItem';
import { PostHeader } from '@/components/post/molecules/PostHeader';
import { PostSummary } from '@/components/post/molecules/PostSummary';
import { PostCommentSection } from '@/components/post/organisms/PostCommentSection';
import { PostReaction } from '@/components/post/organisms/PostReaction/PostReaction';
import { useNoticeDetailQuery } from '@/queries/post/useNoticeDetailQuery';
import { PostTypes } from '@/types/post/postType';

export function NoticeDetailPage() {
  const params = useParams();
  const id: string = params?.id as string;
  const { data: notice, isLoading, isError, error } = useNoticeDetailQuery(id);

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
  if (!notice) return <ErrorPage />;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-app bg-white">
        <PostHeader
          tags={[notice.tag]}
          title={notice.title}
          author={notice.author}
          createdAt={notice.createdAt}
          platform={notice.platform}
          originalUrl={notice.originalUrl}
        />

        <PostSummary summary={notice.summary} />

        <div className="px-4 pb-3">
          <MarkdownViewer text={notice.content} useHtml={true} useSyntaxHighlight={true} />

          {notice.images.length > 0 && (
            <ImageCarousel.Root
              images={notice.images.map((item) => ({
                id: item.id,
                url: item.fileUrl,
                name: item.fileName,
              }))}
            >
              <div className="relative">
                <ImageCarousel.Controls />
                <ImageCarousel.ImageList />
              </div>
              <ImageCarousel.Indicators />
            </ImageCarousel.Root>
          )}

          {notice.files.length > 0 &&
            notice.files.map((file) => (
              <div key={file.id}>
                <PostFileItem file={file} />
              </div>
            ))}
        </div>

        <PostReaction
          type={PostTypes.Notice}
          postId={notice.id}
          userLike={notice.userLike}
          likeCount={notice.likeCount}
        />

        <PostCommentSection type={PostTypes.Notice} postId={notice.id} commentCount={notice.commentCount} />
      </div>
    </div>
  );
}
