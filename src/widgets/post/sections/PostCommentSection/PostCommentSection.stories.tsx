import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { noticeListHandlers } from '@test/mocks/post/handlers/noticeList.handlers';
import { postCommentHandler } from '@test/mocks/post/handlers/postComment.handler';
import { Providers } from '@test/utils/renderWithProviders';

import { PostTypes } from '@/entities/post/postType';
import { PostCommentSection } from '@/widgets/post/sections/PostCommentSection/PostCommentSection';

import '@/app/globals.css';

const meta: Meta<typeof PostCommentSection> = {
  component: PostCommentSection,
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  parameters: {
    msw: {
      handlers: [...noticeListHandlers.success],
    },
  },
};

export default meta;

type Story = StoryObj<typeof PostCommentSection>;

export const Default: Story = {
  args: {
    type: PostTypes.Notice,
    postId: 1,
    commentCount: 3,
  },
  parameters: {
    msw: {
      handlers: [
        ...postCommentHandler.commentListSuccess,
        ...postCommentHandler.commentCreateSuccess,
        ...postCommentHandler.commentDeleteSuccess,
      ],
    },
  },
};
