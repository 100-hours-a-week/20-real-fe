import type { Meta, StoryObj } from '@storybook/react';

import { useToastStore } from '@/shared/model/toastStore';
import { ToastContainer } from '@/shared/ui/section/ToastContainer/index';

import '@/app/globals.css';
import { Button } from '../../component/Button';

const meta: Meta<typeof ToastContainer> = {
  title: 'Common/Toast',
  component: ToastContainer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
프로젝트 전역에서 일시적인 알림 메시지를 표시하는 Toast 컴포넌트입니다.  
전역 상태를 사용하여 어디서든 호출할 수 있습니다.

---

### Props (useToastStore를 통해 관리)

- **message** (필수)  
  표시할 알림 메시지입니다. (string)

- **type** (선택, 기본값: 'default')  
  알림 타입에 따라 아이콘과 색상이 다르게 표시됩니다.  
  'default', 'success', 'error', 'warning'

- **position** (선택, 기본값: 'bottom')  
  화면 상단 또는 하단에 표시할지 결정합니다.  
  'top', 'bottom'

- **duration** (선택, 기본값: 'long')  
  토스트 표시 시간을 지정합니다.  
  'short' (3초), 'long' (5초)
      `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

const ToastDemo = () => {
  const { showToast } = useToastStore();

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-[300px]">
      <Button onClick={() => showToast('Default 토스트')}>Default Toast 띄우기</Button>
      <Button onClick={() => showToast('success 토스트!', 'success')}>Success Toast 띄우기</Button>
      <Button onClick={() => showToast('error 토스트', 'error')}>Error Toast 띄우기</Button>
      <Button onClick={() => showToast('warning 토스트', 'warning')}>Warning Toast 띄우기</Button>
      <Button onClick={() => showToast('Top Positioned 토스트', 'success', 'top')}>Top Toast 띄우기</Button>

      <ToastContainer />
    </div>
  );
};

export const Default: Story = {
  render: () => <ToastDemo />,
};
