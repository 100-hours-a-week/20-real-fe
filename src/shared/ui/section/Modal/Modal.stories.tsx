import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useModal } from '@/shared/model/modalStore';
import { Modal } from '@/shared/ui/section/Modal/index';

import '@/app/globals.css';
import { Button } from '../../component/Button';

const meta: Meta<typeof Modal> = {
  title: 'Common/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
프로젝트 전역에서 사용하는 모달 컴포넌트입니다.  
제목, 내용, 버튼(Action)을 props로 전달해 통일된 형태로 표시합니다.

---

###  useModal 사용 방법

\`\`\`tsx
const { openModal, closeModal } = useModal();

openModal({
  title: '삭제하시겠어요?',
  content: <p>삭제한 내용은 복구할 수 없습니다.</p>,
  actions: [
    { label: '취소', variant: 'ghost', onClick: () => closeModal() },
    { label: '삭제', variant: 'destructive', onClick: () => console.log('삭제') },
  ],
});
\`\`\`
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Modal>;

const UseModalDemo = () => {
  const { isOpen, title, content, actions, openModal, closeModal } = useModal();

  const handleOpen = () => {
    openModal({
      title: '댓글을 삭제하시겠어요?',
      content: <p className="text-gray-700">삭제한 댓글은 복구할 수 없습니다.</p>,
      actions: [
        { label: '취소', variant: 'ghost', onClick: () => closeModal() },
        {
          label: '삭제',
          variant: 'destructive',
          onClick: () => {
            closeModal();
          },
        },
      ],
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-[500px] justify-center">
      <Button onClick={handleOpen}>모달 열기</Button>

      <Modal isOpen={isOpen} onClose={() => closeModal()} title={title} actions={actions}>
        {content}
      </Modal>
    </div>
  );
};

export const WithUseModal: Story = {
  render: () => <UseModalDemo />,
};
