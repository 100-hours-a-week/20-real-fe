import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { useSidebarStore } from '@/shared/model/sidebarStore';
import { useToastStore } from '@/shared/model/toastStore';
import { useUserPersistStore } from '@/shared/model/userPersistStore';
import { Sidebar } from '@/shared/ui/section/Sidebar/index';
import { ToastContainer } from '@/shared/ui/section/ToastContainer';

import '@/app/globals.css';
import { Button } from '../../component/Button';

const meta: Meta<typeof Sidebar> = {
  title: 'Common/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
사이드바 컴포넌트입니다.  
로그인 상태에 따라 메뉴 구성이 다르게 표시됩니다.

---

### 주요 기능

- **useSidebarStore**를 통해 열고 닫기 상태 관리  
- **useUserPersistStore**를 통해 로그인 여부에 따라 메뉴 렌더링  
- 로그아웃 시 토스트 알림 표시  

### 사용 예시

\`\`\`tsx
const { open } = useSidebarStore();
open();
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const SidebarDemoPage = () => {
  const { open } = useSidebarStore();
  const { showToast } = useToastStore();
  const { setUser, cleanUser } = useUserPersistStore();

  const simulateLogin = () => {
    setUser({ id: 1, nickname: 'kevin.joung(정현우)/풀스택', role: 'TRAINEE', profileUrl: 'https://placehold.co/36' });
    showToast('로그인 성공', 'success');
  };

  const simulateLogout = () => {
    cleanUser();
    showToast('로그아웃 성공', 'success');
  };

  return (
    <div className="relative flex flex-col min-h-[700px] overflow-hidden w-[100vw] max-w-app">
      <Sidebar />

      <div className="flex flex-col items-center gap-4 p-8 w-[430px] min-h-[700px] justify-center">
        <Button onClick={() => open()}>📂 사이드바 열기</Button>
        <Button onClick={simulateLogin} variant="secondary">
          🔑 로그인 상태로 변경
        </Button>
        <Button onClick={simulateLogout} variant="destructive">
          🚪 로그아웃 상태로 변경
        </Button>
      </div>
    </div>
  );
};

export const InteractiveSidebar: Story = {
  render: () => (
    <>
      <ToastContainer />
      <SidebarDemoPage />
    </>
  ),
};
