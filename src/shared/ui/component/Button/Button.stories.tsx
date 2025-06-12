import { Menu } from 'lucide-react';
import { fn } from 'storybook/test';

import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Button } from '@/shared/ui/component/Button/index';

import '@/app/globals.css';

const meta: Meta<typeof Button> = {
  title: 'Common/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
프로젝트 전역에서 사용할 버튼 컴포넌트 입니다.

---

### Props

- **variant** (선택, 기본값: 'primary')  
  버튼 스타일을 지정합니다.  
  'primary', 'secondary', 'outline', 'ghost', 'destructive', 'plain'

- **size** (선택, 기본값: 'default')  
  버튼 크기를 지정합니다.  
  'default', 'sm', 'lg', 'icon'

- **loading** (선택, 기본값: false)  
  로딩 상태 여부입니다. true일 경우 스피너가 표시되고 클릭 비활성화됩니다.

- **icon** (선택)  
  버튼 내부 왼쪽에 표시할 아이콘을 지정합니다. (ReactNode)

- **disabled** (선택, 기본값: false)  
  버튼을 비활성화합니다.

- **type** (선택, 기본값: 'button')  
  버튼의 HTML 타입을 지정합니다.  
  'button', 'submit', 'reset'

- **children** (필수)  
  버튼 내부에 표시할 콘텐츠입니다.
      `,
      },
    },
  },
  args: {
    children: '버튼',
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'default',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'default',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'default',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'default',
    children: 'Ghost',
  },
};

export const Icon: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
  },
  render: (args) => (
    <Button {...args}>
      <Menu className="w-4 h-4" />
    </Button>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Button>
      <Menu className="w-4 h-4" /> 메뉴
    </Button>
  ),
};

const LoadingButtonDemo = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000); // 2초 후 loading 해제
  };

  return (
    <Button loading={loading} onClick={handleClick}>
      서버로 전송하기
    </Button>
  );
};

export const LoadingState: Story = {
  render: () => <LoadingButtonDemo />,
};
