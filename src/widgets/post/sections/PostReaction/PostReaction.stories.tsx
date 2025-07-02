import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { postReactionHandler } from '@test/mocks/post/handlers/postReaction.handler';

import Providers from '@/app/providers';
import { PostTypes } from '@/entities/post/postType';

import { PostReaction } from './PostReaction';

// Mock Provider 추가
const meta: Meta<typeof PostReaction> = {
  component: PostReaction,
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  parameters: {
    msw: {
      handlers: [...postReactionHandler.likeSuccess],
    },
  },
};

export default meta;

type Story = StoryObj<typeof PostReaction>;

export const Unliked: Story = {
  args: {
    type: PostTypes.Notice,
    postId: 1,
    userLike: false,
    likeCount: 3,
  },
};

export const Liked: Story = {
  args: {
    type: PostTypes.Notice,
    postId: 1,
    userLike: true,
    likeCount: 7,
  },
};
