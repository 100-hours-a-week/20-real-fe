import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { globalHandlers } from '@test/mocks/global/handlers/global.handlers';
import { newsListHandlers } from '@test/mocks/post/handlers/newsList.handlers';

import Providers from '@/app/providers';

import '@/app/globals.css';
import { NewsList } from './NewsList';

const meta: Meta<typeof NewsList> = {
  component: NewsList,
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  parameters: {
    msw: {
      handlers: newsListHandlers.newsSuccess,
    },
  },
};

export default meta;
type Story = StoryObj<typeof NewsList>;

export const Default: Story = {};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [...newsListHandlers.empty],
    },
  },
};

export const Unauthorized: Story = {
  parameters: {
    msw: {
      handlers: [...globalHandlers.unauthorized],
    },
  },
};

export const Forbidden: Story = {
  parameters: {
    msw: {
      handlers: [...globalHandlers.forbidden],
    },
  },
};

export const UnknownError: Story = {
  parameters: {
    msw: {
      handlers: [...globalHandlers.unknown],
    },
  },
};
