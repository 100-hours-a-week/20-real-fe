import type { Meta, StoryObj } from '@storybook/react';

import { SafeImage } from '@/shared/ui/component/SafeImage/index';

import '@/app/globals.css';
import Logo from '../../../../assets/logo.png';

const meta: Meta<typeof SafeImage> = {
  title: 'Common/SafeImage',
  component: SafeImage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
프로젝트 전역에서 사용할 안전한 이미지 렌더링 컴포넌트입니다.  
잘못된 이미지 URL이나 로딩 실패 시, 대체 이미지(fallback)를 표시하거나 기본 플레이스홀더로 대체합니다.

---

### Props

- **src** (선택)  
  표시할 이미지 경로입니다. 비어 있거나 잘못된 URL일 경우 fallback 이미지를 사용합니다.  
  (string | StaticImageData | null)

- **alt** (선택, 기본값: '이미지')  
  이미지 대체 텍스트입니다. (string | null)

- **className** (선택)  
  추가적인 CSS 클래스를 지정합니다. (string)

- **fallbackSrc** (선택)  
  이미지 로드 실패 시 표시할 대체 이미지입니다. (string | StaticImageData)

- **fill** (선택, 기본값: false)  
  true로 설정하면 부모 컨테이너를 가득 채우는 방식으로 렌더링됩니다.

- **width, height** (필수 - \`fill\`이 false일 때)  
  이미지의 고정 크기를 지정합니다. (number)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SafeImage>;

export const Default: Story = {
  args: {
    src: Logo,
    alt: '기본 이미지',
    width: 150,
    height: 150,
  },
};

export const WithFallbackImage: Story = {
  args: {
    src: 'https://via.placeholder.com/fail',
    fallbackSrc: 'https://placehold.co/150',
    alt: 'Fallback 이미지',
    width: 150,
    height: 150,
  },
};

export const WithPlaceholder: Story = {
  args: {
    src: null,
    alt: '플레이스홀더',
    width: 150,
    height: 150,
  },
};

export const WithFill: Story = {
  render: () => (
    <div className="relative w-full h-[300px]">
      <SafeImage src="https://placehold.co/600x300" alt="배너 이미지" fill className="object-cover rounded-lg" />
    </div>
  ),
};
