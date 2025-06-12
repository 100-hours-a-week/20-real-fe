import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { MarkdownViewer } from '@/shared/ui/section/MarkdownViewer/index';

import '@/app/globals.css';

const meta: Meta<typeof MarkdownViewer> = {
  title: 'Common/MarkdownViewer',
  component: MarkdownViewer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
프로젝트 전역에서 사용할 마크다운 렌더링 컴포넌트입니다.  
입력된 마크다운 텍스트를 HTML로 변환하여 렌더링합니다.

---

### Props

- **text** (필수)  
  렌더링할 마크다운 문자열입니다. (string)

- **className** (선택)  
  추가적인 커스텀 스타일 클래스를 지정합니다. (string)
      `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownViewer>;

const MarkdownDemo = () => {
  const [markdown, setMarkdown] = useState<string>(`# 📖 마크다운 미리보기

## ✨ 이건 H2 제목입니다

### 📌 이건 H3 제목입니다


**굵은 텍스트 (Bold)**  
_기울임 텍스트 (Italic)_  
~~취소선 (Strikethrough)~~

> 💡 콜아웃 박스 예시입니다.  
> 중요한 정보를 이렇게 강조할 수 있어요!

[서비스 이동하기](https://www.kakaotech.com/)

---

### 📋 리스트 예시

- 첫 번째 아이템
- 두 번째 아이템
  - 하위 아이템
  - 또 다른 하위 아이템

1. 첫 번째 순서
2. 두 번째 순서
3. 세 번째 순서

---

### 📊 테이블 예시

| 이름  | 과정 | 담당     |
|-------|-----|---------|
| kevin.joung(정현우) | 풀스택  | 프론트엔드 |
| arnold.kim(김세호) | 풀스택  | 백엔드 |

---

### 💻 코드 블록 예시

\`\`\`js
function sayHello() {
  console.log('안녕하세요!');
}
sayHello();
\`\`\`

인라인 코드 예시: \`const name = "현우";\`

`);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        className="w-full md:w-1/2 h-[400px] p-2 border border-gray-300 rounded text-sm font-mono"
        placeholder="마크다운을 입력해주세요."
      />
      <div className="w-full md:w-1/2 p-2 border border-gray-300 rounded overflow-auto h-[400px]">
        <MarkdownViewer text={markdown} />
      </div>
    </div>
  );
};

export const LivePreview: Story = {
  render: () => <MarkdownDemo />,
};
