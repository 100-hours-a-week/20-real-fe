'use client';

import { BookText, CircleAlert } from 'lucide-react';

import { Button } from '@/components/common/atoms/Button';
import { SkeletonBox } from '@/components/common/atoms/SkeletonBox';
import { WikiEditor } from '@/components/wiki/organisms/WikiEditor';
import { useCreateWikiMutation } from '@/queries/wiki/useCreateWikiMutation';
import { useWikiDetailQuery } from '@/queries/wiki/useWikiDetailQuery';
import { useToastStore } from '@/stores/toastStore';
import { validateWikiTitle } from '@/utils/validateWiki';

interface WikiDetailPageProps {
  title: string;
}

export function WikiDetailPage({ title }: WikiDetailPageProps) {
  const { data: wiki, isLoading, isError, error } = useWikiDetailQuery(title);
  const { mutate: createWiki } = useCreateWikiMutation(title);
  const { showToast } = useToastStore();

  const handleCreateWiki = () => {
    const validateMsg = validateWikiTitle(title);
    if (validateMsg) {
      showToast(validateMsg, 'error');
      return;
    }

    createWiki();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4">
          <SkeletonBox className="w-1/3 h-6 mb-4" />
          <SkeletonBox className="w-full h-[300px]" />
        </div>
      );
    }

    if (isError || !wiki) {
      if (error?.code === 'NOT_FOUND') {
        return (
          <div className="p-6 text-center space-y-4">
            <BookText className="mx-auto text-gray-500" size={40} />
            <p className="text-gray-700 font-medium">해당 문서를 찾을 수 없습니다.</p>
            <Button variant="primary" onClick={handleCreateWiki}>
              문서 생성하기
            </Button>
          </div>
        );
      }

      return (
        <div className="p-6 text-center space-y-4">
          <CircleAlert className="mx-auto text-gray-500" size={40} />
          <p className="text-gray-700 font-medium">
            문서를 불러오는 중 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      );
    }

    return <WikiEditor wikiId={wiki.id} title={title} initialContent={wiki.content} />;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold m-4">{title}</h2>
      <hr className="text-neutral-300" />
      {renderContent()}
    </div>
  );
}
