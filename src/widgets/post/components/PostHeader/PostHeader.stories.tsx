import { Meta, StoryObj } from '@storybook/nextjs-vite';

import { formatToDateString } from '@/shared/lib/times';

import '@/app/globals.css';
import { PostHeader } from './PostHeader';

const meta: Meta<typeof PostHeader> = {
  component: PostHeader,
};

export default meta;

type Story = StoryObj<typeof PostHeader>;

export const 기본: Story = {
  args: {
    title: '게시글 제목',
    tags: ['FE', 'Storybook'],
    createdAt: formatToDateString(new Date()),
    author: 'kevin',
  },
};

export const 조회수: Story = {
  args: {
    title: '게시글 제목',
    viewCount: 240,
    createdAt: formatToDateString(new Date()),
  },
};

export const 조회수_작성자_포함: Story = {
  args: {
    title: '게시글 제목',
    createdAt: formatToDateString(new Date()),
    author: 'kevin',
    viewCount: 240,
  },
};

export const 외부링크: Story = {
  args: {
    title: '블로그 글 링크',
    createdAt: formatToDateString(new Date()),
    author: 'kevin',
    platform: '디스코드',
    originalUrl: 'https://discord.com',
  },
};

export const 많은_태그: Story = {
  args: {
    title: '게시글 제목',
    tags: ['최대', '6개', '끼자민', '렌더링', '됩니다', '나오면 안됨', '나오면 안됨2'],
    createdAt: formatToDateString(new Date()),
    author: 'kevin',
  },
};
