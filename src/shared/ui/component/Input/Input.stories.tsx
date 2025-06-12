import { Lock, Mail } from 'lucide-react';

import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Input } from '@/shared/ui/component/Input/index';

import '@/app/globals.css';

const meta: Meta<typeof Input> = {
  title: 'Common/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
프로젝트 전역에서 사용할 Input 컴포넌트입니다.  
라벨, 에러 메시지, 아이콘 등을 함께 사용할 수 있습니다.

---

### Props

- **label** (선택)  
  인풋 위에 표시할 라벨 텍스트입니다. (string)

- **error** (선택)  
  에러 메시지를 표시하며, 빨간색 테두리와 함께 강조됩니다. (string)

- **icon** (선택)  
  인풋 왼쪽에 표시할 아이콘을 지정합니다. (ReactNode)

- **ref** (선택)  
  인풋 요소에 대한 Ref를 전달합니다. (Ref<HTMLInputElement>)

- **type** (선택, 기본값: 'text')  
  인풋 타입을 지정합니다.  
  'text', 'password', 'email', 'number' 등 HTML 표준 타입 사용

- **className** (선택)  
  추가적인 커스텀 스타일 클래스를 지정합니다. (string)
      `,
      },
    },
  },
  args: {
    placeholder: '입력하세요',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: '이메일',
  },
};

export const WithIcon: Story = {
  args: {
    label: '이메일',
    icon: <Mail className="w-4 h-4" />,
  },
};

export const Password: Story = {
  args: {
    label: '비밀번호',
    type: 'password',
    icon: <Lock className="w-4 h-4" />,
  },
};

export const ErrorState: Story = {
  args: {
    label: '이메일',
    error: '이메일 형식이 올바르지 않습니다.',
  },
};

export const Disabled: Story = {
  args: {
    label: '이메일',
    value: 'abc@xxx.com',
    disabled: true,
  },
};
