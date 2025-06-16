import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { globalHandlers } from '@test/mocks/global/handlers/global.handlers';
import { newsListHandlers } from '@test/mocks/post/handlers/newsList.handlers';
import { Providers } from '@test/utils/renderWithProviders';

import '@/app/globals.css';
import { HotNewsList } from './HotNewsList';

const meta: Meta<typeof HotNewsList> = {
  component: HotNewsList,
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  parameters: {
    msw: {
      handlers: newsListHandlers.hotNewsSuccess,
    },
  },
};

export default meta;
type Story = StoryObj<typeof HotNewsList>;

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
