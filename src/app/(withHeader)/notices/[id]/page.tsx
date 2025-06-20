'use client';

import { useParams, useRouter } from 'next/navigation';

import { PostTypes } from '@/entities/post/postType';
import { useDeleteNoticeMutation } from '@/features/post/model/notices/useDeleteNoticeMutation';
import { useNoticeDetailQuery } from '@/features/post/model/notices/useNoticeDetailQuery';
import { useUserInfo } from '@/features/user/model/useUserInfoQuery';
import { useModal } from '@/shared/model/modalStore';
import { ErrorPage } from '@/shared/ui/component/ErrorPage';
import { NotFoundPage } from '@/shared/ui/component/NotFoundPage';
import { ImageCarousel } from '@/shared/ui/section/ImageCarousel';
import { MarkdownViewer } from '@/shared/ui/section/MarkdownViewer';
import { RedirectWithLoginModalPage } from '@/shared/ui/section/RedirectWithLoginModalPage';
import { PostFileItem } from '@/widgets/post/components/PostFileItem';
import { PostHeader } from '@/widgets/post/components/PostHeader';
import { PostSummary } from '@/widgets/post/components/PostSummary';
import { PostCommentSection } from '@/widgets/post/sections/PostCommentSection';
import { PostReaction } from '@/widgets/post/sections/PostReaction/PostReaction';

export default function NoticeDetailPage() {
  const params = useParams();
  const id: string = params?.id as string;
  const { data: notice, isLoading, isError, error } = useNoticeDetailQuery(id);
  const { data: user } = useUserInfo();
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  const { mutate: deleteNotice } = useDeleteNoticeMutation();

  const handleDelete = () => {
    openModal({
      title: '공지를 삭제하시겠어요?',
      actions: [
        { label: '취소', variant: 'ghost', autoClose: true },
        {
          label: '삭제',
          variant: 'destructive',
          onClick: () => {
            closeModal();
            router.replace('/notices');
            deleteNotice(Number(id));
          },
        },
      ],
    });
  };

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
          showAdminButton={user?.data.role === 'STAFF'}
          onClickEdit={() => router.push(`/admin/notices/edit/${id}`)}
          onClickDelete={handleDelete}
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
