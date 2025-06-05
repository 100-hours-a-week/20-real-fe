'use client';

import { BookText, CircleAlert } from 'lucide-react';
import { useParams } from 'next/navigation';

import { validateWikiTitle } from '@/features/wiki/lib/validateWiki';
import { useCreateWikiMutation } from '@/features/wiki/model/useCreateWikiMutation';
import { useWikiDetailQuery } from '@/features/wiki/model/useWikiDetailQuery';
import { useToastStore } from '@/shared/model/toastStore';
import { Button } from '@/shared/ui/component/Button';
import { SkeletonBox } from '@/shared/ui/component/SkeletonBox';
import { LoginButton } from '@/shared/ui/section/LoginButton';
import { WikiEditor } from '@/widgets/wiki/sections/WikiEditor';

export default function WikiDetailPage() {
  const params = useParams();
  const title: string = params?.title as string;
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
            <p className="text-gray-700 font-medium">해당 문서를 찾을 수 없어요.</p>
            <Button variant="primary" onClick={handleCreateWiki}>
              문서 생성하기
            </Button>
          </div>
        );
      }

      if (error?.code === 'UNAUTHORIZED' || error?.code === 'TOKEN_EXPIRED') {
        return (
          <div className="p-6 text-center space-y-4">
            <CircleAlert className="mx-auto text-gray-500" size={40} />
            <p className="text-gray-700 font-medium">로그인 후 이용 가능해요.</p>
            <LoginButton className="h-9 px-4 text-sm inline-flex items-center justify-center gap-2 rounded cursor-pointer bg-primary-500 hover:bg-primary-600 text-white">
              로그인 하러 가기
            </LoginButton>
          </div>
        );
      }

      if (error?.code === 'FORBIDDEN') {
        return (
          <div className="p-6 text-center space-y-4">
            <CircleAlert className="mx-auto text-gray-500" size={40} />
            <p className="text-gray-700 font-medium">인증 받은 사용자만 확인할 수 있어요.</p>
          </div>
        );
      }

      return (
        <div className="p-6 text-center space-y-4">
          <CircleAlert className="mx-auto text-gray-500" size={40} />
          <p className="text-gray-700 font-medium">
            문서를 불러오는 중 문제가 발생했어요.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      );
    }

    return <WikiEditor wiki={wiki} />;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold m-4">{title}</h2>
      <hr className="text-neutral-300" />
      {renderContent()}
    </div>
  );
}
