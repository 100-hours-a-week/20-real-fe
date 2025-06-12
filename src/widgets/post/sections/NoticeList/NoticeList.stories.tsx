import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { globalHandlers } from '@test/mocks/global/handlers/global.handlers';
import { noticeListHandlers } from '@test/mocks/post/handlers/noticeList.handlers';
import { Providers } from '@test/utils/renderWithProviders';

import { NoticeList } from './NoticeList';

const meta: Meta<typeof NoticeList> = {
  component: NoticeList,
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

type Story = StoryObj<typeof NoticeList>;

export const Default: Story = {};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [...noticeListHandlers.empty],
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
